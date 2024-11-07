
from enum import unique
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    cardbases = db.relationship("Cardbase", backref="user")

class Cardbase(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    primary_language = db.Column(db.String(5), nullable=False)
    translation_language = db.Column(db.String(5), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)    
    cards = db.relationship("Cards", backref="cardbase")

class Cards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), nullable=False)
    value = db.Column(db.String(50), nullable=False)
    cardbase_id = db.Column(db.Integer, db.ForeignKey("cardbase.id"), nullable=False)

class Languages(db.Model):
    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(10), nullable=False, unique=True)
    acronym = db.Column(db.String(10), nullable=False, unique=True)
