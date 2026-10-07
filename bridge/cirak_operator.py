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

    def call(self, route: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
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
        if not isinstance(data, dict):
            raise OperatorError(f"API {route}: unexpected response type")
        if data.get("hata"):
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
            key: ("<redacted>" if key in {"email", "password", "cookie", "token"} else value)
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
