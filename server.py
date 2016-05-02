from flask import Flask, render_template
from generation import caveGeneration 
import json

app = Flask(__name__)

@app.route("/")
def home():
    caveMap = caveGeneration.start(32)
    caveMap = json.dumps(caveMap)
    return render_template("index.html", gridData=caveMap)

if __name__ == "__main__":
    app.run(debug=True)