import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Home";
import GamePage from "./GamePage";
// import GamePage2 from "./GamePage2";
import PlayGamePage from "./PlayGamePage";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/rock_paper/" element={<Home />} />
          <Route path="/rock_paper/game/:opponentType/:player/:roomId" element={<PlayGamePage />} />
          <Route path="/rock_paper/game/:opponentType" element={<GamePage />} />
        </Routes>
    </Router>
  );
}

export default App;
