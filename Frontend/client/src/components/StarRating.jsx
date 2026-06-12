import React from "react";

const StarRating = ({ value = 0, onChange }) => {
  return (
    <div style={{ display: "flex", gap: "4px", cursor: "pointer" }}>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;

        return (
          <span
            key={i}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => {}}
            style={{
              fontSize: "20px",
              color: starValue <= value ? "#facc15" : "#d1d5db",
              transition: "0.2s",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;