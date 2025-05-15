import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const { tasks, toggleTaskCompletion } = useTasks();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((task) => task.dueDate === today);
  const upcomingTasks = tasks.filter(
    (task) => task.dueDate > today && !task.completed
  );

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setIsBottomSheetOpen(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Today</h1>
      <TaskList
        tasks={todayTasks}
        onTaskClick={handleTaskClick}
        onToggleCompletion={toggleTaskCompletion}
      />

      <h1 className={styles.title}>Upcoming</h1>
      <TaskList
        tasks={upcomingTasks}
        onTaskClick={handleTaskClick}
        onToggleCompletion={toggleTaskCompletion}
      />

      {isBottomSheetOpen && selectedTask && (
        <BottomSheet
          onClose={() => setIsBottomSheetOpen(false)}
          showCloseButton
          title="Task Details"
        >
          <TaskDetail
            taskId={selectedTask}
            onClose={() => setIsBottomSheetOpen(false)}
          />
        </BottomSheet>
      )}
    </div>
  );
};
