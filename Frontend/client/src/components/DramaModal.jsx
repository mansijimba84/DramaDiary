import { useEffect, useState } from "react";
import useLocalStorage from "../hooks/LocalStorage";
import StarRating from "./StarRating";

function DramaModal({ drama, onClose }) {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);

  const [dramas, setDramas] = useLocalStorage("dramaList", []);

  const existing = dramas.find((d) => d.id === drama?.id);
  const status = existing?.status || null;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // reset when drama changes
  useEffect(() => {
    if (existing) {
      setRating(existing.rating || 0);
      setReviewText(existing.reviewText || "");
    } else {
      setRating(0);
      setReviewText("");
    }
  }, [drama?.id]);

  // fetch data
  useEffect(() => {
    if (!drama) return;

    const apiKey = import.meta.env.VITE_TMDB_KEY;

    const fetchData = async () => {
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/tv/${drama.id}?api_key=${apiKey}`
      );
      const detailsData = await detailsRes.json();

      const castRes = await fetch(
        `https://api.themoviedb.org/3/tv/${drama.id}/credits?api_key=${apiKey}`
      );
      const castData = await castRes.json();

      setDetails(detailsData);
      setCast(castData.cast?.slice(0, 5) || []);
    };

    fetchData();
  }, [drama]);

  // escape close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const updateItem = (updates) => {
    const title = drama.name || drama.original_name || "Untitled";

    setDramas((prev) => {
      const exists = prev.find((d) => d.id === drama.id);

      let updated;

      if (exists) {
        updated = prev.map((item) =>
          item.id === drama.id
            ? {
                ...item,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: drama.id,
            title,
            poster: drama.poster_path,
            status: updates.status || "plan",
            rating: 0,
            reviewText: "",
            updatedAt: new Date().toISOString(),
            ...updates,
          },
        ];
      }

      localStorage.setItem("dramaList", JSON.stringify(updated));
      return updated;
    });
  };

  const handleStatusChange = (value) => {
    updateItem({ status: value });
  };

  const handleSaveReview = () => {
    updateItem({
      rating,
      reviewText,
      status: "watched",
    });

    setShowPopup(true);
    setRating(0);
    setReviewText("");

    setTimeout(() => setShowPopup(false), 2000);
  };

  if (!details) return null;

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
            className={status === "plan" ? "active" : ""}
            onClick={() => handleStatusChange("plan")}
          >
            Plan
          </button>

          <button
            className={status === "watching" ? "active" : ""}
            onClick={() => handleStatusChange("watching")}
          >
            Watching
          </button>

          <button
            className={status === "watched" ? "active" : ""}
            onClick={() => handleStatusChange("watched")}
          >
            Watched
          </button>
        </div>

        {/* REVIEW SECTION */}
        {status === "watched" && (
          <div className="review-section">
            <h3>Your Review</h3>

            <div className="star-rating">
              <StarRating value={rating} onChange={setRating} />
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review (optional)"
              className="review-textarea"
            />

            <button
              className="review-save-btn"
              onClick={handleSaveReview}
            >
              Save Review
            </button>
          </div>
        )}

        {/* POPUP */}
        {showPopup && (
          <div className="review-popup">
            Review Saved ✔
          </div>
        )}
      </div>
    </div>
  );
}

export default DramaModal;