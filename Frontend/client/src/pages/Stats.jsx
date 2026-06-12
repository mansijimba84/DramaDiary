import { useMemo } from "react";
import useLocalStorage from "../hooks/LocalStorage";

function Stats() {
  const [dramas] = useLocalStorage("dramaList", []);

  // only watched dramas
  const watched = dramas.filter((d) => d.status === "watched");

  // total watched
  const totalWatched = watched.length;

  // average rating
  const averageRating = useMemo(() => {
    if (watched.length === 0) return 0;

    const sum = watched.reduce((acc, d) => acc + (d.rating || 0), 0);
    return (sum / watched.length).toFixed(1);
  }, [watched]);

  // top pick
  const topDrama = useMemo(() => {
    if (watched.length === 0) return null;

    return [...watched].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0)
    )[0];
  }, [watched]);

  // estimated hours (episodes * 60 mins)
  const totalHours = useMemo(() => {
    return watched.reduce((acc, d) => {
      return acc + ((d.episodes || 0) * 60);
    }, 0);
  }, [watched]);

  // rating distribution (1–5 stars)
  const distribution = useMemo(() => {
    const dist = Array(5).fill(0);

    watched.forEach((d) => {
      const r = Math.round(d.rating || 0);
      if (r >= 1 && r <= 5) {
        dist[r - 1]++;
      }
    });

    return dist;
  }, [watched]);

  const maxCount = Math.max(...distribution, 1);

  if (watched.length === 0) {
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
          <p>{topDrama?.title || "N/A"}</p>
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