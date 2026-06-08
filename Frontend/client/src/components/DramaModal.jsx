import { useEffect, useState } from "react";

function DramaModal({ drama, onClose }) {
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);

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
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [drama]);

  useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  document.addEventListener("keydown", handleEscape);

  document.body.style.overflow = "hidden";

  return () => {
    document.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "auto";
  };
}, [onClose]);

if (!details) {
  return null;
}

return (
  <div className="modal-backdrop" onClick={onClose}>
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-btn"
        onClick={onClose}
      >
        ×
      </button>

      <h2>{details.name}</h2>

      <img
        src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
        alt={details.name}
        className="modal-poster"
      />

      <p>{details.overview}</p>

      <div className="drama-info">
        <p>
          <strong>Seasons:</strong> {details.number_of_seasons}
        </p>

        <p>
          <strong>Episodes:</strong> {details.number_of_episodes}
        </p>

        <p>
          <strong>Genres:</strong>{" "}
          {details.genres?.map((g) => g.name).join(", ")}
        </p>
      </div>

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