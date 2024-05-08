import { CSSProperties, useEffect, useState } from "react";
import { ClipLoader, ClockLoader } from "react-spinners";
import "./firebase/firebaseConfig";
import {
  getFirestore,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import styles from "./css/App.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./components/Button";
import {
  FaRegHandPaper,
  FaRegHandRock,
  FaRegHandScissors,
} from "react-icons/fa";


const GamePage2 = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const { roomId } = useParams<string>();
  const [loading, setLoading] = useState(true);
  const [player1Choice, setPlayer1Choice] = useState<string | null>(null);
  const [player2Choice, setPlayer2Choice] = useState<string | null>(null);
  const [timer, setTimer] = useState(3);
  const [runTimer, setRunTimer] = useState(false);
  const [results, setResults] = useState({
    winner: "",
    message: "",
  });
  const [score, setScore] = useState({
    player: 0,
    computer: 0,
  });
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

  useEffect(() => {
    if (roomId === undefined) {
      return;
    }
    const gameRoomRef = doc(db, "gameRooms", roomId);

    const unsubscribe = onSnapshot(gameRoomRef, (snapshot) => {
      const data = snapshot.data();
      // 玩家人數為2，停止loading
      if (data && data.players === 2) {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // 取消監聽
  }, [roomId]);
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

  const selectionOption = async (roomId: string, handIndex: string) => {
    setResults({ winner: "", message: "" });
    setPlayer1Choice(handIndex);
    const gameRoomRef = doc(db, "gameRooms", roomId);
    await updateDoc(gameRoomRef, { player1Choice: handIndex });

    console.log("Player 1 choice saved:", handIndex);
  };

  const handlePlay = async (roomId: string) => {
    const gameRoomRef = doc(db, "gameRooms", roomId);

    const playUnsubscribe = onSnapshot(gameRoomRef, (snapshot) => {
      const data = snapshot.data();
      console.log('data', data)
      setRunTimer(true);
      if (data) {
        setPlayer1Choice(data.player1Choice);
        setPlayer2Choice(data.player2Choice);
      }

        playUnsubscribe();
    });
  };


  const start = () => {
    setResults({ winner: "", message: "" });
    if (roomId) {
      handlePlay(roomId);
    }
  };
  const play = () => {
    if (player1Choice === player2Choice) {
      setResults({ winner: "No one", message: " we have a draw" });
    } else if (
      player1Choice === "rock" &&
      player2Choice === "paper"
    ) {
      setResults({ winner: "Computer", message: " You lose" });
      setScore({ ...score, computer: score.computer + 1 });
    } else if (
      player1Choice === "rock" &&
      player2Choice === "scissors"
    ) {
      setResults({ winner: "You", message: " You win !!!" });
      setScore({ ...score, player: score.player + 1 });
    } else if (
      player1Choice === "paper" &&
      player2Choice === "rock"
    ) {
      setResults({ winner: "You", message: " You win" });
      setScore({ ...score, player: score.player + 1 });
    } else if (
      player1Choice === "paper" &&
      player2Choice === "scissors"
    ) {
      setResults({ winner: "Computer", message: " You lose" });
      setScore({ ...score, computer: score.computer + 1 });
    } else if (
      player1Choice === "scissors" &&
      player2Choice === "paper"
    ) {
      setResults({ winner: "You", message: " You win" });
      setScore({ ...score, player: score.player + 1 });
    } else if (
      player1Choice === "scissors" &&
      player2Choice === "rock"
    ) {
      setResults({ winner: "Computer", message: " You lose" });
      setScore({ ...score, computer: score.computer + 1 });
    }
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const selectedOption = options.find(option => option.name === player1Choice);
  const player2Option = options.find(option => option.name === player2Choice);

  return (
    <div className="App">
      <h3>Room ID : {roomId}</h3>

      <div className={styles.container}>
        <div className={styles.headerCtn}>
          <div className={styles.titleCtn}>
            <h1> ROCK, PAPER, SCISSORS </h1>
          </div>
          <div className={styles.playerInfo}>
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
            {results?.winner && selectedOption &&(
              <>
                {selectedOption.icon}
                <p>{player1Choice}</p>
              </>
            )}
          </div>

          <div className={styles.mid}>
            {runTimer && <p className={styles.timer}> {timer}</p>}
            {results?.winner && (
              <>
                <p>
                  {" "}
                  <b> WINNER :</b> {results.winner}
                </p>
                <p> {results.message}</p>
              </>
            )}
          </div>
          <div className={styles.computerHand}>
            {player1Choice && player2Choice === undefined && (
              <>
              <ClipLoader

                color={"#111"}
                loading={player2Choice === undefined }
                size={30}
              />
              </>
            )}
            {runTimer && (
              <div className={styles.computerShake}>{options[0].icon}</div>
            )}
            {results?.winner &&  player2Option &&(
              <>
                {player2Option.icon}
                <p>{player2Choice}</p>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <>
            <ClockLoader
              color={"#198754"}
              cssOverride={override}
              loading={loading}
              size={70}
            />
            <p> Waiting your opponent</p>
          </>
        ) : (
          <>
            <div className={styles.choiceBtnCtn}>
              <button
                className={`${styles.choiceBtn} ${styles.bounce} ${
                  player1Choice === 'rock' ? styles.activeChoice : ""
                }`}
                onClick={() => selectionOption(`${roomId}`, 'rock')}
              >
                <FaRegHandRock size={30} />
                Rock
              </button>
              <button
                className={`${styles.choiceBtn} ${styles.bounce} ${
                  player1Choice === 'paper' ? styles.activeChoice : ""
                }`}
                onClick={() => selectionOption(`${roomId}`, 'paper')}
              >
                <FaRegHandPaper size={30} />
                Paper
              </button>
              <button
                className={`${styles.choiceBtn} ${styles.bounce} ${
                  player1Choice === 'scissors' ? styles.activeChoice : ""
                }`}
                onClick={() => selectionOption(`${roomId}`, 'scissors')}
              >
                <FaRegHandScissors size={30} />
                Scissors
              </button>
            </div>

            <button className={styles.playBtn} onClick={start}>
              Play
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GamePage2;
