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

        console.log("API KEY:", apiKey); // DEBUG

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/tv?with_original_language=ko&sort_by=popularity.desc&api_key=${apiKey}`
        );

        const data = await response.json();
        console.log("TMDB DATA:", data); // DEBUG

        if (!response.ok) {
          throw new Error(data?.status_message || "Failed to fetch dramas");
        }

        setDramas(data.results || []);
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

        {loading && <p className="loading">Loading dramas...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && dramas.length > 0 && (
          <DramaGrid dramas={dramas} />
        )}

        {!loading && !error && dramas.length === 0 && (
          <p>No dramas found</p>
        )}
      </div>
    </section>
  );
}

export default App;