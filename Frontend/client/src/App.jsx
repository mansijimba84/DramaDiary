import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import MyListPage from "./pages/MyListPage";
import Stats from "./pages/Stats";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/my-list" element={<MyListPage />} />
         <Route path="/stats" element={<Stats />} /> 
      </Routes>
    </>
  );
}

export default App;