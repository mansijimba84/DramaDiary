import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../assets/tv-show.png";
import logoutImg from "../assets/logout.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const syncUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    syncUser();

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      {/* BRAND */}
      <div className="brand">
        <img src={logo} alt="Drama Diary logo" className="nav-logo" />
        <h2 className="nav-title">Drama Diary</h2>
      </div>

      {/* LINKS */}
      <div className="nav-links">
        <Link className={location.pathname === "/" ? "active" : ""} to="/">
          Browse
        </Link>

        <Link
          className={location.pathname === "/my-list" ? "active" : ""}
          to="/my-list"
        >
          My List
        </Link>

        <Link
          className={location.pathname === "/stats" ? "active" : ""}
          to="/stats"
        >
          Stats
        </Link>

        {/* LOGOUT IMAGE */}
        {user && (
          <img
            src={logoutImg}
            alt="logout"
            onClick={handleLogout}
            className="logout-img"
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;