import { useState, useRef } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import { CategoryTabs } from "../../components/CategoryTabs/CategoryTabs";
import { AddTaskForm } from "../../components/AddTaskForm/AddTaskForm";
import { AddCategoryForm } from "../../components/AddCategoryForm/AddCategoryForm";
import {
  FaPlus,
  FaSearch,
  FaBell,
  FaCalendarAlt,
  FaChartLine,
  FaStar,
} from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";
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

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high" && !task.completed
  ).length;

  const timelineTasks = tasks
    .filter((task) => task.dueTime && !task.completed)
    .sort((a, b) => (a.dueTime || "").localeCompare(b.dueTime || ""))
    .slice(0, 5);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarInitial}>D</div>
          </div>
          <div>
            <p className={styles.greeting}>Your Tasks</p>
            <h2 className={styles.userName}>David</h2>
          </div>
        </div>
        <button className={styles.notificationButton}>
          <FaBell className={styles.bellIcon} />
          <span className={styles.notificationDot} />
        </button>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <FaSearch className={styles.searchIcon} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your tasks..."
            className={styles.searchField}
          />
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MdTaskAlt className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{totalTasks}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaChartLine className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{completionRate}%</span>
            <span className={styles.statLabel}>Done</span>
          </div>
        </div>

        <div className={styles.statCardLarge}>
          <div className={styles.statIconLarge}>
            <FaStar className={styles.statIconSvgLarge} />
          </div>
          <div className={styles.statContentLarge}>
            <span className={styles.statNumberLarge}>{highPriorityTasks}</span>
            <span className={styles.statLabelLarge}>Priority</span>
          </div>
        </div>
      </div>

      <div className={styles.timelineSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Today's Timeline</h3>
          <button className={styles.seeMore}>View All</button>
        </div>
        <div className={styles.timeline}>
          {timelineTasks.length > 0 ? (
            timelineTasks.map((task, _) => (
              <div key={task._id} className={styles.timelineItem}>
                <div className={styles.timelineTime}>{task.dueTime}</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>{task.title}</div>
                  <div className={styles.timelineCategory}>{task.category}</div>
                </div>
                <div className={styles.timelineDot} />
              </div>
            ))
          ) : (
            <div className={styles.timelineEmpty}>
              <FaCalendarAlt className={styles.timelineEmptyIcon} />
              <p>No scheduled tasks for today</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabsHeader}>
        <h3 className={styles.sectionTitle}>My Tasks</h3>
        <div className={styles.taskActions}>
          <button
            className={styles.addTaskButton}
            onClick={() => setIsTaskSheetOpen(true)}
          >
            <FaPlus className={styles.addIcon} />
            New Task
          </button>
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

      <div className={styles.taskCounter}>
        <span className={styles.taskCount}>{filteredTasks.length} tasks</span>
        {selectedCategory !== "All" && (
          <span className={styles.categoryTag}>{selectedCategory}</span>
        )}
      </div>

      <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} />

      {filteredTasks.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FaSearch size={32} />
          </div>
          <h3>No tasks found</h3>
          <p>Try changing your search or create a new task</p>
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
          showCloseButton={false}
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
          showCloseButton={false}
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
