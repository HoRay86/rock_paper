import styles from "../css/Component.module.css";

interface ScoreCardProps {
  playerRole: string;
  score?: number;
  playerChoice?: { icon: JSX.Element; name: string };
}

const ScoreCard = ({ playerRole, score, playerChoice }: ScoreCardProps) => {
  return (
    <div className={`card border-dark mb-3 score-card ${styles.score}`}>
      <div className="card-header text-bg-dark">{playerRole}
      </div>
      <div className="card-body">

        { score && ( <h5 className="card-title">Score : {score}</h5>)}
     
      </div>
      {/* <div className="card-body">
        <p className="card-text">
            {playerChoice?.icon}
        </p>
        <p className="card-text">
            {playerChoice?.name}
        </p>
      </div> */}
    </div>
  );
};

export default ScoreCard;
