<div align="center">
    
# Flashcards

A simple flashcard application for a small group of users. It is designed to allow users create whole bases of cards and use them for effective learning.

</div>

## Installation
### Prerequisities
- Python3.x installed (versions below 3.13).
- A database (e.g., SQLite).
- A virtual environment tool like venv or Docker.

### Deployment with venv
1. Clone the repository.
    ```
    git clone https://github.com/johnykosmos/flashcards.git
    cd path/to/flashcards
    ```
2. Create a virtual environment.
    ```
    python3 -m venv venv 
    ```
3. Source the venv.
    - on macOS/Linux:
    ```
    source venv/bin/activate
    ```
4. Install required packages.
    ```
    pip install -r requirements.txt
    ```
5. Set environment variables in app.py. For example:
    ```
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flashcards.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = "ilovecats"
    ```
6. Run the flask server.
    ```
    flask run 
    ```
### Deployment with Docker
1. Clone the repository.
    ```
    git clone https://github.com/johnykosmos/flashcards.git
    cd path/to/flashcards
    ```
2. Build the Docker image:
    ```
    docker build -t flashcards-app .
    ```

3. Run the Docker container:
    ```
    docker run -p 5000:5000 flashcards-app
    ```

## Features

### Client
- Simple user interface styled to look like Google Translate.
- Text-To-Speech function for reading words in available languages. `(MIGHT NOT WORK IN BROWSER OTHER THAN CHROME)`
- UI that allows the user to create cardbases, add cards or remove them.

### Server
- Simple Database model using SQLAlchemy ORM for managing user, cardbase and language data.
- Simple CLI for database manipulation.
- Flask built-in session management.
