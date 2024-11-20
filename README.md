<div align="center">
## Flashcards

A simple flashcard application for a small group of users. It is designed to allow users create whole bases of cards and use them for effective learning.

</div>

## Installation
### Prerequisities
- Python3.x installed.
- A database ex. SQLite.
- A virtual environment like venv.

### Steps
1. Clone the repository.
    ```
    git clone https://github.com/johnykosmos/flashcards.git
    ```
2. Navigate to the cloned directory.
    ```
    cd path/to/flashcards 
    ```
3. Create a virtual environment.
    ```
    python3 -m venv venv 
    ```
4. Source the venv.
    - on macOS/Linux:
    ```
    source venv/bin/activate
    ```
5. Set environment variables in app.py.
    ```
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flashcards.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = "ilovecats"
    ```
6. Run the flask server.
    ```
    flask run 
    ```

## Features

### Frontend
- Simple user interface styled to look like Google Translate.
- Text-To-Speech function for every card created using Web Speech Chrome API. `(MIGHT NOT WORK IN BROWSER OTHER THAN CHROME)`
- Create cardbases, add cards or remove everything above!
- Assign proper languages for the base language and the translation.
### Backend
- Simple Database model using SQLAlchemy ORM for user, cardbase and language data.
- Simple CLI for managing key parts of the database.
- Flask built-in session management.
- Not so scalable.
