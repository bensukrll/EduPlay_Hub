from flask import Flask, render_template, jsonify ,request
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import cred
import json

app = Flask(__name__)

GAME_INFO = {
    "ilkokul_unit1_game1": {
        "title": "Dosya Yönetimi",
        "subtitle": "Dosya ve klasörleri doğru şekilde düzenlemeyi öğren!",
        "unit": "Bilişim Teknolojileri",
        "level": "İlkokul",
        "icon": "📁",
        "template": "unit1_level1"   # ← fiziksel dosya adı
    },
    "ortaokul_unit1_game1": {
        "title": "Bilgisayar Sistemleri",
        "subtitle": "Bilgisayarın temel donanım ve yazılım bileşenlerini keşfet!",
        "unit": "Bilişim Teknolojileri",
        "level": "Ortaokul",
        "icon": "🖥️",
        "template": "unit1_level2"   # ← fiziksel dosya adı
    },
    "ilkokul_unit2_game1": {
        "title": "Gizlilik ve Güvenlik",
        "subtitle": "Kişisel bilgilerini internette nasıl koruyacağını öğren!",
        "unit": "Etik ve Güvenlik",
        "level": "İlkokul",
        "icon": "🔐",
        "template": "unit2_level1"
    },
    "ortaokul_unit2_game1": {
        "title": "Dijital Vatandaşlık",
        "subtitle": "İnternette sorumlu ve bilinçli bir birey ol!",
        "unit": "Etik ve Güvenlik",
        "level": "Ortaokul",
        "icon": "🧑‍💻",
        "template": "unit2_level2"
    },
    "ilkokul_unit3_game1": {
        "title": "Bilgisayar Ağları",
        "subtitle": "Bilgiler bilgisayarlar arasında nasıl dolaşır?",
        "unit": "İletişim, Araştırma ve İş Birliği",
        "level": "İlkokul",
        "icon": "🌐",
        "template": "unit3_level1"
    },
    "ortaokul_unit3_game1": {
        "title": "Bilgisayar Ağları – İleri Seviye",
        "subtitle": "Ağ türlerini ve internetin nasıl çalıştığını keşfet!",
        "unit": "İletişim, Araştırma ve İş Birliği",
        "level": "Ortaokul",
        "icon": "🌐",
        "template": "unit3_level2"
    }
}

# Seviye ve ünite bilgileri
LEVELS_AND_UNITS = {
    'ilkokul': ['unit1', 'unit2', 'unit3'],
    'ortaokul': ['unit1', 'unit2', 'unit3']
}

# ==================================================
# ROUTES
# ==================================================

@app.route("/")
def start():
    return render_template("start.html")


@app.route("/home")
def home():
    return render_template("index.html")


@app.route("/ilkokul")
def ilkokul():
    return render_template("ilkokul.html")


@app.route("/ortaokul")
def ortaokul():
    return render_template("ortaokul.html")

@app.route("/play/<game_id>")
def play(game_id):
    source = request.args.get("source")

    game = GAME_INFO.get(game_id)

    if not game:
        return "Oyun bulunamadı", 404

    return render_template(
        "game.html",
        game=game,
        game_id=game_id,
        source=source
    )
@app.route("/embed/<game_id>")
def embed(game_id):
    game = GAME_INFO.get(game_id)
    if not game:
        return "Oyun bulunamadı", 404
    template_name = game.get("template", game_id)
    return render_template(f"games/{template_name}.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        send_email(name, email, message)

        return render_template("contact.html", success=True)

    return render_template("contact.html")

@app.route("/map")
def map_page():
    level = request.args.get('level')
    unit = request.args.get('unit')

    units = LEVELS_AND_UNITS.get(level, [])

    unit_games = []
    if unit and level:
        prefix = f"{level}_{unit}_"
        unit_games = [key for key in GAME_INFO.keys() if key.startswith(prefix)]

    return render_template(
        'map.html',
        level=level,
        unit=unit,
        units=units,
        unit_games=unit_games
    )
# ==================================================
# ROTA: Oyun Sayfası
# ==================================================
@app.route("/game/<level>/<unit>/<game_id>")
def game_page(level, unit, game_id):
    # Seçilen oyun bilgilerini al
    game_info = GAME_INFO.get(f"{unit}_{game_id}", {})
    
    if not game_info:
        return "Oyun bulunamadı", 404

    return render_template("game.html", game=game_info, level=level, unit=unit, game_id=game_id)



# ==================================================
#  MAIL GÖNDERME FONKSİYONU
# ==================================================

(MAIL_ADDRESS, MAIL_PASSWORD) = cred.setCred()

def send_email(name, email, message):
    msg = MIMEMultipart()
    msg["From"] = MAIL_ADDRESS
    msg["To"] = MAIL_ADDRESS
    msg["Subject"] = "EduPlay Hub – Yeni İletişim Mesajı"

    body = f"""
Yeni bir iletişim mesajı alındı:

İsim: {name}
E-posta: {email}

Mesaj:
{message}
    """

    msg.attach(MIMEText(body, "plain", "utf-8"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(MAIL_ADDRESS, MAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(" Mail başarıyla gönderildi")
    except Exception as e:
        print(" Mail gönderilemedi:", e)


# ==================================================
# APP RUN
# ==================================================

if __name__ == "__main__":
    app.run(debug=True)
