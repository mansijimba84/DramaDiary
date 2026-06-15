import { useEffect, useState } from "react";
import StarRating from "./StarRating";

function DramaModal({ drama, onClose }) {
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [status, setStatus] = useState("Plan");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5050/api/reviews";

  useEffect(() => {
    if (!drama) return;

    setDetails(null);
    setReviews([]);
    setRating(0);
    setReviewText("");
    setStatus("Plan");
  }, [drama]);

  useEffect(() => {
    if (!drama) return;

    const apiKey = import.meta.env.VITE_TMDB_KEY;

    const fetchDetails = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${drama.id}?api_key=${apiKey}`
      );
      const data = await res.json();
      setDetails(data);
    };

    fetchDetails();
  }, [drama]);

  const fetchReviews = async () => {
    if (!drama) return;

    const res = await fetch(`${API}/drama/${drama.id}`);
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    if (drama) fetchReviews();
  }, [drama]);

  // ✅ NEW: SAVE STATUS WHEN BUTTON CLICKED
  const saveStatus = async (newStatus) => {
    setStatus(newStatus);

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dramaId: drama.id,
        dramaTitle: drama.name,
        dramaPoster: drama.poster_path,
        status: newStatus,
        rating,
        reviewText,
      }),
    });

    fetchReviews();
  };

  const handleSaveReview = async () => {
    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dramaId: drama.id,
        dramaTitle: drama.name,
        dramaPoster: drama.poster_path,
        status,
        rating,
        reviewText,
      }),
    });

    setShowPopup(true);
    await fetchReviews();
    setTimeout(() => setShowPopup(false), 2000);
  };

  if (!drama) return null;
  if (!details) return <div>Loading...</div>;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{details.name}</h2>

        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          className="modal-poster"
        />

        <p>{details.overview}</p>

        {/* STATUS (UI SAME) */}
        <div className="status-buttons">
          <button
            className={status === "Plan" ? "active" : ""}
            onClick={() => saveStatus("Plan")}
          >
            Plan
          </button>

          <button
            className={status === "Watching" ? "active" : ""}
            onClick={() => saveStatus("Watching")}
          >
            Watching
          </button>

          <button
            className={status === "Watched" ? "active" : ""}
            onClick={() => saveStatus("Watched")}
          >
            Watched
          </button>
        </div>

        {/* REVIEW FORM (UNCHANGED UI) */}
        {status === "Watched" && (
          <div className="review-section">
            <h3>Your Review</h3>

            <StarRating value={rating} onChange={setRating} />

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="review-textarea"
            />

            <button onClick={handleSaveReview} className="review-save-btn">
              Save Review
            </button>
          </div>
        )}

        {/* REVIEWS */}
        <div className="reviews-list">
          <h3>All Reviews</h3>

          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="review-card">
                <p><b>{r.userId?.username}</b></p>
                <p>⭐ {r.rating}</p>
                <p>{r.reviewText}</p>
              </div>
            ))
          )}
        </div>

        {showPopup && (
          <div className="review-popup">Review Saved ✔</div>
        )}
      </div>
    </div>
  );
}

export default DramaModal;