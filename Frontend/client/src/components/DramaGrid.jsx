import React from "react";
import DramaCard from "./DramaCard";

const DramaGrid = ({ dramas, onSelectDrama }) => {
  if (!dramas || dramas.length === 0) {
    return <p>No dramas found</p>;
  }

  return (
    <div className="drama-grid">
      {dramas.map((drama) => (
        <DramaCard
          key={drama.id}
          drama={drama}
          onClick={() => onSelectDrama(drama)}
        />
      ))}
    </div>
  );
};

export default DramaGrid;