
from flask import Flask
from models import Languages, db, User
from routes import main
import click

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flashcards.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "ilovecats"

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(main)

@app.cli.command("show-users")
def show_users():
    for user in User.query.all():
        print(f"ID: {user.id} | Login: {user.login}, | Password: {user.password}")

@app.cli.command("add-user")
@click.argument("login")
@click.argument("password")
def add_user(login, password):
    if User.query.filter_by(login=login).first():
        print(f"User {login} already exists")
        return None

    new_user = User(login=login, password=password)
    db.session.add(new_user)
    db.session.commit()

    print("User added succesfully!")


@app.cli.command("rm-user")
@click.argument("user_id")
def remove_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user == None:
        print("User not found")
        return None 

    db.session.delete(user)
    db.session.commit();

    print(f"User {user_id} removed successfully")

@app.cli.command("add-lang")
@click.argument("name")
@click.argument("acronym")
def add_language(name, acronym):
    if Languages.query.filter_by(name=name).first() or Languages.query.filter_by(acronym=acronym).first():
        print("Language already exists!")
        return None

    new_lang = Languages(name=name, acronym=acronym)
      
    db.session.add(new_lang)
    db.session.commit()

    print("Language added succesfully!")


if __name__ == "__main__":
    #app.run(host='0.0.0.0', port=5000)
    app.run(debug=True)
