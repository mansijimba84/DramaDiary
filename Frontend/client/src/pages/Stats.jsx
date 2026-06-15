import { useEffect, useMemo, useState } from "react";

function Stats() {
  const [dramas, setDramas] = useState([]);

  const token = localStorage.getItem("token");
  const API = "http://localhost:5050/api/reviews";

  const fetchData = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDramas(data.reviews || []);
    } catch (err) {
      console.log("Failed to fetch stats:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Watched = useMemo(() => {
    return dramas.filter((d) => d.status === "Watched");
  }, [dramas]);

  const totalWatched = Watched.length;

  const averageRating = useMemo(() => {
    if (Watched.length === 0) return 0;

    const sum = Watched.reduce((acc, d) => acc + (d.rating || 0), 0);
    return (sum / Watched.length).toFixed(1);
  }, [Watched]);

  const topDrama = useMemo(() => {
    if (Watched.length === 0) return null;

    return [...Watched].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    )[0];
  }, [Watched]);

  const totalHours = useMemo(() => {
    return Watched.reduce((acc, d) => {
      return acc + ((d.episodes || 0) * 60);
    }, 0);
  }, [Watched]);

  const distribution = useMemo(() => {
    const dist = Array(5).fill(0);

    Watched.forEach((d) => {
      const r = Math.round(d.rating || 0);
      if (r >= 1 && r <= 5) {
        dist[r - 1]++;
      }
    });

    return dist;
  }, [Watched]);

  const maxCount = Math.max(...distribution, 1);

  if (Watched.length === 0) {
    return (
      <div className="stats-page">
        <h1>Stats</h1>
        <p>No reviews yet — start watching dramas first 🎬</p>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <h1>My Watching Stats</h1>

      {/* SUMMARY CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Watched</h3>
          <p>{totalWatched}</p>
        </div>

        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>{averageRating} ⭐</p>
        </div>

        <div className="stat-card">
          <h3>Top Pick</h3>
          <p>{topDrama?.dramaTitle || "N/A"}</p>
        </div>

        <div className="stat-card">
          <h3>Total Hours</h3>
          <p>{Math.round(totalHours / 60)} hrs</p>
        </div>
      </div>

      {/* BAR CHART */}
      <h2>Rating Distribution</h2>

      <div className="chart">
        {distribution.map((count, index) => {
          const percent = (count / maxCount) * 100;

          return (
            <div key={index} className="bar-row">
              <span>{index + 1}⭐</span>

              <div className="bar-bg">
                <div
                  className="bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stats;