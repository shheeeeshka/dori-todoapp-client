import { Icon } from "../Icon/Icon";
import styles from "./PrioritySelector.module.css";

type PrioritySelectorProps = {
  selected: "low" | "medium" | "high";
  onChange: (priority: "low" | "medium" | "high") => void;
};

export const PrioritySelector = ({
  selected,
  onChange,
}: PrioritySelectorProps) => {
  return (
    <div className={styles.selector}>
      <button
        type="button"
        className={`${styles.priorityButton} ${
          selected === "low" ? styles.selected : ""
        }`}
        onClick={() => onChange("low")}
      >
        <Icon variant="flag" size={16} color="#32D74B" />
        <span>Low</span>
      </button>
      <button
        type="button"
        className={`${styles.priorityButton} ${
          selected === "medium" ? styles.selected : ""
        }`}
        onClick={() => onChange("medium")}
      >
        <Icon variant="flag" size={16} color="#FF9F0A" />
        <span>Medium</span>
      </button>
      <button
        type="button"
        className={`${styles.priorityButton} ${
          selected === "high" ? styles.selected : ""
        }`}
        onClick={() => onChange("high")}
      >
        <Icon variant="flag" size={16} color="#FF453A" />
        <span>High</span>
      </button>
    </div>
  );
};
