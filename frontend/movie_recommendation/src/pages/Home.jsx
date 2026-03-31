import { useState } from "react";
import "../App.css";

function Home() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood: input }),
    });

    const data = await res.json();
    setMovies(data);
    setLoading(false);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>🎬 CineMind</h2>
        <div>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </div>
      </nav>

      <div className="hero">
        <h1>What should you watch tonight?</h1>
        <p>Tell me your mood. I’ll find your film.</p>

        <div className="chat-box">
          <input
            placeholder="e.g. something emotional but not too heavy..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={getRecommendations}>Ask AI</button>
        </div>
      </div>

      {loading && <p className="loading">Thinking...</p>}

      <div className="grid">
        {movies.map((m, i) => (
          <div className="card" key={i}>
            <img src={m.poster} />
            <h3>{m.title}</h3>
            <p>{m.overview.slice(0, 120)}...</p>
            <span>⭐ {m.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;