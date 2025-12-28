from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ortaokul")
def ortaokul():
    return render_template("ortaokul.html")

@app.route("/ilkokul")
def ilkokul():
    return render_template("ilkokul.html")

@app.route("/play/<game_id>")
def play(game_id):
    return render_template("game.html", game_id=game_id)

@app.route("/embed/<game_id>")
def embed(game_id):
    return render_template(f"games/{game_id}.html")

if __name__ == "__main__":
    app.run(debug=True)
