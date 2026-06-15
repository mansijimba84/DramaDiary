import React, { useEffect, useState } from "react";

const DramaCard = ({ drama, onClick }) => {
  const [storedList, setStoredList] = useState([]);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5050/api/reviews";

  const title =
    drama.name || drama.original_name || "Untitled";

  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : null;


  const fetchList = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStoredList(data.reviews || []);
    } catch (err) {
      console.log("Failed to fetch list:", err.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const activeStatus = storedList.find(
    (item) => item.dramaId === drama.id
  )?.status;

  const handleStatus = async (e, status) => {
    e.stopPropagation();

    if (!token) return;

    try {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dramaId: drama.id,
          dramaTitle: title,
          dramaPoster: drama.poster_path,
          status,
          rating: 0,
          reviewText: "",
        }),
      });

      // refresh list after update
      fetchList();
    } catch (err) {
      console.log("Status update failed:", err.message);
    }
  };

  return (
    <div className="drama-card" onClick={onClick}>
      {activeStatus && <div className="badge">In List</div>}

      <img src={posterUrl} className="drama-poster" />

      <div className="drama-info">
        <h3>{title}</h3>

        <div className="status-buttons">
          <button
            className={activeStatus === "Watching" ? "active" : ""}
            onClick={(e) => handleStatus(e, "Watching")}
          >
            Watching
          </button>

          <button
            className={activeStatus === "Watched" ? "active" : ""}
            onClick={(e) => handleStatus(e, "Watched")}
          >
            Watched
          </button>

          <button
            className={activeStatus === "Plan" ? "active" : ""}
            onClick={(e) => handleStatus(e, "Plan")}
          >
            Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;