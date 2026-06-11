import React from "react";
import useLocalStorage from "../hooks/LocalStorage";

const DramaCard = ({ drama, onClick }) => {
  const [dramas, setDramas] = useLocalStorage("dramaList", []);

  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : null;

  const title = drama.name || drama.original_name || "Untitled";

  const year = drama.first_air_date
    ? drama.first_air_date.slice(0, 4)
    : "N/A";

  const handleStatus = (e, status) => {
    e.stopPropagation();

    setDramas((prev) => {
      const exists = prev.find((item) => item.id === drama.id);

      if (exists) {
        return prev.map((item) =>
          item.id === drama.id
            ? { ...item, status, title, poster: drama.poster_path }
            : item
        );
      }

      return [
        ...prev,
        {
          id: drama.id,
          title,
          poster: drama.poster_path,
          status,
        },
      ];
    });
  };

  const activeStatus = dramas.find((item) => item.id === drama.id)?.status;

  const isInList = !!activeStatus;

  return (
    <div className="drama-card" onClick={onClick} style={{ position: "relative" }}>
      
      {/* BADGE */}
      {isInList && <div className="badge">In List</div>}

      {posterUrl ? (
        <img src={posterUrl} alt={title} className="drama-poster" />
      ) : (
        <div className="poster-placeholder">
          <span>{title}</span>
        </div>
      )}

      <div className="drama-info">
        <h3>{title}</h3>
        <p>Year: {year}</p>
        <p>⭐ {drama.vote_average ? drama.vote_average.toFixed(1) : "N/A"}</p>

        {/* STATUS BUTTONS */}
        <div className="status-buttons">
          <button
            className={activeStatus === "watching" ? "active" : ""}
            onClick={(e) => handleStatus(e, "watching")}
          >
            Watching
          </button>

          <button
            className={activeStatus === "watched" ? "active" : ""}
            onClick={(e) => handleStatus(e, "watched")}
          >
            Watched
          </button>

          <button
            className={activeStatus === "plan" ? "active" : ""}
            onClick={(e) => handleStatus(e, "plan")}
          >
            Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;