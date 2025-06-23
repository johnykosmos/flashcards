from flask import Flask
from models import Languages, db, User
from routes import main
import click

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flashcards.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "ilovecats"
available_languages = [["English", "en-US"], ["French", "fr-FR"], ["Spanish", "es-ES"]]

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

    for cardbase in user.cardbases:
        db.session.delete(cardbase)


    db.session.delete(user)
    db.session.commit();
    
    print(f"User {user_id} removed successfully")

def add_language(name, acronym):
    if Languages.query.filter_by(name=name).first() or Languages.query.filter_by(acronym=acronym).first():
        return None

    new_lang = Languages(name=name, acronym=acronym)
      
    db.session.add(new_lang)
    db.session.commit()

@app.cli.command("add-lang")
@click.argument("name")
@click.argument("acronym")
def add_language_command(name, acronym):
    if not add_language(name, acronym):
        print("Language already exists!")
    else:
        print("Language added succesfully!")

def init_db():
    with app.app_context():
        db.create_all()
        
        if not Languages.query.first():
            for name, acronym in available_languages:
                add_language(name, acronym)

db.init_app(app)
app.register_blueprint(main)
init_db()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

