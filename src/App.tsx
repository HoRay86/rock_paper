import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Home";
import GamePage from "./GamePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/rock_paper/" element={<Home />} />
        <Route path="/rock_paper/game/:playerType" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
