import React from "react";

const DramaCard = ({ drama }) => {
  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : null;

  const year = drama.first_air_date
    ? drama.first_air_date.substring(0, 4)
    : "N/A";

  return (
    <div className="drama-card">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={drama.name}
          className="drama-poster"
        />
      ) : (
        <div className="poster-placeholder">
          <span>{drama.name}</span>
        </div>
      )}

      <div className="drama-info">
        <h3>{drama.name}</h3>
        <p>Year: {year}</p>
        <p>⭐ {drama.vote_average?.toFixed(1) || "N/A"}</p>
      </div>
    </div>
  );
};

export default DramaCard;