import { useTasks } from "../../context/TaskContext";
import { Icon } from "../Icon/Icon";
import styles from "./TaskItem.module.css";

type Task = ReturnType<typeof useTasks>["tasks"][number];

type TaskItemProps = {
  task: Task;
  onClick: () => void;
  onToggleCompletion?: () => void;
};

export const TaskItem = ({
  task,
  onClick,
  onToggleCompletion,
}: TaskItemProps) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion?.();
  };

  return (
    <li className={styles.taskItem} onClick={onClick}>
      <button
        className={`${styles.checkbox} ${
          task.completed ? styles.completed : ""
        }`}
        onClick={handleToggle}
      >
        {task.completed && (
          <Icon variant="check" size={16} color="var(--primary-color)" />
        )}
      </button>
      <div className={styles.taskContent}>
        <h3
          className={`${styles.taskTitle} ${
            task.completed ? styles.completedTitle : ""
          }`}
        >
          {task.title}
        </h3>
        <div className={styles.taskMeta}>
          {task.dueDate && (
            <span className={styles.taskDate}>
              <Icon variant="calendar" size={14} />
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {task.category && (
            <span className={styles.taskCategory}>
              <Icon variant="tag" size={14} />
              {task.category}
            </span>
          )}
        </div>
      </div>
      {task.priority === "high" && (
        <span className={styles.priorityIndicator}>
          <Icon variant="flag" size={16} color="#ff4d4f" />
        </span>
      )}
    </li>
  );
};
