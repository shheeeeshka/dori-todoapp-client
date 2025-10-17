// TaskItem.tsx
import { useTasks } from "../../context/TaskContext";
import { FaCheck, FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";
import styles from "./TaskItem.module.css";

type Task = ReturnType<typeof useTasks>["tasks"][number];

type TaskItemProps = {
  task: Task;
  onClick: () => void;
  onToggleCompletion: () => void;
  highlighted?: boolean;
};

export const TaskItem = ({
  task,
  onClick,
  onToggleCompletion,
  highlighted = false,
}: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const priorityColors = {
    high: "#ff4757",
    medium: "#ffa502",
    low: "#2ed573",
  };

  return (
    <div
      className={`${styles.taskCard} ${highlighted ? styles.highlighted : ""}`}
      onClick={onClick}
    >
      <div className={styles.taskHeader}>
        <div className={styles.taskMain}>
          <button
            className={`${styles.checkbox} ${
              task.completed ? styles.completed : ""
            }`}
            onClick={handleToggle}
          >
            {task.completed && (
              <FaCheck size={18} className={styles.checkIcon} />
            )}
          </button>

          <div className={styles.taskInfo}>
            <h3
              className={`${styles.taskTitle} ${
                task.completed ? styles.completedTitle : ""
              }`}
            >
              {task.title}
            </h3>

            <div className={styles.taskMeta}>
              <span className={styles.taskCategory}>{task.category}</span>
              <span
                className={styles.taskPriority}
                style={{ color: priorityColors[task.priority] }}
              >
                {task.priority}
              </span>
              {task.dueTime && (
                <span className={styles.taskTime}>
                  <FaClock size={10} />
                  {formatTime(task.dueTime)}
                </span>
              )}
            </div>
          </div>
        </div>

        <button className={styles.expandButton} onClick={handleClick}>
          {isExpanded ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && task.description && (
        <div className={styles.taskDetails}>
          <p className={styles.taskDescription}>{task.description}</p>
        </div>
      )}
    </div>
  );
};
