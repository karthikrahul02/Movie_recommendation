from flask import Flask, request, jsonify #type : ignore
from flask_cors import CORS # type: ignore
import requests
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.getenv("TMDB_API_KEY")


def fetch_movies(genre_id=None):
    url = "https://api.themoviedb.org/3/discover/movie"

    params = {
        "api_key": TMDB_API_KEY,
        "sort_by": "popularity.desc",
        "language": "en-US"
    }

    if genre_id:
        params["with_genres"] = genre_id

    response = requests.get(url, params=params)
    return response.json()


@app.route("/")
def home():
    return "Backend running 🚀"


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    mood = data.get("mood")

    genre_map = {
        "happy": "35",     # comedy
        "sad": "18",       # drama
        "excited": "28",   # action
        "scared": "27"     # horror
    }

    genre_id = genre_map.get(mood, "35")

    movies = fetch_movies(genre_id)

    results = []

    for movie in movies.get("results", [])[:3]:
        results.append({
            "title": movie.get("title"),
            "overview": movie.get("overview"),
            "rating": movie.get("vote_average"),
            "poster": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}"
        })

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)