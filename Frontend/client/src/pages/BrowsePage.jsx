import { useState, useEffect } from "react";
import DramaGrid from "../components/DramaGrid";
import SearchBar from "../components/SearchBar";
import DramaModal from "../components/DramaModal";
import logo from "../assets/tv-show.png";
import "../App.css";

function BrowsePage() {
  const [dramas, setDramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedDrama, setSelectedDrama] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchDramas = async () => {
      try {
        setLoading(true);

        const apiKey = import.meta.env.VITE_TMDB_KEY;

        let url;

        if (debouncedQuery.trim() === "") {
          url = `https://api.themoviedb.org/3/discover/tv?with_original_language=ko&sort_by=popularity.desc&api_key=${apiKey}`;
        } else {
          url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
            debouncedQuery
          )}&api_key=${apiKey}`;
        }

        const response = await fetch(url);
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
  }, [debouncedQuery]);

  return (
    <div className="app">

      <p className="subtitle">
        Fresh K-Drama discoveries, curated for you
      </p>

      <main>
        <SearchBar onSearch={setSearchQuery} />

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

        {!loading && !error && (
          <DramaGrid
            dramas={dramas}
            onSelectDrama={setSelectedDrama}
          />
        )}

        {!loading && !error && dramas.length === 0 && (
          <div className="state">
            <p>No dramas found</p>
          </div>
        )}
      </main>

      {selectedDrama && (
        <DramaModal
          drama={selectedDrama}
          onClose={() => setSelectedDrama(null)}
        />
      )}
    </div>
  );
}

export default BrowsePage;