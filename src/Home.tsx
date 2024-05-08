import styles from "./css/App.module.css";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import "./firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { CSSProperties, useState } from "react";
import { ClockLoader } from "react-spinners";

const Home = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const [theRoomId, setTheRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateToGamePage = (
    opponentType: string,
    player?: number,
    roomId?: string
  ) => {
    let url = `/rock_paper/game/${opponentType}`;

    if (player !== undefined && roomId !== undefined) {
      // 如果有 player 和 roomId，加到 URL
      url += `/${player}/${roomId}`;
    }
    navigate(url);
  };

  const navigateToGamePageWithID = async () => {
    // 比對Room ID是否存在
    try {
      const roomRef = doc(db, "gameRooms", theRoomId);
      const roomSnapshot = await getDoc(roomRef);

      if (roomSnapshot.exists()) {
        // 存在，導頁 + 將遊戲人數改為2

        const roomData = roomSnapshot.data();

        const updatedPlayersChoice = {
          ...roomData.playersChoice,
          player2: null,
        };

        await updateDoc(roomRef, {
          players: 2,
          playersChoice: updatedPlayersChoice,
        });


        navigateToGamePage("friend", 2, theRoomId);
      } else {
        alert("Room ID not found. Please enter a valid Room ID.");
        setTheRoomId("");
      }
    } catch (error) {
      console.error("Error checking Room ID:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // 創建遊戲房間並回傳房間ID
  const createGameRoom = async (): Promise<string> => {
    try {
      const gameRoomsCollection = collection(db, "gameRooms");
      const newGameRoomRef = await addDoc(gameRoomsCollection, {
        /* 資料內容 */
      });

      const roomId = newGameRoomRef.id;

      await setDoc(doc(db, "gameRooms", roomId), {
        players: 1,
        playersChoice: {
          player1: null,
        },
        playersScore: {
          player1: 0,
          player2: 0,
        },
      });

      return roomId;
    } catch (error) {
      console.error("Error creating game room:", error);
      return "";
    }
  };
  // 等待player2一起進入頁面
  const checkGameRoomPlayers = (roomId: string) => {
    if (!roomId) {
      return;
    }
    setLoading(true);

    const gameRoomRef = doc(db, "gameRooms", roomId);

    const unsubscribe = onSnapshot(gameRoomRef, (snapshot) => {
      const data = snapshot.data();

      // 玩家人數為2時，停止 loading
      if (data && data.players === 2) {
        setLoading(false);
        navigateToGamePage("friend", 1, roomId);
      }
    });

    return () => unsubscribe();
  };

  const playWithComputer = () => navigateToGamePage("computer");
  const playWithFriend = async () => {
    try {
      const createdRoomId = await createGameRoom(); // 等待創建房間，並取得room ID

      alert(`Send Room ID to invite your friend : ${createdRoomId}`);
      // 獲得 ID 後，再頁面跳轉
      if (createdRoomId) {
        checkGameRoomPlayers(createdRoomId);
      } else {
        console.error("Room ID not available");
      }
    } catch (error) {
      console.error("Error during playWithFriend:", error);
    }
  };
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <div className={styles.homepageCtn}>
      <div className={styles.homePage}>
        <h1> Rock, Paper, Scissors</h1>

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
            <Button onClick={playWithFriend}>Play with Friend</Button>
            <Button onClick={playWithComputer}>Play with Computer</Button>
            <div>
              <p> if you want to join the game with friend ....</p>
              <div className="">
                <input
                  type="text"
                  value={theRoomId}
                  onChange={(e) => setTheRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                />
                <button
                  onClick={navigateToGamePageWithID}
                  disabled={theRoomId.trim() === ""}
                >
                  Join The Game
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
