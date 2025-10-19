import { useTasks } from "../../context/TaskContext";
import { TaskItem } from "../TaskItem/TaskItem";
import styles from "./TaskList.module.css";

type Task = ReturnType<typeof useTasks>["tasks"][number];

type TaskListProps = {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleCompletion?: (taskId: string) => void;
  highlightedIndex?: number;
};

export const TaskList = ({
  tasks,
  onTaskClick,
  onToggleCompletion,
  highlightedIndex,
}: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <p>All tasks completed!</p>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {tasks.map((task, index) => (
        <TaskItem
          key={task._id}
          task={task}
          onClick={() => onTaskClick(task._id)}
          onToggleCompletion={() => onToggleCompletion?.(task._id)} // safe wrapper
          highlighted={index === highlightedIndex}
        />
      ))}
    </div>
  );
};
