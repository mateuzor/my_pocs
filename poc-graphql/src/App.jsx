import { Routes, Route } from "react-router-dom";
import "./App.css";
import Character from "./pages/Character";
import CharactersList from "./pages/CharactersList";
import Search from "./pages/Search";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CharactersList />} />
      <Route path="/search" element={<Search />} />
      <Route path="/:id" element={<Character />} />
    </Routes>
  );
}

export default App;
