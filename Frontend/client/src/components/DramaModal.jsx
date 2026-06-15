import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import API from "../api";

function DramaModal({ drama, onClose }) {
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [status, setStatus] = useState("Plan");
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ FETCH TMDB DETAILS
  useEffect(() => {
    if (!drama) return;

    const fetchDetails = async () => {
      const apiKey = import.meta.env.VITE_TMDB_KEY;

      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${drama.id}?api_key=${apiKey}`
      );

      const data = await res.json();
      setDetails(data);
    };

    fetchDetails();
  }, [drama]);

  // ✅ FETCH REVIEWS
  const fetchReviews = async () => {
    if (!drama) return;

    const res = await fetch(`${API}/api/reviews/drama/${drama.id}`);
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  useEffect(() => {
    if (drama) fetchReviews();
  }, [drama]);

  // ✅ SAVE STATUS
  const saveStatus = async (newStatus) => {
    setStatus(newStatus);

    await fetch(`${API}/api/reviews`, {
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

  // ✅ SAVE REVIEW
  const handleSaveReview = async () => {
    await fetch(`${API}/api/reviews`, {
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
    fetchReviews();

    setTimeout(() => setShowPopup(false), 2000);
  };

  if (!drama) return null;
  if (!details) return <div>Loading...</div>;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>{details.name}</h2>

        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          className="modal-poster"
        />

        <p>{details.overview}</p>

        {/* STATUS */}
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

        {/* REVIEW */}
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