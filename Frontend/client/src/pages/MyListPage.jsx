import React from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/LocalStorage";

const MyListPage = () => {
  const [dramas, setDramas] = useLocalStorage("dramaList", []);

  const removeDrama = (id) => {
    setDramas((prev) => prev.filter((item) => item.id !== id));
  };

  const changeStatus = (id, status) => {
    setDramas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const renderSection = (title, status) => {
    const filtered = dramas.filter((d) => d.status === status);

    return (
      <div className="section">
        <h2 className="section-title">{title}</h2>

        {filtered.length === 0 ? (
          <div className="empty-box">
            <p>No dramas here yet — go find one</p>
            <Link to="/" className="browse-link">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="row">
            {filtered.map((drama) => (
              <div key={drama.id} className="card">
                <img
                  src={
                    drama.poster
                      ? `https://image.tmdb.org/t/p/w300${drama.poster}`
                      : "https://via.placeholder.com/300x450"
                  }
                  alt={drama.title}
                />

                <div className="card-content">
                  <h3>{drama.title}</h3>

                  <select
                    value={drama.status}
                    onChange={(e) =>
                      changeStatus(drama.id, e.target.value)
                    }
                  >
                    <option value="plan">Plan to Watch</option>
                    <option value="watching">Watching</option>
                    <option value="watched">Watched</option>
                  </select>

                  <button
                    className="remove-btn"
                    onClick={() => removeDrama(drama.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mylist-page">

      {/* 🔥 FIXED HEADER (always top center) */}
      <header className="mylist-header">
        <h1 className="page-title">My Drama List</h1>
      </header>

      {/* PAGE CONTENT */}
      <div className="mylist-content">
        {renderSection("Plan to Watch", "plan")}
        {renderSection("Watching", "watching")}
        {renderSection("Watched", "watched")}
      </div>

    </div>
  );
};

export default MyListPage;