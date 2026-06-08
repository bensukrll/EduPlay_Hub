from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import cred
import json
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from functools import lru_cache
from psycopg2.pool import SimpleConnectionPool

app = Flask(__name__)

app.secret_key = cred.getSecretKey()

login_manager = LoginManager(app)
login_manager.login_view = "login"

GAME_INFO = {
    # =========================
    # 5. SINIF - ÜNİTE 1
    # =========================
    "5_unit1_w1": {
        "title": "Teknoloji Dedektifi",
        "subtitle": "Günlük yaşamda kullanılan bilişim teknolojilerini tanı ve sınıflandır!",
        "unit": "Bilişim Teknolojilerinin Hayatımızdaki Yeri",
        "level": "5. Sınıf",
        "icon": "💻",
        "template": "5_unit1_w1"
    },

    "5_unit1_w2": {
        "title": "Dijital Sağlık Dengesi",
        "subtitle": "Bilişim teknolojilerinin olumlu ve olumsuz etkilerini ayırt et!",
        "unit": "Bilişim Teknolojilerinin Hayatımızdaki Yeri",
        "level": "5. Sınıf",
        "icon": "🧘",
        "template": "5_unit1_w2"
    },

    # =========================
    # 5. SINIF - ÜNİTE 2
    # =========================
    "5_unit2_w1": {
        "title": "Görsel Düzenleme Araçları",
        "subtitle": "Görsel düzenleme programlarının temel özelliklerini keşfet!",
        "unit": "Dijital Ürün Tasarım ve Geliştirme",
        "level": "5. Sınıf",
        "icon": "🎨",
        "template": "5_unit2_w1"
    },

    "5_unit2_w2": {
        "title": "Tasarım Sıralaması",
        "subtitle": "Dijital ürün tasarlama adımlarını doğru sıraya koy!",
        "unit": "Dijital Ürün Tasarım ve Geliştirme",
        "level": "5. Sınıf",
        "icon": "🖌️",
        "template": "5_unit2_w2"
    },

    # =========================
    # 5. SINIF - ÜNİTE 3
    # =========================
    "5_unit3_w1": {
        "title": "Ağ Bileşenleri",
        "subtitle": "Bilgisayar ağlarında kullanılan temel bileşenleri tanı!",
        "unit": "Bilgisayar Ağları ve İletişim",
        "level": "5. Sınıf",
        "icon": "🔌",
        "template": "5_unit3_w1"
    },

    "5_unit3_w2": {
        "title": "Bağlantı Ustası",
        "subtitle": "Kablolu ve kablosuz bağlantı yöntemlerini günlük yaşam örnekleriyle ayırt et!",
        "unit": "Bilgisayar Ağları ve İletişim",
        "level": "5. Sınıf",
        "icon": "🌐",
        "template": "5_unit3_w2"
    },

    # =========================
    # 5. SINIF - ÜNİTE 4
    # =========================
    "5_unit4_w1": {
        "title": "Bilişim Etiği Seçimi",
        "subtitle": "Dijital ortamlarda etik olan ve olmayan davranışları ayırt et!",
        "unit": "Bilişim Etiği ve Siber Güvenlik",
        "level": "5. Sınıf",
        "icon": "⚖️",
        "template": "5_unit4_w1"
    },

    "5_unit4_w2": {
        "title": "Dijital Güvenlik Kalkanı",
        "subtitle": "Gizlilik risklerini, kişisel verileri ve güvenlik önlemlerini doğru sınıflandır!",
        "unit": "Bilişim Etiği ve Siber Güvenlik",
        "level": "5. Sınıf",
        "icon": "🛡️",
        "template": "5_unit4_w2"
    },

    # =========================
    # 5. SINIF - ÜNİTE 5
    # =========================
    "5_unit5_w1": {
        "title": "Yapay Zekâ Avı",
        "subtitle": "Günlük yaşamda kullanılan yapay zekâ örneklerini keşfet!",
        "unit": "Yapay Zekâ",
        "level": "5. Sınıf",
        "icon": "🤖",
        "template": "5_unit5_w1"
    },

    "5_unit5_w2": {
        "title": "Yapay Zekâda Etik ve Güvenlik",
        "subtitle": "Labirentte ilerleyerek yapay zekâyı güvenli, etik ve bilinçli kullanmayı öğren!",
        "unit": "Yapay Zekâ",
        "level": "5. Sınıf",
        "icon": "🔐",
        "template": "5_unit5_w2"
    },

    # =========================
    # 5. SINIF - ÜNİTE 6
    # =========================
    "5_unit6_w1": {
        "title": "Problem Çözme Adımları",
        "subtitle": "Bir problemi çözmek için gerekli işlem adımlarını belirle!",
        "unit": "Yazılım Tasarımı ve Programlama",
        "level": "5. Sınıf",
        "icon": "🧩",
        "template": "5_unit6_w1"
    },

    "5_unit6_w2": {
        "title": "Algoritma Sıralaması",
        "subtitle": "Verilen günlük yaşam problemini algoritmik adımlarla sırala!",
        "unit": "Yazılım Tasarımı ve Programlama",
        "level": "5. Sınıf",
        "icon": "🔢",
        "template": "5_unit6_w2"
    },

    # =========================
    # 6. SINIF - ÜNİTE 1
    # =========================
    "6_unit1_w1": {
        "title": "Bilişim Kavramları",
        "subtitle": "Bilişim teknolojileriyle ilgili temel kavramları eşleştir!",
        "unit": "Bilişim Teknolojilerinin Temelleri",
        "level": "6. Sınıf",
        "icon": "💡",
        "template": "6_unit1_w1"
    },

    "6_unit1_w2": {
        "title": "Donanım ve Yazılım",
        "subtitle": "Bilgisayar sistemindeki donanım ve yazılım örneklerini ayırt et!",
        "unit": "Bilişim Teknolojilerinin Temelleri",
        "level": "6. Sınıf",
        "icon": "🖥️",
        "template": "6_unit1_w2"
    },

    # =========================
    # 6. SINIF - ÜNİTE 2
    # =========================
    "6_unit2_w1": {
        "title": "Dijital Vatandaşlık",
        "subtitle": "Dijital ortamda sorumlu ve bilinçli davranışları seç!",
        "unit": "Bilişim Etiği ve Siber Güvenlik",
        "level": "6. Sınıf",
        "icon": "🧑‍💻",
        "template": "6_unit2_w1"
    },

    "6_unit2_w2": {
        "title": "Siber Güvenlik Görevi",
        "subtitle": "Siber güvenlik risklerini ve korunma yollarını doğru eşleştir!",
        "unit": "Bilişim Etiği ve Siber Güvenlik",
        "level": "6. Sınıf",
        "icon": "🔐",
        "template": "6_unit2_w2"
    },

    # =========================
    # 6. SINIF - ÜNİTE 3
    # =========================
    "6_unit3_w1": {
        "title": "Ağ Türleri",
        "subtitle": "Ağ türlerini özelliklerine göre doğru şekilde sınıflandır!",
        "unit": "Bilgisayar Ağları ve İletişim",
        "level": "6. Sınıf",
        "icon": "📡",
        "template": "6_unit3_w1"
    },

    "6_unit3_w2": {
        "title": "Ağ Dedektifi",
        "subtitle": "Ağ türlerini ve temel ağ bileşenlerini keşfet!",
        "unit": "Bilgisayar Ağları ve İletişim",
        "level": "6. Sınıf",
        "icon": "🕵️‍♀️",
        "template": "6_unit3_w2"
    },

    # =========================
    # 6. SINIF - ÜNİTE 4
    # =========================
    "6_unit4_w1": {
        "title": "Dijital Ürün Planlama",
        "subtitle": "Bir dijital ürün geliştirmek için gerekli planlama adımlarını sırala!",
        "unit": "Dijital Ürün Tasarım ve Geliştirme",
        "level": "6. Sınıf",
        "icon": "📝",
        "template": "6_unit4_w1"
    },

    "6_unit4_w2": {
        "title": "Tasarım Kararları",
        "subtitle": "Dijital ürün tasarımında doğru araç ve yöntemleri seç!",
        "unit": "Dijital Ürün Tasarım ve Geliştirme",
        "level": "6. Sınıf",
        "icon": "🎯",
        "template": "6_unit4_w2"
    },

    # =========================
    # 6. SINIF - ÜNİTE 5
    # =========================
    "6_unit5_w1": {
        "title": "Yapay Zekâ Nerede?",
        "subtitle": "Yapay zekâ kullanılan ve kullanılmayan durumları ayırt et!",
        "unit": "Yapay Zekâ",
        "level": "6. Sınıf",
        "icon": "🤖",
        "template": "6_unit5_w1"
    },

    "6_unit5_w2": {
        "title": "Akıllı Sistemler",
        "subtitle": "Yapay zekâ sistemlerinin çalışma mantığını örneklerle keşfet!",
        "unit": "Yapay Zekâ",
        "level": "6. Sınıf",
        "icon": "🧠",
        "template": "6_unit5_w2"
    },

    # =========================
    # 6. SINIF - ÜNİTE 6
    # =========================
    "6_unit6_w1": {
        "title": "Algoritma Kurucusu",
        "subtitle": "Bir problemin çözüm adımlarını algoritmik düşünerek oluştur!",
        "unit": "Yazılım Tasarımı ve Programlama",
        "level": "6. Sınıf",
        "icon": "🧩",
        "template": "6_unit6_w1"
    },

    "6_unit6_w2": {
        "title": "Kodlama Mantığı",
        "subtitle": "Koşul, döngü ve sıralama mantığını oyun içinde uygula!",
        "unit": "Yazılım Tasarımı ve Programlama",
        "level": "6. Sınıf",
        "icon": "👩‍💻",
        "template": "6_unit6_w2"
    }
}

# Seviye ve ünite bilgileri
LEVELS_AND_UNITS = {
    '5': ['unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6'],
    '6': ['unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6']
}

# Database Connection
db_pool = SimpleConnectionPool(
    minconn=1,
    maxconn=10,
    **cred.getDbConfig()
)

def get_db_connection():
    return db_pool.getconn()

def release_db_connection(conn):
    db_pool.putconn(conn)


class User(UserMixin):
    def __init__(self, id, username, email, role, current_grade):
        self.id = id
        self.username = username
        self.email = email
        self.role = role
        self.current_grade = current_grade

@lru_cache(maxsize=100)
def get_user_cached(user_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, username, email, role, current_grade
        FROM users
        WHERE id = %s
    """, (user_id,))

    row = cur.fetchone()

    cur.close()
    release_db_connection(conn)

    if row:
        return User(*row)

    return None


@login_manager.user_loader
def load_user(user_id):
    return get_user_cached(user_id)

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

    parts = game_id.split("_")
    level = parts[0]      # ilkokul / ortaokul
    unit = parts[1]       # unit1 / unit2 / unit3

    return render_template(
        "game.html",
        game=game,
        game_id=game_id,
        source=source,
        level=level,
        unit=unit
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

    # 3 butonluk hafta alanı: [1. hafta, 2. hafta, 3. hafta]
    week_slots = [None, None, None]

    if unit and level:
        prefix = f"{level}_{unit}_"

        for key in GAME_INFO.keys():
            if key.startswith(prefix):
                try:
                    week_no = int(key.split("_w")[-1])  # 5_unit3_w2 -> 2
                    if 1 <= week_no <= 3:
                        week_slots[week_no - 1] = key
                except ValueError:
                    pass

    return render_template(
        'map.html',
        level=level,
        unit=unit,
        units=units,
        week_slots=week_slots
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

@app.route("/account", methods=["GET", "POST"])
@login_required
def account():
    conn = get_db_connection()
    cur = conn.cursor()

    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        current_grade = request.form.get("current_grade")

        if current_user.role == "student" and current_grade:
            cur.execute("""
                UPDATE users SET username = %s, email = %s, current_grade = %s WHERE id = %s
            """, (username, email, int(current_grade), current_user.id))
        else:
            cur.execute("""
                UPDATE users SET username = %s, email = %s WHERE id = %s
            """, (username, email, current_user.id))

        conn.commit()
        get_user_cached.cache_clear()
        cur.close()
        release_db_connection(conn)
        return redirect(url_for("account"))

    completed_games = 0
    total_score = 0
    teacher_stats = None

    if current_user.role == 'student':
        cur.execute("""
            SELECT COUNT(*), COALESCE(SUM(score), 0)
            FROM user_progress
            WHERE user_id = %s AND completion_status = TRUE
        """, (current_user.id,))
        row = cur.fetchone()
        completed_games = row[0]
        total_score = row[1]

    elif current_user.role == 'teacher':
        teacher_stats = {}

    cur.close()
    release_db_connection(conn)

    return render_template(
        "account.html",
        user=current_user,
        completed_games=completed_games,
        total_score=total_score,
        teacher_stats=teacher_stats
    )
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

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, username, email, role, current_grade, password_hash FROM users WHERE email = %s", (email,))
        row = cur.fetchone()
        cur.close()
        release_db_connection(conn)

        if row and check_password_hash(row[5], password):
            user = User(row[0], row[1], row[2], row[3], row[4])
            login_user(user)
            return redirect(url_for("home"))
        else:
            return render_template("login.html", error="E-posta veya şifre hatalı")

    return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("start"))

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        role = request.form.get("role")
        current_grade = request.form.get("current_grade")

        if role == "teacher":
            current_grade = None
        elif role == "student":
            current_grade = int(current_grade)

        password_hash = generate_password_hash(password)

        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO users (username, email, password_hash, role, current_grade)
                VALUES (%s, %s, %s, %s, %s)
            """, (username, email, password_hash, role, current_grade))
            conn.commit()
            cur.close()
            release_db_connection(conn)
            get_user_cached.cache_clear()
            return redirect(url_for("login"))

        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            cur.close()
            release_db_connection(conn)
            return render_template("register.html", error="Bu e-posta veya kullanıcı adı zaten kayıtlı.")

    return render_template("register.html")

# Oyunların Progressini Kaydetme Fonksiyonu
@app.route("/save-progress", methods=["POST"])
def save_progress():
    if not current_user.is_authenticated:
        return jsonify({"error": "Giriş yapılmamış"}), 401

    data = request.get_json()
    game_key = data.get("game_key")
    score = data.get("score", 0)

    game = GAME_INFO.get(game_key)
    if not game:
        return jsonify({"error": "Oyun bulunamadı"}), 404

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM games WHERE game_key = %s", (game_key,))
    row = cur.fetchone()

    if not row:
        parts = game_key.split("_")
        grade = int(parts[0])
        unit = int(parts[1].replace("unit", ""))
        week = int(parts[2].replace("w", ""))

        cur.execute("""
            INSERT INTO games (game_key, grade, unit, week, title)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (game_key, grade, unit, week, game["title"]))

        row = cur.fetchone()

    game_id = row[0]

    cur.execute("""
        INSERT INTO user_progress (user_id, game_id, score, completion_status, completed_at)
        VALUES (%s, %s, %s, TRUE, NOW())
        ON CONFLICT (user_id, game_id)
        DO UPDATE SET 
            score = EXCLUDED.score,
            completion_status = TRUE,
            completed_at = NOW()
    """, (current_user.id, game_id, score))

    conn.commit()
    cur.close()
    release_db_connection(conn)

    return jsonify({"success": True})

# ==================================================
# APP RUN
# ==================================================

if __name__ == "__main__":
    app.run(debug=True)

