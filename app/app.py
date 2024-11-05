
from flask import Flask, render_template, request, jsonify
from models import db, User


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/', methods=["GET"])
def get_index():

    return render_template("login.html", action_route='/')

@app.route('/', methods=["POST"])
def login():
    login = request.form["login"]
    password = request.form["password"]
    user = User.query.filter_by(login=login, password=password).first() 

    if user:
        return render_template("index.html")

    return render_template("login.html", action_route='/')

@app.route('/admin', methods=["GET"])
def get_admin():
    #return render_template("login.html", action_route='/admin')
    users = User.query.filter_by(is_admin=False)
    headers = ["Login", "Password"]

    return render_template("admin.html", data=users, headers=headers)


@app.route('/admin', methods=["POST"])
def admin_login():
    login = request.form["login"]
    password = request.form["password"]
    user = User.query.filter_by(login=login, password=password, is_admin=True).first() 

    if user:
        users = User.query.all()
        return render_template("admin.html", data=users)

    return render_template("login.html", action_route='/admin')

@app.route('/add_user', methods=["POST"])
def add_user():
    login = request.form["login"]
    password = request.form["password"]
    if User.query.filter_by(login=login).first():
        return jsonify({"error": "User already exists"}), 409

    new_user = User(login=login, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User added succesfully!"}), 201 

@app.route('/remove_user', methods=["DELETE"])
def remove_user():
    data = request.json
    login = data.get("login")

    print(login)

    user = User.query.filter_by(login=login).first()
    if user == None:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit();

    return '', 204



if __name__ == "__main__":
    app.run(debug=True)
