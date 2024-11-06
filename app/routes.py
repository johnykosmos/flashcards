from flask import Blueprint, render_template, request
from models import db, User


main = Blueprint('main', __name__)


@main.route('/', methods=["GET"])
def get_index():

    return render_template("login.html", action_route='/')

@main.route('/', methods=["POST"])
def login():
    login = request.form["login"]
    password = request.form["password"]
    user = User.query.filter_by(login=login, password=password).first() 

    if user:
        return render_template("index.html")

    return render_template("login.html", action_route='/')
