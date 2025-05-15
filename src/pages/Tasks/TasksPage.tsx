import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import { CategorySelector } from "../../components/CategorySelector/CategorySelector";
// import { Icon } from "../../components/Icon/Icon";
import styles from "./TasksPage.module.css";

type TaskTab = "all" | "active" | "completed" | "deleted";

export const TasksPage = () => {
  const { tasks, categories } = useTasks();
  const [selectedTab, setSelectedTab] = useState<TaskTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    // Filter by category
    if (selectedCategory !== "all" && task.category !== selectedCategory) {
      return false;
    }

    // Filter by tab
    switch (selectedTab) {
      case "active":
        return !task.completed;
      case "completed":
        return task.completed;
      case "deleted":
        return false; // In a real app, you might have a deleted flag
      default:
        return true;
    }
  });

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setIsBottomSheetOpen(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Tasks</h1>
        <CategorySelector
          categories={["all", ...categories]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            selectedTab === "all" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("all")}
        >
          All
        </button>
        <button
          className={`${styles.tab} ${
            selectedTab === "active" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("active")}
        >
          Active
        </button>
        <button
          className={`${styles.tab} ${
            selectedTab === "completed" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("completed")}
        >
          Completed
        </button>
      </div>

      <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} />

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
