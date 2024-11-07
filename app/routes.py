from flask import Blueprint, render_template, request, jsonify, session
from models import Cardbase, Languages, db, User


main = Blueprint('main', __name__)


@main.route('/', methods=["GET"])
def get_index():
    if 'user_id' in session:
        user_id = session['user_id']
        cardbases = Cardbase.query.filter_by(user_id=user_id)
        return render_template("index.html", headers=["Key", "Translation"], cardbases=cardbases)        

    return render_template("login.html", action_route='/')

@main.route('/', methods=["POST"])
def login():
    login = request.form["login"]
    password = request.form["password"]
    user = User.query.filter_by(login=login, password=password).first() 

    if user:
        session['user_id'] = user.id
        cardbases = Cardbase.query.filter_by(user_id=user.id)
        return render_template("index.html", headers=["Key", "Translation"], cardbases=cardbases)

    return render_template("login.html", action_route='/')

@main.route('/get_language', methods=["GET"])
def get_language():
    languages = Languages.query.all()

    data = [{'name': language.name, 'value': language.acronym} for language in languages]

    return jsonify(data)

@main.route('/create_cardbase', methods=["POST"])
def create_cardbase():
    if 'user_id' not in session:
        return '', 400

    primary_lang = request.form["lang1"]
    translation_lang = request.form["lang2"]
    name = request.form["name"]

    new_cardbase = Cardbase(name=name, primary_language=primary_lang, translation_language=translation_lang, user_id=session['user_id']) 

    db.session.add(new_cardbase)
    db.session.commit()

    return jsonify({"message": "Cardbase created successfully."}), 201