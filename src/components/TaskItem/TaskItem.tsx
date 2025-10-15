import { useTasks } from "../../context/TaskContext";
import { FaCheck, FaClock, FaCircle } from "react-icons/fa";
import styles from "./TaskItem.module.css";

type Task = ReturnType<typeof useTasks>["tasks"][number];

type TaskItemProps = {
  task: Task;
  onClick: () => void;
  onToggleCompletion?: () => void;
  highlighted?: boolean;
};

export const TaskItem = ({
  task,
  onClick,
  onToggleCompletion,
  highlighted = false,
}: TaskItemProps) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion?.();
  };

  return (
    <div
      className={`${styles.taskItem} ${highlighted ? styles.highlighted : ""}`}
      onClick={onClick}
    >
      <button
        className={`${styles.checkbox} ${
          task.completed ? styles.completed : ""
        } ${highlighted ? styles.highlightedCheckbox : ""}`}
        onClick={handleToggle}
      >
        {task.completed && <FaCheck size={14} className={styles.checkIcon} />}
      </button>
      <div className={styles.taskContent}>
        <div className={styles.taskHeader}>
          <h3
            className={`${styles.taskTitle} ${
              task.completed ? styles.completedTitle : ""
            }`}
          >
            {task.title}
          </h3>
          {task.priority === "high" && !highlighted && (
            <span className={styles.priorityBadge}>High</span>
          )}
        </div>
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
        <div className={styles.taskMeta}>
          <span className={styles.taskCategory}>
            <FaCircle size={8} className={styles.categoryDot} />
            {task.category}
          </span>
          {task.dueTime && (
            <span className={styles.taskTime}>
              <FaClock size={12} />
              {formatTime(task.dueTime)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
