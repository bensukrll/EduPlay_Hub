from flask import Flask, render_template, request

app = Flask(__name__)

GAME_INFO = {
    "unit1_level1": {
        "title": "Dosya Yönetimi",
        "subtitle": "Dosya ve klasörleri doğru şekilde düzenlemeyi öğren!",
        "unit": "Bilişim Teknolojileri",
        "level": "İlkokul",
        "icon": "📁"
    },

    "unit1_level2": {
        "title": "Bilgisayar Sistemleri",
        "subtitle": "Bilgisayarın temel donanım ve yazılım bileşenlerini keşfet!",
        "unit": "Bilişim Teknolojileri",
        "level": "Ortaokul",
        "icon": "🖥️"
    },

    "unit2_level1": {
        "title": "Gizlilik ve Güvenlik",
        "subtitle": "Kişisel bilgilerini internette nasıl koruyacağını öğren!",
        "unit": "Etik ve Güvenlik",
        "level": "İlkokul",
        "icon": "🔐"
    },

    "unit2_level2": {
        "title": "Dijital Vatandaşlık",
        "subtitle": "İnternette sorumlu ve bilinçli bir birey ol!",
        "unit": "Etik ve Güvenlik",
        "level": "Ortaokul",
        "icon": "🧑‍💻"
    },

    "unit3_level1": {
        "title": "Bilgisayar Ağları",
        "subtitle": "Bilgiler bilgisayarlar arasında nasıl dolaşır?",
        "unit": "İletişim, Araştırma ve İş Birliği",
        "level": "İlkokul",
        "icon": "🌐"
    },

    "network_game": {
        "title": "Bilgisayar Ağları – İleri Seviye",
        "subtitle": "Ağ türlerini ve internetin nasıl çalıştığını keşfet!",
        "unit": "İletişim, Araştırma ve İş Birliği",
        "level": "Ortaokul",
        "icon": "🌐"
    }
}



@app.route("/")
def start():
    return render_template("start.html")   # 👈 giriş sayfası

@app.route("/home")
def home():
    return render_template("index.html")   # 👈 ana sayfa

@app.route("/ortaokul")
def ortaokul():
    return render_template("ortaokul.html")

@app.route("/ilkokul")
def ilkokul():
    return render_template("ilkokul.html")

@app.route("/play/<game_id>")
def play(game_id):
    source = request.args.get("source", "home")

    game = GAME_INFO.get(game_id, {
        "title": "Eğitici Oyun",
        "subtitle": "Görevini tamamla ve puanları topla!",
        "unit": "EduPlay Hub",
        "icon": "🎮"
    })

    return render_template(
        "game.html",
        game_id=game_id,
        source=source,
        game=game
    )


@app.route("/embed/<game_id>")
def embed(game_id):
    return render_template(f"games/{game_id}.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

if __name__ == "__main__":
    app.run(debug=True)