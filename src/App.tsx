import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Home";
import GamePage from "./GamePage";
import GamePage2 from "./GamePage2";

function App() {
  return (

    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:roomId" element={<GamePage2 />} />
          {/* <Route path="/game/computer" element={<GamePage />} /> */}
          <Route path="/game/:opponentType" element={<GamePage />} />
        </Routes>
    </Router>
  );
}

export default App;
