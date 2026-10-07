// Açılış: oyun dosyalarını ilerleme çubuğuyla indirir, sonra oyunu başlatır.
// Bu dosya hiçbir kütüphaneye bağlı değildir, böylece çubuk hemen görünür.

const DOSYALAR = /*LISTE*/[{"yol": "lib/three.module.min.js", "boyut": 691648}, {"yol": "model/insan.glb", "boyut": 711232}, {"yol": "veri/turkiye.json", "boyut": 83893}, {"yol": "veri/dunya.json", "boyut": 199933}, {"yol": "doku/ahsap.jpg", "boyut": 29357}, {"yol": "doku/asfalt.jpg", "boyut": 119622}, {"yol": "doku/asfalt_n.jpg", "boyut": 88821}, {"yol": "doku/cim.jpg", "boyut": 19598}, {"yol": "doku/kiremit.jpg", "boyut": 27918}, {"yol": "doku/kiremit_n.jpg", "boyut": 49841}, {"yol": "doku/parke.jpg", "boyut": 106829}, {"yol": "doku/parke_n.jpg", "boyut": 262037}, {"yol": "doku/siva.jpg", "boyut": 14321}, {"yol": "doku/siva_n.jpg", "boyut": 93596}, {"yol": "doku/tugla.jpg", "boyut": 40572}, {"yol": "doku/tugla_n.jpg", "boyut": 64185}]/*LISTE*/;
// Açılış metinleri oyuncunun dilinde (dil dosyası henüz yüklenmeden; tercih bu tarayıcıda saklanır)
let ACILIS_DIL = 'tr';
try { ACILIS_DIL = localStorage.getItem('cirak_dil') || 'tr'; } catch (_) { /* yok say */ }
const ACILIS_SOZLUK = {"en":{"Harita açılıyor":"Opening the map","Sokaklar döşeniyor":"Laying the streets","Esnaf tezgâhlarını kuruyor":"Vendors are setting up their stalls","Arabalar yola çıkıyor":"Cars are hitting the road","Mahalle uyanıyor":"The neighbourhood is waking up","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 Tap the order bubbles of customers at your stall to earn tips.","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 Log in every day and your daily reward grows. Day 7 brings a free street vendor permit! The count starts on your first login.","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 Corn sells best in summer, chestnuts in winter. Follow the seasons.","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 You can run several stalls; an apprentice looks after the second one.","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 Once you can afford it, rent a shop marked FOR RENT on the avenue.","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 Keep automatic supply on in your shop so the shelves never run empty.","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 Invite a friend: they get 5,000 ₺, you get 10,000 ₺.","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ Don't forget to renew your street vendor permit, or the municipal police will fine you.","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 Use the compass button to see your neighbourhood from above.","Dosyalar hazır, oyun hazırlanıyor":"Files ready, preparing the game","Modeller hazırlanıyor":"Preparing models","Mahalle bilgileri alınıyor":"Loading neighbourhood data","Görüntü hazırlanıyor":"Preparing the view","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"Loading was interrupted. Check your internet connection and refresh the page."},"de":{"Harita açılıyor":"Karte wird geöffnet","Sokaklar döşeniyor":"Straßen werden gepflastert","Esnaf tezgâhlarını kuruyor":"Händler bauen ihre Stände auf","Arabalar yola çıkıyor":"Autos fahren los","Mahalle uyanıyor":"Das Viertel erwacht","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 Tippe auf die Bestellblasen der Kunden an deinem Stand und kassiere Trinkgeld.","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 Melde dich täglich an, dann wächst deine Tagesbelohnung. Am 7. Tag gibt es eine Straßenhändler-Lizenz gratis! Die Zählung beginnt mit deinem ersten Login.","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 Mais verkauft sich im Sommer, Maronen im Winter am besten. Achte auf die Jahreszeit.","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 Du kannst mehrere Stände betreiben; um den zweiten kümmert sich ein Lehrling.","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 Sobald du genug Geld hast, miete an der Straße einen Laden mit dem Schild ZU VERMIETEN.","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 Lass die automatische Belieferung in deinem Laden an, damit die Regale nie leer werden.","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 Lade Freunde ein: Sie bekommen 5.000 ₺, du 10.000 ₺.","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ Vergiss nicht, deine Straßenhändler-Lizenz zu verlängern, sonst verhängt das Ordnungsamt eine Strafe.","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 Mit dem Kompass-Knopf siehst du dein Viertel aus der Vogelperspektive.","Dosyalar hazır, oyun hazırlanıyor":"Dateien bereit, Spiel wird vorbereitet","Modeller hazırlanıyor":"Modelle werden vorbereitet","Mahalle bilgileri alınıyor":"Viertelsdaten werden geladen","Görüntü hazırlanıyor":"Ansicht wird vorbereitet","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"Der Ladevorgang wurde unterbrochen. Prüfe deine Internetverbindung und lade die Seite neu."},"fr":{"Harita açılıyor":"Ouverture de la carte","Sokaklar döşeniyor":"Pose des rues","Esnaf tezgâhlarını kuruyor":"Les marchands installent leurs étals","Arabalar yola çıkıyor":"Les voitures prennent la route","Mahalle uyanıyor":"Le quartier se réveille","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 Touche les bulles de commande des clients à ton étal pour gagner des pourboires.","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 Connecte-toi chaque jour et ta récompense quotidienne augmente. Le 7e jour, un permis de vendeur ambulant offert ! Le compteur démarre à ta première connexion.","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 Le maïs se vend mieux l’été, les châtaignes l’hiver. Suis les saisons.","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 Tu peux faire tourner plusieurs étals ; un apprenti s’occupe du deuxième.","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 Quand tu en as les moyens, loue une boutique marquée À LOUER sur l’avenue.","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 Laisse l’approvisionnement automatique activé pour que tes rayons ne soient jamais vides.","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 Invite un ami : il reçoit 5 000 ₺, toi 10 000 ₺.","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ N’oublie pas de renouveler ton permis de vendeur ambulant, sinon la police municipale te verbalise.","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 Avec le bouton boussole, vois ton quartier vu du ciel.","Dosyalar hazır, oyun hazırlanıyor":"Fichiers prêts, préparation du jeu","Modeller hazırlanıyor":"Préparation des modèles","Mahalle bilgileri alınıyor":"Chargement du quartier","Görüntü hazırlanıyor":"Préparation de l’affichage","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"Le chargement a été interrompu. Vérifie ta connexion Internet et actualise la page."},"es":{"Harita açılıyor":"Abriendo el mapa","Sokaklar döşeniyor":"Pavimentando las calles","Esnaf tezgâhlarını kuruyor":"Los comerciantes montan sus puestos","Arabalar yola çıkıyor":"Los coches salen a la calle","Mahalle uyanıyor":"El barrio se despierta","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 Toca los globos de pedido de los clientes en tu puesto y gana propinas.","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 Entra cada día y tu recompensa diaria crece. ¡El día 7 te regalamos un permiso de vendedor ambulante! El contador empieza el día de tu primera entrada.","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 El maíz se vende más en verano y las castañas en invierno. Sigue las estaciones.","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 Puedes tener varios puestos; un aprendiz se encarga del segundo.","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 Cuando te alcance el dinero, alquila en la avenida un local con el cartel SE ALQUILA.","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 Mantén activado el suministro automático para que tus estantes nunca se vacíen.","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 Invita a un amigo: él recibe 5.000 ₺ y tú 10.000 ₺.","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ No olvides renovar tu permiso de vendedor ambulante o la policía municipal te multará.","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 Con el botón de la brújula ves tu barrio desde arriba.","Dosyalar hazır, oyun hazırlanıyor":"Archivos listos, preparando el juego","Modeller hazırlanıyor":"Preparando modelos","Mahalle bilgileri alınıyor":"Cargando datos del barrio","Görüntü hazırlanıyor":"Preparando la vista","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"La carga se interrumpió. Revisa tu conexión a internet y recarga la página."},"pt":{"Harita açılıyor":"Abrindo o mapa","Sokaklar döşeniyor":"Pavimentando as ruas","Esnaf tezgâhlarını kuruyor":"Os comerciantes montam suas barracas","Arabalar yola çıkıyor":"Os carros saem às ruas","Mahalle uyanıyor":"O bairro está acordando","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 Toque nos balões de pedido dos clientes na sua barraca e ganhe gorjetas.","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 Entre todos os dias e sua recompensa diária cresce. No 7º dia, ganhe uma licença de vendedor ambulante! A contagem começa no seu primeiro acesso.","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 Milho vende mais no verão, castanhas no inverno. Acompanhe as estações.","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 Você pode ter várias barracas; um aprendiz cuida da segunda.","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 Quando tiver dinheiro, alugue na avenida uma loja com a placa ALUGA-SE.","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 Deixe o abastecimento automático ligado para as prateleiras nunca ficarem vazias.","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 Convide um amigo: ele ganha 5.000 ₺ e você 10.000 ₺.","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ Não se esqueça de renovar sua licença de vendedor ambulante, ou a fiscalização vai multar você.","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 Com o botão da bússola você vê seu bairro de cima.","Dosyalar hazır, oyun hazırlanıyor":"Arquivos prontos, preparando o jogo","Modeller hazırlanıyor":"Preparando modelos","Mahalle bilgileri alınıyor":"Carregando dados do bairro","Görüntü hazırlanıyor":"Preparando a visualização","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"O carregamento foi interrompido. Verifique sua conexão com a internet e atualize a página."},"ar":{"Harita açılıyor":"جارٍ فتح الخريطة","Sokaklar döşeniyor":"جارٍ رصف الشوارع","Esnaf tezgâhlarını kuruyor":"التجار ينصبون بسطاتهم","Arabalar yola çıkıyor":"السيارات تنطلق إلى الطريق","Mahalle uyanıyor":"الحي يستيقظ","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 اضغط على فقاعات طلبات الزبائن عند بسطتك واربح البقشيش.","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 ادخل كل يوم لتكبر مكافأتك اليومية. في اليوم السابع رخصة بائع متجول هدية! يبدأ العدّ من يوم دخولك الأول.","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 الذرة تُباع أكثر صيفًا والكستناء شتاءً. تابع المواسم.","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 يمكنك تشغيل أكثر من بسطة، ويتولى صبيٌّ متدرب البسطة الثانية.","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 حين يكفي مالك، استأجر في الشارع متجرًا مكتوبًا عليه «للإيجار».","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 أبقِ التوريد التلقائي مفعّلًا في متجرك كي لا تفرغ الرفوف أبدًا.","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 ادعُ صديقك: يحصل على 5.000 ₺ وتحصل أنت على 10.000 ₺.","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ لا تنسَ تجديد رخصة البيع المتجول، وإلا فرضت عليك الشرطة البلدية غرامة.","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 بزر البوصلة ترى حيّك من الأعلى.","Dosyalar hazır, oyun hazırlanıyor":"الملفات جاهزة، جارٍ تجهيز اللعبة","Modeller hazırlanıyor":"جارٍ تجهيز النماذج","Mahalle bilgileri alınıyor":"جارٍ تحميل بيانات الحي","Görüntü hazırlanıyor":"جارٍ تجهيز العرض","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"توقف التحميل. تحقق من اتصالك بالإنترنت ثم حدّث الصفحة."},"zh-CN":{"Harita açılıyor":"正在打开地图","Sokaklar döşeniyor":"正在铺设街道","Esnaf tezgâhlarını kuruyor":"摊贩正在摆摊","Arabalar yola çıkıyor":"汽车开上了街","Mahalle uyanıyor":"街区正在苏醒","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 点击摊位前顾客的订单气泡，赚取小费。","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 每天登录，每日奖励越来越多。第 7 天赠送流动摊贩许可证！从你首次登录那天开始计数。","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 玉米夏天好卖，栗子冬天好卖。留意季节。","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 你可以同时经营多个摊位，第二个由学徒照看。","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 钱够了就去大街上租一间挂着“出租”的店铺。","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 开启店铺的自动补货，货架就永远不会空。","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 邀请好友：对方得 5,000 ₺，你得 10,000 ₺。","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ 别忘了续办流动摊贩许可证，否则城管会罚款。","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 点指南针按钮可以俯瞰你的街区。","Dosyalar hazır, oyun hazırlanıyor":"文件已就绪，正在准备游戏","Modeller hazırlanıyor":"正在准备模型","Mahalle bilgileri alınıyor":"正在加载街区数据","Görüntü hazırlanıyor":"正在准备画面","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"加载中断。请检查网络连接并刷新页面。"},"ja":{"Harita açılıyor":"地図を開いています","Sokaklar döşeniyor":"通りを舗装しています","Esnaf tezgâhlarını kuruyor":"商人たちが屋台を組み立てています","Arabalar yola çıkıyor":"車が走り出しました","Mahalle uyanıyor":"街が目を覚まします","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 屋台のお客さんの注文吹き出しをタップしてチップをもらおう。","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 毎日ログインするとデイリー報酬が増えていきます。7日目は露店許可証をプレゼント！カウントは初回ログインの日から始まります。","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 トウモロコシは夏、焼き栗は冬によく売れます。季節に合わせよう。","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 屋台は複数動かせます。2つ目は見習いが担当します。","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 お金が貯まったら、大通りで「貸店舗」と書かれた店を借りよう。","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 お店の自動仕入れをオンにしておけば、棚が空になりません。","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 友だちを招待しよう：相手は 5,000 ₺、あなたは 10,000 ₺。","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ 露店許可証の更新を忘れずに。忘れると取締員に罰金を科されます。","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 コンパスボタンで街を上から眺められます。","Dosyalar hazır, oyun hazırlanıyor":"ファイルの準備完了、ゲームを準備しています","Modeller hazırlanıyor":"モデルを準備しています","Mahalle bilgileri alınıyor":"街のデータを取得しています","Görüntü hazırlanıyor":"画面を準備しています","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"読み込みが中断されました。インターネット接続を確認してページを再読み込みしてください。"},"ru":{"Harita açılıyor":"Открываем карту","Sokaklar döşeniyor":"Мостим улицы","Esnaf tezgâhlarını kuruyor":"Торговцы ставят свои лотки","Arabalar yola çıkıyor":"Машины выезжают на дорогу","Mahalle uyanıyor":"Квартал просыпается","💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.":"💡 Нажимай на облачка заказов покупателей у лотка — получишь чаевые.","🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.":"🎁 Заходи каждый день, и ежедневная награда растёт. На 7-й день — разрешение на уличную торговлю в подарок! Отсчёт начинается с первого входа.","🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.":"🌽 Кукуруза лучше продаётся летом, каштаны — зимой. Следи за сезоном.","👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.":"👷 Можно держать несколько лотков: за вторым присматривает подмастерье.","🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.":"🏪 Когда хватит денег, арендуй на проспекте магазин с табличкой «СДАЁТСЯ».","🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.":"🚚 Держи автоснабжение магазина включённым, чтобы полки не пустели.","🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.":"🎉 Пригласи друга: он получит 5 000 ₺, а ты — 10 000 ₺.","⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.":"⚠️ Не забывай продлевать разрешение на уличную торговлю, иначе муниципальная полиция оштрафует.","🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.":"🧭 Кнопкой компаса можно посмотреть на свой квартал сверху.","Dosyalar hazır, oyun hazırlanıyor":"Файлы готовы, игра готовится","Modeller hazırlanıyor":"Готовим модели","Mahalle bilgileri alınıyor":"Загружаем данные квартала","Görüntü hazırlanıyor":"Готовим изображение","Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.":"Загрузка прервалась. Проверь подключение к интернету и обнови страницу."}};
try { document.documentElement.lang = ACILIS_DIL; } catch (_) { /* yok say */ }
const L = (m) => (ACILIS_SOZLUK[ACILIS_DIL] && ACILIS_SOZLUK[ACILIS_DIL][m]) || m;
// 0.57.9: ipuçlarındaki sabit tutarlar fiyat endeksiyle bugünün fiyatına çevrilir (endeks son girişte saklanır)
let ACILIS_ENDEKS = 1;
try { ACILIS_ENDEKS = Number(localStorage.getItem('tezgah_endeks')) || 1; } catch (_) { /* yok say */ }
const tutarlar = (m) => (ACILIS_ENDEKS === 1 ? m : m.replace(/(₺\s?)(\d{1,3}(?:[.,\u00a0\u202f ]\d{3})+|\d+)|(\d{1,3}(?:[.,\u00a0\u202f ]\d{3})+|\d+)(\s?₺)/g, (x, on, n1, n2, son) => {
  const v = Number((n1 || n2).replace(/\D/g, '')) * ACILIS_ENDEKS;
  if (!v) return x;
  const a = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 2));
  try { const y = new Intl.NumberFormat(ACILIS_DIL).format(Math.round(v / a) * a); return on ? on + y : y + son; } catch (_) { return x; }
}));
const MESAJLAR = [
  [0, 'Harita açılıyor'],
  [0.2, 'Sokaklar döşeniyor'],
  [0.45, 'Esnaf tezgâhlarını kuruyor'],
  [0.65, 'Arabalar yola çıkıyor'],
  [0.85, 'Mahalle uyanıyor'],
];

const cubuk = document.getElementById('acilis-dolgu');
const acilis = document.getElementById('acilis');
const ipucu = document.getElementById('acilis-ipucu');
const IPUCLARI = [
  '💡 Tezgâh başındaki müşterilerin sipariş balonlarına dokun, bahşiş kap.',
  '🎁 Her gün gir, günlük ödülün her gün büyür. 7. gün seyyar izni hediye! Sayaç ilk girdiğin gün başlar.',
  '🌽 Mısırcı yazın, kestaneci kışın çok satar. Mevsimi takip et.',
  '👷 Birden çok tezgâh çalıştırabilirsin, ikincisine çırak bakar.',
  '🏪 Paran yetince caddede KİRALIK yazan bir dükkânı kirala.',
  '🚚 Dükkânında otomatik tedariki açık tut, raflar hiç boş kalmasın.',
  '🎉 Arkadaşını davet et: o 5.000 ₺, sen 10.000 ₺ kazanırsın.',
  '⚠️ Seyyar iznini uzatmayı unutma, zabıta ceza keser.',
  '🧭 Pusula düğmesiyle mahalleni kuş bakışı görebilirsin.',
];
let ipucuSira = Math.floor(Math.random() * IPUCLARI.length);
function ipucuGoster() {
  if (!ipucu) return;
  ipucu.style.opacity = 0;
  setTimeout(() => {
    ipucu.textContent = tutarlar(L(IPUCLARI[ipucuSira++ % IPUCLARI.length]));
    ipucu.style.opacity = 1;
  }, 300);
}
ipucuGoster();
const ipucuZamani = setInterval(ipucuGoster, 3200);
const yuzde = document.getElementById('acilis-yuzde');
const mesaj = document.getElementById('acilis-mesaj');
const toplam = DOSYALAR.reduce((t, d) => t + d.boyut, 0) || 1;
const alinan = new Map();
const ONBELLEK = 'cirak-varlik-0.36.7';
let varlikOnbellek = null, sonYuzde = 0;
window.TEZGAH_YUKLEME = (oran, metin) => {
  sonYuzde = Math.max(sonYuzde, Math.min(100, oran));
  cubuk.style.width = sonYuzde + '%';
  acilis.style.setProperty('--ilerleme', String(sonYuzde / 100));
  yuzde.textContent = Math.floor(sonYuzde) + '%';
  if (metin) mesaj.textContent = L(metin) + (sonYuzde < 100 ? '…' : '');
};

function goster() {
  let a = 0;
  for (const v of alinan.values()) a += v;
  const oran = Math.min(1, a / toplam);
  window.TEZGAH_YUKLEME(oran * 70);
  let m = MESAJLAR[0][1];
  for (const [e, metin] of MESAJLAR) if (oran >= e) m = metin;
  if (mesaj.dataset.m !== m) { mesaj.dataset.m = m; mesaj.textContent = L(m) + '…'; }
}

async function indir(d) {
  const adres = new URL('../' + d.yol, import.meta.url);
  adres.searchParams.set('v', '0.36.7');
  let yanit = null;
  try { yanit = await varlikOnbellek?.match(adres.href); } catch (_) { /* önbellek okunamıyorsa normal indir */ }
  if (!yanit) {
    yanit = await fetch(adres.href, { cache: 'default' });
    if (yanit.ok) varlikOnbellek?.put(adres.href, yanit.clone()).catch(() => {});
  }
  if (!yanit.ok) throw new Error(d.yol + ' indirilemedi');
  if (!yanit.body || !yanit.body.getReader) {
    const b = await yanit.blob();
    alinan.set(d.yol, d.boyut);
    goster();
    return b;
  }
  const okuyucu = yanit.body.getReader();
  const parcalar = [];
  let n = 0;
  for (;;) {
    const { done, value } = await okuyucu.read();
    if (done) break;
    parcalar.push(value);
    n += value.length;
    alinan.set(d.yol, Math.min(n, d.boyut));
    goster();
  }
  alinan.set(d.yol, d.boyut);
  goster();
  return new Blob(parcalar, { type: yanit.headers.get('Content-Type') || '' });
}

// İndirilen dosyalar oyun içinde tekrar indirilmesin diye adresleriyle saklanır
window.TEZGAH_VARLIK = {};
// 0.38: servis çalışanı açılışta kaydedilir: müzik, intro, model ve dokular ilk kullanımda cihaza kaydedilir
// (zayıf bağlantıda oyun hızlı açılır). Bildirim izni istemez; yalnızca dosya kaydı yapar.
try { if ('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('sw.js?v=0.57.15').catch(() => {}); } catch (_) { /* yok say */ }

(async () => {
  try {
    try { if (typeof caches !== 'undefined') varlikOnbellek = await caches.open(ONBELLEK); } catch (_) { /* özel gezinme/kota: normal indirme */ }
    const sonuclar = [];
    let siradaki = 0;
    await Promise.all(Array.from({length: 4}, async () => {
      while (siradaki < DOSYALAR.length) { const d = DOSYALAR[siradaki++]; sonuclar.push([d.yol, await indir(d)]); }
    }));
    if (varlikOnbellek) caches.keys().then(l => Promise.all(l.filter(k => k.startsWith('cirak-varlik-') && k !== ONBELLEK).map(k => caches.delete(k)))).catch(() => {});
    for (const [yol, blob] of sonuclar) window.TEZGAH_VARLIK[yol] = URL.createObjectURL(blob);
    window.TEZGAH_YUKLEME(70, 'Dosyalar hazır, oyun hazırlanıyor');
    window.TEZGAH_IPUCU_DURDUR = () => clearInterval(ipucuZamani);
    await import('./ana.js?v=0.57.15');
  } catch (e) {
    mesaj.textContent = L('Yükleme yarıda kaldı. İnternet bağlantını kontrol edip sayfayı yenile.');
    console.error(e);
  }
})();
