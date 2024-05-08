import styles from "./css/App.module.css";
import Button from "./components/Button";
import ScoreCard from "./components/ScoreCard";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./firebase/firebaseConfig";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import {
  FaRegHandPaper,
  FaRegHandRock,
  FaRegHandScissors,
} from "react-icons/fa";

interface paramsProps {
  roomId: string;
  player: string;
}

interface GameRoomData {
  players: number;
  playersChoice: { player1: string; player2: string };
  playersScore: { player1: number; player2: number };
}

const PlayGamePage = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const { roomId, player } = useParams<paramsProps>(); 

  const myRolePlayer = `player${player}`
  const myOpponentPlayer =player === "1" ? "player2" : "player1"

  const [myChoice, setMyChoice] = useState<string | null>(null);
  const [myOpponentChoice, setMyOpponentChoice] = useState<string | null>(null);

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(3);
  const [runTimer, setRunTimer] = useState(false);
  const [results, setResults] = useState({
    winner: "",
    message: "",
  });

  const [score, setScore] = useState({
    player: 0,
    opponent: 0,
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
    resetSelection();
  }, []);

  useEffect(() => {
    if (roomId === undefined) {
      return;
    }

    const gameRoomRef = doc(db, "gameRooms", roomId);

    const unsubscribe = onSnapshot(gameRoomRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("data,", docSnapshot.data());
        const { playersChoice } =
          docSnapshot.data() as GameRoomData;

        setMyChoice(
          myRolePlayer === "player1"
            ? playersChoice.player1
            : playersChoice.player2
        );
        setMyOpponentChoice(
          myOpponentPlayer === "player1"
            ? playersChoice.player1
            : playersChoice.player2
        );

        setResults({ winner: "", message: "" });
        setDisabled(false);
      } else {
        console.log("Game room does not exist");
        // 处理游戏房间不存在的情况
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  //點選選項後存firebase
  const selectionOption = async (selectedOption: string) => {
    setResults({ winner: "", message: "" });
    // setMyRole({ ...myRole, choice: selectedOption });
    setMyChoice(selectedOption);

    if (!roomId) return; // 如果沒有 roomId，不執行更新操作

    const gameRoomRef = doc(db, "gameRooms", roomId);
    const playerKey = myRolePlayer === "player1" ? "player1" : "player2";
    // const opponentKey = myOpponent.player === "player1" ? "player1" : "player2";
    const roomSnapshot = await getDoc(gameRoomRef);
    if (roomSnapshot.exists()) {
      const roomData = roomSnapshot.data();

      const updatedPlayersChoice = {
        ...roomData.playersChoice,
        [playerKey]: selectedOption,
      };

      await updateDoc(gameRoomRef, {
        players: 2,
        playersChoice: updatedPlayersChoice,
      });

      setLoading(true);
      setDisabled(true);
      checkOpponentChoice();
    }
  };

  //確認opponent是否已選擇
  const checkOpponentChoice = () => {
    if (!roomId) {
      return;
    }

    const gameRoomRef = doc(db, "gameRooms", roomId);
    const opponentKey = myOpponentPlayer === "player1" ? "player1" : "player2";
    const playerKey = myRolePlayer === "player1" ? "player1" : "player2";

    const unsubscribe = onSnapshot(gameRoomRef, (snapshot) => {
      const data = snapshot.data();
      if (!data) {
        return;
      }
      console.log(
        "opponentChoice - after selected",
        data.playersChoice[opponentKey]
      );
      console.log("myChoice - after selected", data.playersChoice[playerKey]);
      if (data.playersChoice[opponentKey] !== null) {
        
        // 如果opponent.choice有東西可以直接做比對
        setMyOpponentChoice(data.playersChoice[opponentKey]);
  
        setLoading(false);
        if (data.playersChoice[playerKey] !== null) {
          console.log("start from check");
          start();
        }
      }
    });

    return () => unsubscribe();
  };

  //清除firebase中的選擇，開新一局
  const resetSelection = async () => {
    if (!roomId) return; // 如果沒有 roomId，不執行更新操作

    setResults({ winner: "", message: "" });
    setDisabled(false);

    const gameRoomRef = doc(db, "gameRooms", roomId);
    const roomSnapshot = await getDoc(gameRoomRef);
    if (roomSnapshot.exists()) {
      await updateDoc(gameRoomRef, {
        playersChoice: {
          player1: null,
          player2: null,
        },
      });

      setMyChoice(null);
      setMyOpponentChoice(null);
    }

    console.log("disable", disabled);
  };

  const navigateToHome = () => {
    navigate("/");
  };

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


  const start = () => {
    setResults({ winner: "", message: "" });
    console.log("start function");
    console.log("myChoice", myChoice);
    console.log("run timer function");

    setRunTimer(true);
  };
  const play = () => {
    if (myChoice === myOpponentChoice) {
      setResults({ winner: "No one", message: " we have a draw" });
    } else if (myChoice === "rock" && myOpponentChoice === "paper") {
      setResults({ winner: "Opponent", message: " You lose" });
      setScore({ ...score, opponent: score.opponent + 1 });
    } else if (myChoice === "rock" && myOpponentChoice === "scissors") {
      setResults({ winner: "You", message: " You win !!!" });
      setScore({ ...score, player: score.player + 1 });
    } else if (myChoice === "paper" && myOpponentChoice === "rock") {
      setResults({ winner: "You", message: " You win" });
      setScore({ ...score, player: score.player + 1 });
    } else if (myChoice === "paper" && myOpponentChoice === "scissors") {
      setResults({ winner: "Opponent", message: " You lose" });
      setScore({ ...score, opponent: score.opponent + 1 });
    } else if (myChoice === "scissors" && myOpponentChoice === "paper") {
      setResults({ winner: "You", message: " You win" });
      setScore({ ...score, player: score.player + 1 });
    } else if (myChoice === "scissors" && myOpponentChoice === "rock") {
      setResults({ winner: "Opponent", message: " You lose" });
      setScore({ ...score, opponent: score.opponent + 1 });
    }
    console.log("opponent---", score.opponent);
    console.log("player---", score.player);
  };

  return (
    <div className="App">
      <h1>12</h1>
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
          <ScoreCard playerRole="YOU"  />
          <ScoreCard playerRole="OPPONENT" />
        </div>
        <div className={styles.results}>
          <div className={styles.playerHand}>
            {runTimer && (
              <div className={styles.playerShake}>{options[0].icon}</div>
            )}
            {myChoice  && !runTimer  &&  (<p>{myChoice}</p>)}
          </div>

          <div className={styles.mid}>
            {runTimer && <p className={styles.timer}> {timer}</p>}
            {results?.winner && (
              <>
                <p>
                  <b> WINNER :</b> {results.winner}
                </p>
                <p> {results.message}</p>
              </>
            )}
          </div>
          <div className={styles.computerHand}>
            {myChoice !== null && myOpponentChoice === null && (
              <>
                <ClipLoader color={"#111"} loading={loading} size={30} />
              </>
            )}
            {runTimer && (
              <div className={styles.opponentShake}>{options[0].icon}</div>
            )}
            {results?.winner && (
              <>
                <p> {myOpponentChoice}</p>
              </>
            )}
          </div>
        </div>
        {!disabled && myChoice === null && (
          <>
            <div className={styles.choiceBtnCtn}>
              <button
                className={`${styles.choiceBtn} ${styles.bounce} ${
                  myChoice === "rock" ? styles.activeChoice : ""
                }`}
                onClick={() => selectionOption("rock")}
              >
                <FaRegHandRock size={30} />
                Rock
              </button>
              <button
                className={`${styles.choiceBtn} ${styles.bounce} ${
                  myChoice === "paper" ? styles.activeChoice : ""
                }`}
                onClick={() => selectionOption("paper")}
              >
                <FaRegHandPaper size={30} />
                Paper
              </button>
              <button
                className={`${styles.choiceBtn} ${styles.bounce} ${
                  myChoice === "scissors" ? styles.activeChoice : ""
                }`}
                onClick={() => selectionOption("scissors")}
              >
                <FaRegHandScissors size={30} />
                Scissors
              </button>
            </div>
          </>
        )}
        {results?.winner && (
          <>
            <button className={styles.playBtn} onClick={resetSelection}>
              Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayGamePage;
