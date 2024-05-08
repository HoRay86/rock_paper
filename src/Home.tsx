import styles from "./css/App.module.css";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
const Home = () => {
  const navigate = useNavigate();

  const navigateToGamePage = (opponentType: string) => {
    navigate(`/rock_paper/game/${opponentType}`);
  };
  const playWithComputer = () => navigateToGamePage("computer");
  const playWithFriend = () => navigateToGamePage("friend");

  return (
    <div className={styles.homepageCtn}>
      <div className={styles.homePage}>
        <h1> Rock, Paper, Scissors</h1>

        <Button onClick={playWithComputer}>Play with Computer</Button>
        <Button disabled onClick={playWithFriend}>
          Play with Friend
        </Button>
      </div>
    </div>
  );
};

export default Home;
