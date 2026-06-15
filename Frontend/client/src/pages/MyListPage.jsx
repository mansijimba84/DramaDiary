import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyListPage = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  const API = "http://localhost:5050/api/reviews";

  const fetchReviews = async () => {
    const res = await fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateReview = async (id, updates) => {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (res.ok) {
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? data.review : r))
      );
    }
  };

  const removeDrama = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  const renderSection = (title, status) => {
    const filtered = reviews.filter((r) => r.status === status);

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
              <div key={drama._id} className="card">

                <img
                  src={`https://image.tmdb.org/t/p/w300${drama.dramaPoster}`}
                />

                <div className="card-content">
                  <h3>{drama.dramaTitle}</h3>

                  {/* STATUS */}
                  <select
                    value={drama.status}
                    onChange={(e) =>
                      updateReview(drama._id, { status: e.target.value })
                    }
                  >
                    <option value="Plan">Plan</option>
                    <option value="Watching">Watching</option>
                    <option value="Watched">Watched</option>
                  </select>

                  {/* STARS */}
                  {drama.status === "Watched" && (
                    <div>
                      {[1,2,3,4,5].map((s) => (
                        <span
                          key={s}
                          onClick={() =>
                            updateReview(drama._id, { rating: s })
                          }
                          style={{
                            cursor: "pointer",
                            color: s <= drama.rating ? "gold" : "gray"
                          }}
                        >
                          ★
                        </span>
                      ))}

                      <textarea
                        value={drama.reviewText || ""}
                        onChange={(e) =>
                          updateReview(drama._id, {
                            reviewText: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <button onClick={() => removeDrama(drama._id)}>
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
      <h1>My Drama List</h1>

      {renderSection("Plan", "Plan")}
      {renderSection("Watching", "Watching")}
      {renderSection("Watched", "Watched")}
    </div>
  );
};

export default MyListPage;