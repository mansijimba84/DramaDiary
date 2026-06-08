import React from "react";

const DramaCard = ({ drama, onClick }) => {
  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : null;

  const title = drama.name || drama.original_name || "Untitled";

  const year = drama.first_air_date
    ? drama.first_air_date.slice(0, 4)
    : "N/A";

  return (
    <div className="drama-card" onClick={onClick}>
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
      </div>
    </div>
  );
};

export default DramaCard;