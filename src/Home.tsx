import styles from "./css/App.module.css";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import "./firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
const Home = () => {
  const navigate = useNavigate();
  const db = getFirestore();

  const navigateToGamePage = (opponentType: string, roomId?: string) => {
    if (roomId) {
      navigate(`/game/${opponentType}?roomId=${roomId}`);
    } else {
      navigate(`/game/${opponentType}`);
    }
  };

  // ------------------- test --------------------
  const navigateToGamePage2 = (roomId: string) => {
    navigate(`/game/${roomId}`); //
  };
  // --------------------------------------------

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
        player1Choice: null,
      });
      return roomId;
    } catch (error) {
      console.error("Error creating game room:", error);
      return "";
    }
  };
  const playWithComputer = () => navigateToGamePage("computer");
  const playWithFriend = async () => {
    try {
      const createdRoomId = await createGameRoom(); // 等待創建房間，並取得room ID

      alert(`Invite Friend, Room ID : ${createdRoomId}`);
      // 獲得 ID 後，再頁面跳轉
      if (createdRoomId) {
        // navigateToGamePage("friend", createdRoomId);
        navigateToGamePage(`${createdRoomId}`);
      } else {
        console.error("Room ID not available");
      }
    } catch (error) {
      console.error("Error during playWithFriend:", error);
    }
  };

  return (
    <div className={styles.homepageCtn}>
      <div className={styles.homePage}>
        <h1> Rock, Paper, Scissors</h1>

        <Button onClick={playWithFriend}>Play with Friend</Button>
        <Button onClick={playWithComputer}>Play with Computer</Button>
      </div>
    </div>
  );
};

export default Home;
