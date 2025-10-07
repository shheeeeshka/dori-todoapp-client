import { useState, useRef } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import { CategoryTabs } from "../../components/CategoryTabs/CategoryTabs";
import { AddTaskForm } from "../../components/AddTaskForm/AddTaskForm";
import { AddCategoryForm } from "../../components/AddCategoryForm/AddCategoryForm";
import { FaPlus, FaFilter, FaSearch } from "react-icons/fa";
import styles from "./TasksPage.module.css";

type TaskTab = "All" | "active" | "completed";

export const TasksPage = () => {
  const { tasks, categories, addCategory } = useTasks();
  const [selectedTab, setSelectedTab] = useState<TaskTab>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const tabsRef = useRef<HTMLDivElement>(null);

  const filteredTasks = tasks.filter((task) => {
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (selectedCategory !== "All" && task.category !== selectedCategory) {
      return false;
    }

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

  const handleTaskSheetClose = () => {
    setIsTaskSheetOpen(false);
    setSelectedTask(null);
  };

  const handleAddCategory = (categoryName: string) => {
    addCategory(categoryName);
    setIsCategorySheetOpen(false);
    setTimeout(() => {
      if (tabsRef.current) {
        tabsRef.current.scrollTo({
          left: tabsRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleCategorySheetClose = () => {
    setIsCategorySheetOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Tasks</h1>
          <div className={styles.headerActions}>
            <button className={styles.headerButton}>
              <FaFilter size={18} />
            </button>
            <button
              className={styles.addButton}
              onClick={() => setIsTaskSheetOpen(true)}
            >
              <FaPlus size={18} />
            </button>
          </div>
        </div>

        <div className={styles.searchBar}>
          <FaSearch size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tabsContainer} ref={tabsRef}>
        <CategoryTabs
          categories={["All", ...categories]}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={() => setIsCategorySheetOpen(true)}
        />
      </div>

      <div className={styles.statusTabs}>
        <button
          className={`${styles.statusTab} ${
            selectedTab === "All" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("All")}
        >
          All Tasks
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

      <div className={styles.taskCounter}>
        <span>{filteredTasks.length} tasks</span>
        {selectedCategory !== "All" && (
          <span className={styles.categoryTag}>{selectedCategory}</span>
        )}
      </div>

      <TaskList
        tasks={filteredTasks}
        onTaskClick={handleTaskClick}
        onToggleCompletion={() => {}}
      />

      {filteredTasks.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FaSearch size={48} />
          </div>
          <h3>No tasks found</h3>
          <p>Try changing your search or filters</p>
          <button
            className={styles.emptyAction}
            onClick={() => setIsTaskSheetOpen(true)}
          >
            Create Task
          </button>
        </div>
      )}

      {isTaskSheetOpen && (
        <BottomSheet
          onClose={handleTaskSheetClose}
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
                selectedCategory !== "All" ? selectedCategory : undefined
              }
              onSubmit={() => setIsTaskSheetOpen(false)}
            />
          )}
        </BottomSheet>
      )}

      {isCategorySheetOpen && (
        <BottomSheet
          onClose={handleCategorySheetClose}
          showCloseButton
          title="New Category"
        >
          <AddCategoryForm
            onSubmit={handleAddCategory}
            onCancel={handleCategorySheetClose}
          />
        </BottomSheet>
      )}
    </div>
  );
};
