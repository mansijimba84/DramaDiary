import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import MyListPage from "./pages/MyListPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/my-list" element={<MyListPage />} />
      </Routes>
    </>
  );
}

export default App;