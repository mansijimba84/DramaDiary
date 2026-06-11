import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/tv-show.png";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      {/* BRAND SECTION */}
      <div className="brand">
        <img src={logo} alt="Drama Diary logo" className="nav-logo" />
        <h2 className="nav-title">Drama Diary</h2>
      </div>

      {/* LINKS */}
      <div className="nav-links">
        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Browse
        </Link>

        <Link
          to="/my-list"
          className={location.pathname === "/my-list" ? "active" : ""}
        >
          My List
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;