import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5050/api/auth/login"
      : "http://localhost:5050/api/auth/signup";

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : formData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Authentication failed");
        return;
      }

      // ✅ store auth data
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // 🔥 IMPORTANT: notify navbar instantly
      window.dispatchEvent(new Event("auth-change"));

      alert(isLogin ? "Login successful" : "Signup successful");

      // redirect to browse
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Server not running or connection refused");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* TITLE */}
        <h2 className="auth-title">
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>

        {/* TABS */}
        <div className="auth-tabs">
          <button
            className={isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>

          <button
            className={!isLogin ? "active-tab" : ""}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {/* SWITCH */}
        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;