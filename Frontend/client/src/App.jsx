import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import BrowsePage from "./pages/BrowsePage";
import MyListPage from "./pages/MyListPage";
import Stats from "./pages/Stats";
import Auth from "./pages/AuthPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />

      <Routes>
        {/* AUTH PAGE (public) */}
        <Route path="/auth" element={<Auth />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BrowsePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-list"
          element={
            <ProtectedRoute>
              <MyListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            token ? (
              <BrowsePage />
            ) : (
              <Auth />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;