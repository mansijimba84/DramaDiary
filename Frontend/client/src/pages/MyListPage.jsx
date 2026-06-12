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
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const renderStars = (rating = 0) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const renderSection = (title, status) => {
    const filtered = dramas.filter((d) => d.status === status);

    return (
      <div className="section">
        <h2 className="section-title">{title}</h2>

        {filtered.length === 0 ? (
          <div className="empty-box">
            <p>No dramas here yet</p>
            <Link to="/">Browse</Link>
          </div>
        ) : (
          <div className="row">
            {filtered.map((drama) => (
              <div key={drama.id} className="card">

                {/* POSTER */}
                <img
                  src={`https://image.tmdb.org/t/p/w300${drama.poster}`}
                  alt={drama.title}
                />

                <div className="card-content">
                  <h3>{drama.title}</h3>

                  {/* STATUS SELECT */}
                  <select
                    value={drama.status}
                    onChange={(e) =>
                      changeStatus(drama.id, e.target.value)
                    }
                  >
                    <option value="plan">Plan</option>
                    <option value="watching">Watching</option>
                    <option value="watched">Watched</option>
                  </select>

                  {/* ⭐ REVIEW SECTION */}
                  {drama.status === "watched" && (
                    <div style={{ marginTop: "8px" }}>

                      {/* STARS */}
                      <div
                        style={{
                          color: "#facc15",
                          fontSize: "24px",
                          marginBottom: "4px"
                        }}
                      >
                        {renderStars(drama.rating || 0)}
                      </div>

                      {/* REVIEW TEXT */}
                      {drama.reviewText && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#555",
                            lineHeight: "1.4"
                          }}
                        >
                          {drama.reviewText}
                        </p>
                      )}
                    </div>
                  )}

                  {/* REMOVE BUTTON */}
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
      <header className="mylist-header">
        <h1 className="page-title">My Drama List</h1>
      </header>

      <div className="mylist-content">
        {renderSection("Plan", "plan")}
        {renderSection("Watching", "watching")}
        {renderSection("Watched", "watched")}
      </div>
    </div>
  );
};

export default MyListPage;