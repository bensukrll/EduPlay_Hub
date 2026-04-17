from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "EduPlay Hub Projesi Calisiyor! Merhaba Takim."

if __name__ == "__main__":
    app.run(debug=True)