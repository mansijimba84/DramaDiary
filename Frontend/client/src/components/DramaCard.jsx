import React, { useEffect, useState } from "react";
import API from "../api";

const DramaCard = ({ drama, onClick }) => {
  const [storedList, setStoredList] = useState([]);

  const token = localStorage.getItem("token");

  const title = drama.name || drama.original_name || "Untitled";

  const posterUrl = drama.poster_path
    ? `https://image.tmdb.org/t/p/w500${drama.poster_path}`
    : null;

  const fetchList = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API}/api/reviews/me`, {
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
      const res = await fetch(`${API}/api/reviews`, {
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

      if (!res.ok) throw new Error("Request failed");

      fetchList();
    } catch (err) {
      console.log(err.message);
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
            onClick={(e) => handleStatus(e, "Watching")}
            className={activeStatus === "Watching" ? "active" : ""}
          >
            Watching
          </button>

          <button
            onClick={(e) => handleStatus(e, "Watched")}
            className={activeStatus === "Watched" ? "active" : ""}
          >
            Watched
          </button>

          <button
            onClick={(e) => handleStatus(e, "Plan")}
            className={activeStatus === "Plan" ? "active" : ""}
          >
            Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DramaCard;