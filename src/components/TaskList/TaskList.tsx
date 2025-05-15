import { useTasks } from "../../context/TaskContext";
import { TaskItem } from "../TaskItem/TaskItem";
import styles from "./TaskList.module.css";

type Task = ReturnType<typeof useTasks>["tasks"][number];

type TaskListProps = {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onToggleCompletion?: (taskId: string) => void;
};

export const TaskList = ({
  tasks,
  onTaskClick,
  onToggleCompletion,
}: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No tasks found</p>
      </div>
    );
  }

  return (
    <ul className={styles.taskList}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task.id)}
          onToggleCompletion={
            onToggleCompletion ? () => onToggleCompletion(task.id) : undefined
          }
        />
      ))}
    </ul>
  );
};
