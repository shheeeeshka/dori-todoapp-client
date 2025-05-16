import { useState, useRef } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import { CategoryTabs } from "../../components/CategoryTabs/CategoryTabs";
import { AddTaskForm } from "../../components/AddTaskForm/AddTaskForm";
import { AddCategoryForm } from "../../components/AddCategoryForm/AddCategoryForm";
import { Icon } from "../../components/Icon/Icon";
import styles from "./TasksPage.module.css";

type TaskTab = "all" | "active" | "completed";

export const TasksPage = () => {
  const { tasks, categories, addCategory } = useTasks();
  const [selectedTab, setSelectedTab] = useState<TaskTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

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
      default:
        return true;
    }
  });

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setIsTaskSheetOpen(true);
  };

  const handleAddCategory = (categoryName: string) => {
    addCategory(categoryName);
    setIsCategorySheetOpen(false);
    // Прокручиваем к последней вкладке после добавления
    setTimeout(() => {
      if (tabsRef.current) {
        tabsRef.current.scrollTo({
          left: tabsRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tasks</h1>
      </div>

      <div className={styles.tabsContainer} ref={tabsRef}>
        <CategoryTabs
          categories={["all", ...categories]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={() => setIsCategorySheetOpen(true)}
        />
      </div>

      <div className={styles.statusTabs}>
        <button
          className={`${styles.statusTab} ${
            selectedTab === "all" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("all")}
        >
          All
        </button>
        <button
          className={`${styles.statusTab} ${
            selectedTab === "active" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("active")}
        >
          Active
        </button>
        <button
          className={`${styles.statusTab} ${
            selectedTab === "completed" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("completed")}
        >
          Completed
        </button>
      </div>

      <TaskList
        tasks={filteredTasks}
        onTaskClick={handleTaskClick}
        onToggleCompletion={() => {
          // Здесь будет логика переключения статуса задачи
        }}
      />

      <button
        className={styles.addButton}
        onClick={() => setIsTaskSheetOpen(true)}
      >
        <Icon variant="plus" size={28} color="white" />
      </button>

      {/* BottomSheet для деталей задачи */}
      {isTaskSheetOpen && (
        <BottomSheet
          onClose={() => setIsTaskSheetOpen(false)}
          showCloseButton
          title={selectedTask ? "Task Details" : "New Task"}
        >
          {selectedTask ? (
            <TaskDetail
              taskId={selectedTask}
              onClose={() => setIsTaskSheetOpen(false)}
            />
          ) : (
            <AddTaskForm
              defaultCategory={
                selectedCategory !== "all" ? selectedCategory : undefined
              }
              onSubmit={() => setIsTaskSheetOpen(false)}
            />
          )}
        </BottomSheet>
      )}

      {/* BottomSheet для добавления категории */}
      {isCategorySheetOpen && (
        <BottomSheet
          onClose={() => setIsCategorySheetOpen(false)}
          showCloseButton
          title="New Category"
        >
          <AddCategoryForm onSubmit={handleAddCategory} />
        </BottomSheet>
      )}
    </div>
  );
};
