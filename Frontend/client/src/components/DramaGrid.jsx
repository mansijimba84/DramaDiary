import { useState, useEffect } from "react";
import DramaGrid from "./components/DramaGrid";
import "./App.css";

function App() {
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDramas = async () => {
      try {
        setLoading(true);

        const apiKey = import.meta.env.VITE_TMDB_KEY;

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/tv?with_original_language=ko&sort_by=popularity.desc&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dramas");
        }

        const data = await response.json();
        setDramas(data.results);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDramas();
  }, []);

  return (
    <section id="center">
      <div className="hero-text">
        <h1>DramaDiary</h1>
        <h3>Your K-drama journal</h3>

        {/* 🔥 STATE 1: LOADING */}
        {loading && <p className="loading">Loading dramas...</p>}

        {/* ❌ STATE 2: ERROR */}
        {error && <p className="error">{error}</p>}

        {/* ✅ STATE 3: SUCCESS */}
        {!loading && !error && <DramaGrid dramas={dramas} />}
      </div>
    </section>
  );
}

export default App;