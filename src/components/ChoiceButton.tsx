import styles from "../css/Component.module.css";
import IconWithName from "./IconWithName";

interface ButtonProps {
  name: string;
  icon: JSX.Element;
  onClick: (name: string) => void;
  iconSize: number;
  isActive?: boolean;
}
const ChoiceButton = ({
  name,
  icon,
  iconSize = 30,
  onClick,
  isActive,
}: ButtonProps) => {
  return (
    <button
      className={`${styles.choiceBtn} ${styles.bounce} ${
        isActive ? styles.activeChoice : ""
      }`}
      onClick={() => onClick(name)}
    >
      <IconWithName icon={icon} iconSize={iconSize} name={name} />
    </button>
  );
};

export default ChoiceButton;
