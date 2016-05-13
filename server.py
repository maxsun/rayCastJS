from flask import Flask, render_template
import caveGeneration 
import json, os

app = Flask(__name__)

@app.route("/")
def home():
    caveMap = caveGeneration.start(120)
    caveMap = json.dumps(caveMap)
    return render_template("index.html", gridData=caveMap)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 33507))
    app.run(host='0.0.0.0',port=port, debug=True)