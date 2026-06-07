import { useState, useEffect } from "react";
import DramaGrid from "./components/DramaGrid";
import "./App.css";
import logo from "./assets/tv-show.png"; // ✅ correct path (put inside src/assets)

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

        const data = await response.json();

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
    <div className="app">
      <header className="header">
        <div className="brand">
          <img src={logo} alt="Drama Diary logo" className="logo-img" />
          <h1 className="logo-text">Drama Diary</h1>
        </div>
      </header>
       <p className="subtitle">Fresh K-Drama discoveries, curated for you</p>

      <main className="container">
        {loading && (
          <div className="state">
            <div className="loader"></div>
            <p>Loading dramas...</p>
          </div>
        )}

        {error && (
          <div className="state error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && dramas.length > 0 && (
          <DramaGrid dramas={dramas} />
        )}

        {!loading && !error && dramas.length === 0 && (
          <div className="state">
            <p>No dramas found</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;