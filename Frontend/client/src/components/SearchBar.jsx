import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);     // update local state
    onSearch(value);     // send value to App.jsx
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a K-Drama..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
}

export default SearchBar;