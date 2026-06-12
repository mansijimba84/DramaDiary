import { useEffect, useState } from "react";
import useLocalStorage from "../hooks/LocalStorage";

function DramaModal({ drama, onClose }) {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);

  const [dramas, setDramas] = useLocalStorage("dramaList", []);

  const status =
    dramas.find((item) => item.id === drama?.id)?.status || null;

  // =========================
  // FETCH DRAMA DETAILS
  // =========================
  useEffect(() => {
    if (!drama) return;

    const apiKey = import.meta.env.VITE_TMDB_KEY;

    const fetchData = async () => {
      try {
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
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [drama]);

  // =========================
  // ESC CLOSE MODAL
  // =========================
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // =========================
  // STATUS UPDATE (FIXED + SYNC)
  // =========================
  const handleStatusChange = (value) => {
    const title =
      drama.name || drama.original_name || "Untitled";

    setDramas((prev) => {
      const exists = prev.find((item) => item.id === drama.id);

      let updated;

      if (exists) {
        updated = prev.map((item) =>
          item.id === drama.id
            ? { ...item, status: value }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: drama.id,
            title,
            poster: drama.poster_path,
            status: value,
          },
        ];
      }

      // 🔥 IMPORTANT: trigger global update for DramaCard + MyList
      localStorage.setItem(
        "dramaList",
        JSON.stringify(updated)
      );
      window.dispatchEvent(new Event("storage-update"));

      return updated;
    });
  };

  if (!details) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>{details.name}</h2>

        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.name}
          className="modal-poster"
        />

        <p>{details.overview}</p>

        {/* =========================
            STATUS BUTTONS
        ========================= */}
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

        {/* =========================
            DETAILS
        ========================= */}
        <div className="drama-info">
          <p>
            <strong>Seasons:</strong>{" "}
            {details.number_of_seasons}
          </p>

          <p>
            <strong>Episodes:</strong>{" "}
            {details.number_of_episodes}
          </p>

          <p>
            <strong>Genres:</strong>{" "}
            {details.genres?.map((g) => g.name).join(", ")}
          </p>
        </div>

        {/* =========================
            CAST
        ========================= */}
        <h3>Cast</h3>

        <div className="cast-grid">
          {cast.map((person) => (
            <div key={person.id} className="cast-card">
              {person.profile_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                />
              )}
              <p>{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DramaModal;