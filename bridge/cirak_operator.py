#!/usr/bin/env python3
"""GitHub-hosted, one-shot operator for the arastirmaci42 Çırak account.

The operator intentionally reads only cirak/oturum_cerez.txt from the handover
archive. It never reads bot_kit/ credentials and never prints the cookie.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
import urllib.error
import urllib.request
import zipfile
from pathlib import Path
from typing import Any

API_ROOT = "https://oyunsitem.com/cirak/api/"
EXPECTED_USER = "arastirmaci42"
COOKIE_MEMBER = "cirak/oturum_cerez.txt"
COOKIE_NAME = "tezgah_oturum"


class OperatorError(RuntimeError):
    pass


def load_cookie(archive: Path) -> str:
    with zipfile.ZipFile(archive) as zf:
        try:
            text = zf.read(COOKIE_MEMBER).decode("utf-8")
        except KeyError as exc:
            raise OperatorError(f"Archive does not contain {COOKIE_MEMBER}") from exc

    for line in text.splitlines():
        if not line or line.startswith("#"):
            continue
        fields = line.split("\t")
        if len(fields) >= 7 and fields[-2] == COOKIE_NAME:
            value = fields[-1].strip()
            if len(value) < 20:
                break
            return value
    raise OperatorError("The arastirmaci42 session cookie was not found")


class Api:
    def __init__(self, cookie: str) -> None:
        self.opener = urllib.request.build_opener()
        self.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cookie": f"{COOKIE_NAME}={cookie}",
            "Referer": "https://oyunsitem.com/cirak/",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
        }

    def call(self, route: str, payload: dict[str, Any] | None = None) -> Any:
        url = API_ROOT + route
        body = json.dumps(payload, ensure_ascii=False).encode() if payload is not None else None
        request = urllib.request.Request(url, data=body, headers=self.headers)
        try:
            with self.opener.open(request, timeout=30) as response:
                raw = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            raw = exc.read().decode("utf-8", errors="replace")
            try:
                detail = json.loads(raw)
            except json.JSONDecodeError:
                detail = {"hata": f"HTTP {exc.code}"}
            raise OperatorError(f"API {route}: {detail}") from exc
        except OSError as exc:
            raise OperatorError(f"API {route}: connection failed: {exc}") from exc

        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise OperatorError(f"API {route}: non-JSON response") from exc
        if not isinstance(data, (dict, list)):
            raise OperatorError(f"API {route}: unexpected response type")
        if isinstance(data, dict) and data.get("hata"):
            raise OperatorError(f"API {route}: {data['hata']}")
        return data


def require_account(api: Api) -> dict[str, Any]:
    status = api.call("durum")
    player = status.get("oyuncu") or {}
    username = player.get("kullaniciAdi")
    if username != EXPECTED_USER:
        raise OperatorError(
            f"Safety stop: expected {EXPECTED_USER!r}, API returned {username!r}"
        )
    return status


def status_operation(api: Api) -> dict[str, Any]:
    status = require_account(api)
    return {
        "durum": status,
        "banka": api.call("banka"),
        "vergi": api.call("vergi"),
        "vaka": api.call("vaka"),
        "mini_oyun": api.call("mini-oyun/sira?kod=genel"),
        "cadde": api.call("cadde"),
    }


def pay_tax_operation(api: Api, command: dict[str, Any]) -> dict[str, Any]:
    status = require_account(api)
    before_bank = api.call("banka")
    before_tax = api.call("vergi")
    pending = [
        row for row in (before_tax.get("beyanlar") or [])
        if row.get("durum") in {"bekliyor", "gecikti"} and int(row.get("kalan") or 0) > 0
    ]
    if not pending:
        return {
            "already_paid": True,
            "durum": status,
            "banka": before_bank,
            "vergi": before_tax,
        }

    ids = sorted(int(row["id"]) for row in pending)
    expected_ids = sorted(int(value) for value in command.get("expected_declaration_ids", []))
    if expected_ids and ids != expected_ids:
        raise OperatorError(f"Safety stop: pending tax IDs {ids}, expected {expected_ids}")

    total = sum(int(row.get("kalan") or 0) for row in pending)
    maximum = int(command.get("max_total_kurus") or 0)
    if maximum <= 0 or total > maximum:
        raise OperatorError(f"Safety stop: tax total {total} exceeds maximum {maximum}")

    available = int(before_bank.get("nakit") or 0) + int(before_bank.get("vadesiz") or 0)
    if available < total:
        raise OperatorError(f"Safety stop: available funds {available}, tax total {total}")

    payments = []
    for row in pending:
        payments.append({
            "id": int(row["id"]),
            "amount": int(row.get("kalan") or 0),
            "response": api.call("vergi/ode", {"id": int(row["id"])}),
        })

    after_tax = api.call("vergi")
    remaining = sum(
        int(row.get("kalan") or 0)
        for row in (after_tax.get("beyanlar") or [])
        if row.get("durum") in {"bekliyor", "gecikti"}
    )
    if remaining:
        raise OperatorError(f"Tax API returned but {remaining} kuruş remains")

    return {
        "already_paid": False,
        "payments": payments,
        "before": {"banka": before_bank, "vergi": before_tax},
        "after": {"banka": api.call("banka"), "vergi": after_tax},
    }


def request_recovery_email_operation(api: Api, command: dict[str, Any]) -> dict[str, Any]:
    status = require_account(api)
    player = status.get("oyuncu") or {}
    if player.get("eposta"):
        return {"already_linked": True, "email_present": True}

    email = str(command.get("email") or "").strip()
    if "@" not in email or len(email) > 120:
        raise OperatorError("Safety stop: a valid recovery email is required")

    message = (
        "arastirmaci42 hesabına açık oturumla erişiyorum; ancak hesap oluşturulurken "
        "üretilen şifre kaydedilmemiş ve Hesabım bölümünde e-posta görünmüyor. "
        "Şifre yenileme yapabilmem için bu formda belirttiğim e-posta adresini hesaba "
        "bağlar mısınız? Aynı talebi 5 Ekim 2026 tarihinde de göndermiştim. Teşekkürler."
    )
    response = api.call("iletisim", {"eposta": email, "konu": "Hesabım", "metin": message})
    return {"already_linked": False, "request_sent": True, "response": response}


def maintain_businesses_and_stalls_operation(api: Api, command: dict[str, Any]) -> dict[str, Any]:
    require_account(api)
    raw_shops = api.call("isletmelerim")
    if isinstance(raw_shops, list):
        shops = raw_shops
    elif isinstance(raw_shops, dict):
        shops = raw_shops.get("isletmeler") or raw_shops.get("liste") or []
    else:
        shops = []
    if not shops:
        raise OperatorError("No owned businesses were returned")

    details = []
    for shop in shops:
        shop_id = int(shop.get("id") or 0)
        if shop_id:
            details.append(api.call(f"isletme/{shop_id}"))

    collections = []
    for shop in details:
        amount = int(shop.get("kasa") or 0)
        if amount <= 0:
            continue
        shop_id = int(shop["id"])
        try:
            response = api.call(f"isletme/{shop_id}/kasa", {})
            collections.append({"id": shop_id, "ad": shop.get("ad"), "before": amount, "response": response})
        except OperatorError as exc:
            collections.append({"id": shop_id, "ad": shop.get("ad"), "before": amount, "error": str(exc)})

    details = [api.call(f"isletme/{int(shop['id'])}") for shop in details]
    stock_plan = []
    for shop in details:
        products = shop.get("urunler") or []
        if shop.get("hizmet") or shop.get("durum") != "acik" or not products:
            continue
        empty = max(0, int(shop.get("kapasite") or 0) - int(shop.get("doluluk") or 0))
        each = empty // len(products)
        cost = sum(int(product.get("toptan") or 0) * each for product in products)
        stock_plan.append({"shop": shop, "each": each, "cost": cost})

    total_stock_cost = sum(row["cost"] for row in stock_plan)
    maximum = int(command.get("max_stock_cost_kurus") or 0)
    if maximum <= 0 or total_stock_cost > maximum:
        raise OperatorError(
            f"Safety stop after cash collection: stock cost {total_stock_cost} exceeds maximum {maximum}"
        )
    current = require_account(api)
    available = int((current.get("oyuncu") or {}).get("bakiye") or 0)
    if total_stock_cost > available:
        raise OperatorError(
            f"Safety stop after cash collection: balance {available}, stock cost {total_stock_cost}"
        )

    stocking = []
    for row in stock_plan:
        shop, each = row["shop"], row["each"]
        shop_id = int(shop["id"])
        bought = []
        errors = []
        if each > 0:
            for product in shop.get("urunler") or []:
                try:
                    response = api.call(
                        f"isletme/{shop_id}/stok",
                        {"urun": product["kod"], "miktar": each},
                    )
                    bought.append({"urun": product["kod"], "miktar": each, "response": response})
                except OperatorError as exc:
                    errors.append({"urun": product.get("kod"), "error": str(exc)})
        auto_response = None
        auto_error = None
        if not shop.get("otoTedarik"):
            try:
                auto_response = api.call(f"isletme/{shop_id}/oto", {"acik": True})
            except OperatorError as exc:
                auto_error = str(exc)
        stocking.append({
            "id": shop_id,
            "ad": shop.get("ad"),
            "each": each,
            "planned_cost": row["cost"],
            "bought": bought,
            "errors": errors,
            "auto_supply": auto_response,
            "auto_error": auto_error,
        })

    stall_summary: dict[str, Any] = {"collected": None, "permit": None, "started": []}
    try:
        stall_summary["collected"] = api.call("seyyar/topla-hepsi", {})
    except OperatorError as exc:
        stall_summary["collect_note"] = str(exc)

    stalls = api.call("seyyar")
    permit_info = (stalls.get("izin") or {}) if isinstance(stalls, dict) else {}
    if not permit_info.get("var"):
        try:
            stall_summary["permit"] = api.call("seyyar/izin", {})
        except OperatorError as exc:
            stall_summary["permit_error"] = str(exc)
    stalls = api.call("seyyar")
    jobs = {job.get("kod"): job for job in (stalls.get("isler") or [])}
    active = {
        job.get("isKodu") for job in (stalls.get("aktifler") or [])
        if not job.get("bitti")
    }
    priorities = ["pazar", "simit", "pamuk", "semsiye", "kestane", "misir", "gozleme", "midye"]
    for code in priorities:
        job = jobs.get(code) or {}
        if not job.get("sahip") or code in active:
            continue
        try:
            response = api.call("seyyar/basla", {"isKodu": code, "sure": "tam"})
            stall_summary["started"].append({"kod": code, "response": response})
            active.add(code)
        except OperatorError as exc:
            stall_summary["started"].append({"kod": code, "error": str(exc)})

    after_shops = []
    for shop in details:
        fresh = api.call(f"isletme/{int(shop['id'])}")
        after_shops.append({
            "id": fresh.get("id"), "ad": fresh.get("ad"), "tur": fresh.get("tur"),
            "durum": fresh.get("durum"), "hizmet": fresh.get("hizmet"),
            "kasa": fresh.get("kasa"), "doluluk": fresh.get("doluluk"),
            "kapasite": fresh.get("kapasite"), "otoTedarik": fresh.get("otoTedarik"),
        })
    final_status = require_account(api)
    return {
        "collections": collections,
        "stock_cost_planned": total_stock_cost,
        "stocking": stocking,
        "stalls": stall_summary,
        "businesses_after": after_shops,
        "balance_after": int((final_status.get("oyuncu") or {}).get("bakiye") or 0),
    }


def finish_inventory_operation(api: Api, command: dict[str, Any]) -> dict[str, Any]:
    import re

    require_account(api)
    raw_shops = api.call("isletmelerim")
    shops = raw_shops if isinstance(raw_shops, list) else (
        raw_shops.get("isletmeler") or raw_shops.get("liste") or []
    )
    maximum = int(command.get("max_stock_cost_kurus") or 0)
    spent = 0
    results = []
    for listed in shops:
        shop_id = int(listed.get("id") or 0)
        if not shop_id:
            continue
        shop = api.call(f"isletme/{shop_id}")
        products = shop.get("urunler") or []
        if shop.get("hizmet") or shop.get("durum") != "acik" or not products:
            continue
        actions = []
        for product in products:
            fresh = api.call(f"isletme/{shop_id}")
            remaining = max(0, int(fresh.get("kapasite") or 0) - int(fresh.get("doluluk") or 0))
            if remaining <= 0:
                break
            amount = remaining
            response = None
            try:
                estimated = int(product.get("toptan") or 0) * amount
                if maximum <= 0 or spent + estimated > maximum:
                    raise OperatorError("Safety stop: inventory cost limit reached")
                response = api.call(
                    f"isletme/{shop_id}/stok",
                    {"urun": product["kod"], "miktar": amount},
                )
            except OperatorError as exc:
                match = re.search(r"yalnızca (\d+)", str(exc), flags=re.IGNORECASE)
                if not match:
                    actions.append({"urun": product.get("kod"), "error": str(exc)})
                    continue
                amount = int(match.group(1))
                if amount <= 0:
                    continue
                estimated = int(product.get("toptan") or 0) * amount
                if maximum <= 0 or spent + estimated > maximum:
                    raise OperatorError("Safety stop: inventory cost limit reached")
                response = api.call(
                    f"isletme/{shop_id}/stok",
                    {"urun": product["kod"], "miktar": amount},
                )
            spent += int(product.get("toptan") or 0) * amount
            actions.append({"urun": product.get("kod"), "miktar": amount, "response": response})
        final = api.call(f"isletme/{shop_id}")
        if not final.get("otoTedarik"):
            api.call(f"isletme/{shop_id}/oto", {"acik": True})
            final = api.call(f"isletme/{shop_id}")
        results.append({
            "id": shop_id, "ad": final.get("ad"), "actions": actions,
            "doluluk": final.get("doluluk"), "kapasite": final.get("kapasite"),
            "otoTedarik": final.get("otoTedarik"),
        })
    status = require_account(api)
    return {
        "spent_estimate": spent,
        "shops": results,
        "balance_after": int((status.get("oyuncu") or {}).get("bakiye") or 0),
    }


def transfer_and_maintain_operation(api: Api, command: dict[str, Any]) -> dict[str, Any]:
    require_account(api)
    iban = str(command.get("iban") or "").replace(" ", "").strip()
    aciklama = str(command.get("aciklama") or "Günlük pay").strip()
    target_amount = int(command.get("amount_kurus") or 100000000)

    # 1. Verify recipient
    alici = api.call(f"banka/havale/alici?ad={iban}")
    if not alici or str(alici.get("id")) != "14" or alici.get("ad") != "Karahan":
        raise OperatorError(f"Recipient verification failed: expected Karahan (14), got {alici}")

    # 2. Check transfer limits and balances
    hv = api.call("banka/havale")
    limit = int(hv.get("sinir") or 0)
    used_today = int(hv.get("bugun") or 0)
    allowed = max(0, limit - used_today)
    if allowed <= 0:
        raise OperatorError("Daily transfer limit already reached today")
    send_amount = min(target_amount, allowed)

    b_before = api.call("banka")
    vadesiz = int(b_before.get("vadesiz") or 0)
    nakit = int(b_before.get("nakit") or 0)

    if vadesiz < send_amount:
        needed = send_amount - vadesiz
        if nakit < needed:
            raise OperatorError(f"Insufficient funds: nakit={nakit}, needed={needed}")
        deposit_resp = api.call("banka/yatir", {"tutar": needed})

    # 3. Send havale
    havale_resp = api.call("banka/havale", {
        "alici": iban,
        "tutar": send_amount,
        "aciklama": aciklama
    })

    # 4. Perform business maintenance & stall maintenance
    maintenance_res = maintain_businesses_and_stalls_operation(api, {
        "max_stock_cost_kurus": int(command.get("max_stock_cost_kurus") or 10000000)
    })
    finish_inv_res = finish_inventory_operation(api, {
        "max_stock_cost_kurus": int(command.get("max_stock_cost_kurus") or 10000000)
    })

    final_bank = api.call("banka")
    final_durum = require_account(api)

    return {
        "transfer": {
            "alici": alici,
            "amount_sent_kurus": send_amount,
            "response": havale_resp,
        },
        "maintenance": maintenance_res,
        "finish_inventory": finish_inv_res,
        "final_bank": {
            "nakit": final_bank.get("nakit"),
            "vadesiz": final_bank.get("vadesiz"),
        },
        "final_player": {
            "bakiye": (final_durum.get("oyuncu") or {}).get("bakiye"),
            "tecrube": (final_durum.get("oyuncu") or {}).get("tecrube"),
        }
    }


def check_liquidation_and_transfer_operation(api: Api, command: dict[str, Any]) -> dict[str, Any]:
    require_account(api)
    iban = str(command.get("iban") or "").replace(" ", "").strip()
    alici_info = None
    alici_error = None
    try:
        alici_info = api.call(f"banka/havale/alici?ad={iban}")
    except Exception as exc:
        alici_error = str(exc)

    havale_info = None
    try:
        havale_info = api.call("banka/havale")
    except Exception as exc:
        havale_info = {"error": str(exc)}

    raw_isletmeler = api.call("isletmelerim")
    isletmeler_list = raw_isletmeler if isinstance(raw_isletmeler, list) else (raw_isletmeler.get("liste") or raw_isletmeler.get("isletmeler") or [])
    seyyar = api.call("seyyar")
    banka = api.call("banka")

    return {
        "target_iban": iban,
        "alici": alici_info,
        "alici_error": alici_error,
        "havale_info": havale_info,
        "banka": banka,
        "isletmeler_count": len(isletmeler_list),
        "isletmeler": [
            {"id": x.get("id"), "tur": x.get("tur"), "ad": x.get("ad"), "kasa": x.get("kasa")}
            for x in isletmeler_list
        ],
        "seyyar_sahip": [
            {"kod": x.get("kod"), "ad": x.get("ad"), "fiyat": x.get("fiyat")}
            for x in (seyyar.get("turler") or [])
            if x.get("sahip")
        ]
    }


def start_google_link_operation(api: Api) -> dict[str, Any]:
    require_account(api)
    baglantilar = api.call("oauth/baglantilar")

    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None

    opener = urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(
        API_ROOT + "oauth/google/basla?bagla=1",
        headers={
            "Cookie": api.headers["Cookie"],
            "Referer": "https://oyunsitem.com/cirak/",
            "User-Agent": api.headers["User-Agent"],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    link_url = None
    try:
        with opener.open(req, timeout=30) as resp:
            link_url = resp.geturl()
    except urllib.error.HTTPError as exc:
        if exc.code in (301, 302, 303, 307, 308):
            link_url = exc.headers.get("Location")
        else:
            raw = exc.read().decode("utf-8", errors="replace")
            raise OperatorError(f"OAuth request HTTP {exc.code}: {raw}")
    except Exception as exc:
        raise OperatorError(f"OAuth request failed: {exc}")

    return {
        "baglantilar": baglantilar,
        "google_auth_url": link_url,
    }


def submit_password_reset_operation(api: Api, command: dict[str, Any]) -> dict[str, Any]:
    email = str(command.get("email") or "").strip()
    code = str(command.get("verification_code") or "").strip()
    key = str(command.get("verification_key") or "").strip()
    if "@" not in email or not code or not key:
        raise OperatorError("Password reset email, verification code and key are required")
    response = api.call("sifremi-unuttum", {
        "kim": email,
        "dogrulamaKod": code,
        "dogrulamaAnahtar": key,
        "dil": "tr",
    })
    return {"request_sent": True, "response": response}


def password_reset_challenge_operation(api: Api) -> dict[str, Any]:
    challenge = api.call("dogrulama")
    if not challenge.get("anahtar") or not challenge.get("resim"):
        raise OperatorError("Password reset challenge was not returned")
    return {"challenge": challenge}


def run(command: dict[str, Any], api: Api) -> dict[str, Any]:
    operation = command.get("operation")
    if operation == "status":
        return status_operation(api)
    if operation == "pay_tax":
        return pay_tax_operation(api, command)
    if operation == "request_recovery_email":
        return request_recovery_email_operation(api, command)
    if operation == "password_reset_challenge":
        return password_reset_challenge_operation(api)
    if operation == "maintain_businesses_and_stalls":
        return maintain_businesses_and_stalls_operation(api, command)
    if operation == "finish_inventory":
        return finish_inventory_operation(api, command)
    if operation == "submit_password_reset":
        return submit_password_reset_operation(api, command)
    if operation == "start_google_link":
        return start_google_link_operation(api)
    if operation == "check_liquidation_and_transfer":
        return check_liquidation_and_transfer_operation(api, command)
    if operation == "transfer_and_maintain":
        return transfer_and_maintain_operation(api, command)
    raise OperatorError(f"Unsupported operation: {operation!r}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--archive", required=True, type=Path)
    parser.add_argument("--command", required=True, type=Path)
    parser.add_argument("--result", required=True, type=Path)
    args = parser.parse_args()

    result: dict[str, Any] = {
        "time_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
        "command": None,
        "ok": False,
    }
    try:
        command = json.loads(args.command.read_text(encoding="utf-8"))
        result["command"] = {
            key: ("<redacted>" if key in {"email", "password", "cookie", "token", "verification_code", "verification_key"} else value)
            for key, value in command.items()
        }
        cookie = load_cookie(args.archive)
        result["data"] = run(command, Api(cookie))
        result["ok"] = True
    except Exception as exc:  # Persist a sanitized failure for the controller.
        result["error"] = str(exc)

    args.result.parent.mkdir(parents=True, exist_ok=True)
    args.result.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({"ok": result["ok"], "command": result["command"], "error": result.get("error")}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
