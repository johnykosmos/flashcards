from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session
from models import Cardbase, Cards, Languages, db, User


main = Blueprint('main', __name__)


def respond_json(message, data=None, status_code=200):
    return jsonify({"message": message, "data": data}), status_code

def login_required(f):
    @wraps(f)
    def check_for_login(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('main.login'))

        if not User.query.get(session['user_id']):
            session.clear()
            return redirect(url_for('main.login'))

        return f(*args, **kwargs)

    return check_for_login

@main.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["login"]
        password = request.form["password"]
        user = User.query.filter_by(login=username).first() 

        if user and user.password == password:
            session['user_id'] = user.id
            return redirect(url_for('main.home'))

    return render_template("login.html", action_route='/login')


@main.route('/', methods=["GET"])
@login_required
def home():
    user_id = session['user_id']
    cardbases = Cardbase.query.filter_by(user_id=user_id).all()
    return render_template("index.html", headers=["Key", "Translation"], cardbases=cardbases)        


@main.route('/get_language', methods=["GET"])
@login_required
def get_language():
    languages = Languages.query.all()
    data = [{'name': language.name, 'value': language.acronym} for language in languages]
    return respond_json(message="Language list retrieved.", data=data)

@main.route('/create_cardbase', methods=["POST"])
@login_required
def create_cardbase():
    primary_lang = request.form["keyLang"]
    translation_lang = request.form["transLang"]
    name = request.form["name"]

    new_cardbase = Cardbase(name=name, primary_language=primary_lang, translation_language=translation_lang, user_id=session['user_id']) 

    db.session.add(new_cardbase)
    db.session.commit()

    return respond_json(message="Cardbase created successfully.", status_code=201)

@main.route('/delete_cardbase/<cardbase_name>', methods=["DELETE"])
@login_required
def delete_cardbase(cardbase_name):
    cardbase = Cardbase.query.filter_by(name=cardbase_name).first()
    
    if not cardbase:
        return respond_json(message=f"No cardbase named {cardbase_name}", status_code=404)

    cards_to_delete = Cards.query.filter_by(cardbase_id=cardbase.id).all()
    for card in cards_to_delete:
        db.session.delete(card)

    db.session.delete(cardbase)
    db.session.commit()

    return respond_json(message=f"Cardbase {cardbase_name} deleted succesfully!")

@main.route('/add_card/<cardbase_name>', methods=["POST"])
@login_required
def add_card(cardbase_name):
    cardbase = Cardbase.query.filter_by(name=cardbase_name).first()

    if not cardbase:
        return respond_json(message=f"No cardbase named {cardbase_name}", status_code=404)

    key = request.form["key"]
    translation = request.form["translation"]

    new_card = Cards(key=key, value=translation, cardbase_id=cardbase.id)

    db.session.add(new_card)
    db.session.commit()

    return respond_json(message="Card added successfully.", status_code=201)

@main.route('/get_cards/<cardbase_name>', methods=["GET"])
@login_required
def get_cards(cardbase_name):
    cardbase = Cardbase.query.filter_by(name=cardbase_name).first() 
    if not cardbase:
        return respond_json(message=f"No cardbase named {cardbase_name}", status_code=404)
    
    cards = Cards.query.filter_by(cardbase_id=cardbase.id).all()
    cards_data = [{"key" : card.key, "translation" : card.value} for card in cards] if cards else []
    data = {"langInfo": {"key" : cardbase.primary_language, "translation" : cardbase.translation_language}, "cards": cards_data}
    return respond_json(message="Cards retrieved.", data=data)

@main.route('/delete_card/<cardbase_name>/<card_name>', methods=["DELETE"])
@login_required
def delete_card(cardbase_name, card_name):
    cardbase = Cardbase.query.filter_by(name=cardbase_name).first() 

    if not cardbase:
        return respond_json(message=f"No cardbase named {cardbase_name}", status_code=404)

    card = Cards.query.filter_by(key=card_name, cardbase_id=cardbase.id).first()

    if not card:
        return respond_json(message=f"No card like that", status_code=404)

    db.session.delete(card)
    db.session.commit() 

    return respond_json(message=f"Card {card_name} deleted succesfully!")
