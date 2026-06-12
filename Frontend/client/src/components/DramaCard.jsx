import React, { useEffect, useState } from "react";

const DramaCard = ({ drama, onClick }) => {
  const [storedList, setStoredList] = useState([]);

  useEffect(() => {
    const update = () => {
      const data = JSON.parse(
        localStorage.getItem("dramaList") || "[]"
      );
      setStoredList(data);
    };

    update(); // initial load

    window.addEventListener("storage-update", update);

    return () =>
      window.removeEventListener("storage-update", update);
  }, []);

  const activeStatus = storedList.find(
    (item) => item.id === drama.id
  )?.status;

  const title =
    drama.name || drama.original_name || "Untitled";

  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : null;

  const handleStatus = (e, status) => {
    e.stopPropagation();

    const current = JSON.parse(
      localStorage.getItem("dramaList") || "[]"
    );

    const exists = current.find((item) => item.id === drama.id);

    let updated;

    if (exists) {
      updated = current.map((item) =>
        item.id === drama.id
          ? { ...item, status, title, poster: drama.poster_path }
          : item
      );
    } else {
      updated = [
        ...current,
        {
          id: drama.id,
          title,
          poster: drama.poster_path,
          status,
        },
      ];
    }

    localStorage.setItem("dramaList", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage-update"));
  };

  return (
    <div className="drama-card" onClick={onClick}>
      {activeStatus && <div className="badge">In List</div>}

      <img src={posterUrl} className="drama-poster" />

      <div className="drama-info">
        <h3>{title}</h3>

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