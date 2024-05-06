import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  FaRegHandPaper,
  FaRegHandRock,
  FaRegHandScissors,
} from "react-icons/fa";
import Button from "./components/Button";
import styles from "./css/App.module.css";
import { useEffect, useState } from "react";

const GamePage = () => {
  const navigate = useNavigate();
  const { playerType } = useParams();
  const navigateToHome = () => {
    navigate("/");
  };
  const [playerHand, setPlayerHand] = useState(0);
  const [computerHand, setComputerrHand] = useState(0);
  const [timer, setTimer] = useState(3);
  const [runTimer, setRunTimer] = useState(false);
  const [results, setResults] = useState({
    winner: "",
    message: "",
  });
const [score, setScore] = useState({
    player:0,
    computer:0
})


  useEffect(() => {
    if (runTimer && timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (runTimer && timer < 1) {
      setRunTimer(false);
      setTimer(3);
      play();
    }
  }, [timer, runTimer]);

  const options = [
    {
      name: "rock",
      icon: <FaRegHandRock size={70} />,
    },
    {
      name: "paper",
      icon: <FaRegHandPaper size={70} />,
    },
    {
      name: "scissors",
      icon: <FaRegHandScissors size={70} />,
    },
  ];

  const selectionOption = (handIndex: number) => {
    setResults({winner: "", message: ""})
    setPlayerHand(handIndex);
  };
  const generateComputerHand = () => {
    const randomNumber = Math.floor(Math.random() * 3);
    setComputerrHand(randomNumber);
  };

  const start = () => {
    setResults({winner: "", message: ""})
    setRunTimer(true);
    generateComputerHand();
  };
  const play = () => {
    if (options[playerHand].name === options[computerHand].name) {
      setResults({ winner: "No one", message: " we have a draw" });
    } else if (
      options[playerHand].name === "rock" &&
      options[computerHand].name === "paper"
    ) {
      setResults({ winner: "Computer", message: " You lose" });
      setScore({...score, computer: score.computer+1})
    } else if (
      options[playerHand].name === "rock" &&
      options[computerHand].name === "scissors"
    ) {
      setResults({ winner: "You", message: " You win !!!" });
      setScore({...score, player: score.player+1})
    } else if (
      options[playerHand].name === "paper" &&
      options[computerHand].name === "rock"
    ) {
      setResults({ winner: "You", message: " You win" });
      setScore({...score, player: score.player+1})
    } else if (
      options[playerHand].name === "paper" &&
      options[computerHand].name === "scissors"
    ) {
      setResults({ winner: "Computer", message: " You lose" });
      setScore({...score, computer: score.computer+1})
    } else if (
      options[playerHand].name === "scissors" &&
      options[computerHand].name === "paper"
    ) {
      setResults({ winner: "You", message: " You win" });
      setScore({...score, player: score.player+1})
    } else if (
      options[playerHand].name === "scissors" &&
      options[computerHand].name === "rock"
    ) {
      setResults({ winner: "Computer", message: " You lose" });
      setScore({...score, computer: score.computer+1})
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCtn}>
        <div className={styles.titleCtn}>
          <h1> ROCK, PAPER, SCISSORS </h1>
          {/* <h3> Round 1</h3> */}
        </div>
        <div className={styles.playerInfo}>
          <p>Opponent Type: {playerType}</p>
          <Button onClick={navigateToHome}>Go Home</Button>
        </div>
      </div>
      <div className={styles.scoreCtn}>
        <div className={styles.score}>
          <h3> YOU </h3>
          <p> Score: {score.player}</p>
        </div>
        <div className={styles.score}>
          <h3> Computer </h3>
          <p> Score: {score.computer}</p>
        </div>
      </div>
      <div className={styles.results}>
        <div className={styles.playerHand}>
        {runTimer && (
            <div className={styles.playerShake}>{options[0].icon}</div>
          )}
          {results?.winner && (
            <>
              {options[playerHand].icon}
              <p>{options[playerHand].name}</p>
            </>
          )}
        </div>

        <div className={styles.mid}>
          {runTimer && <p className={styles.timer}> {timer}</p>}
          {results?.winner && (
            <>
              <p> <b> WINNER :</b>  {results.winner}</p>
              <p> {results.message}</p>
            </>
          )}
        </div>
        <div className={styles.computerHand}>
          {/* {results.winner ==='' && ( */}
          {runTimer && (
            <div className={styles.computerShake}>{options[0].icon}</div>
          )}
          {results?.winner && (
            <>
              {options[computerHand].icon}
              <p>{options[computerHand].name}</p>
            </>
          )}
        </div>
      </div>
      <div className={styles.choiceBtnCtn}>
        <button
          className={`${styles.choiceBtn} ${styles.bounce} ${
            playerHand === 0 ? styles.activeChoice : ""
          }`}
          onClick={() => selectionOption(0)}
        >
          {" "}
          <FaRegHandRock size={30} />
          Rock
        </button>
        <button
          className={`${styles.choiceBtn} ${styles.bounce} ${
            playerHand === 1 ? styles.activeChoice : ""
          }`}
          onClick={() => selectionOption(1)}
        >
          <FaRegHandPaper size={30} />
          Paper
        </button>
        <button
          className={`${styles.choiceBtn} ${styles.bounce} ${
            playerHand === 2 ? styles.activeChoice : ""
          }`}
          onClick={() => selectionOption(2)}
        >
          <FaRegHandScissors size={30} />
          Scissors
        </button>
      </div>
      <button className={styles.playBtn} onClick={start}>
        Play
      </button>
    </div>
  );
};

export default GamePage;
