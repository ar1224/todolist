from flask import Flask 
app = Flask(__name__)

@app.route("/")
def hello():
    return "Welcome to my fantastic application!"
app.run(debug=True)



@app.route("/hi")
def app():
    return "Hello World "
app.run(debug=True)


