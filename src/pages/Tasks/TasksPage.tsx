import { useState, useRef } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import { CategoryTabs } from "../../components/CategoryTabs/CategoryTabs";
// import { TaskForm } from "../../components/TaskForm/TaskForm";
import { AddCategoryForm } from "../../components/AddCategoryForm/AddCategoryForm";
import {
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaFilter,
  FaCheck,
  FaLock,
} from "react-icons/fa";
import styles from "./TasksPage.module.css";

type TaskTab = "All" | "active" | "completed";
type SortOption = "dueDate" | "priority" | "createdAt" | "title";

export const TasksPage = () => {
  const { tasks, categories, addCategory, toggleTaskCompletion } = useTasks();
  const [selectedTab, _] = useState<TaskTab>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("dueDate");
  const showFilters = false;
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const filteredTasks = tasks
    .filter((task) => {
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
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
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

  const overdueTasks = tasks.filter(
    (task) => !task.completed && new Date(task.dueDate) < new Date(),
  ).length;

  const todayTasks = tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate).toDateString() === new Date().toDateString(),
  );

  const timelineTasks = tasks
    .filter((task) => task.dueTime && !task.completed)
    .sort((a, b) => (a.dueTime || "").localeCompare(b.dueTime || ""))
    .slice(0, 3);

  const handleSortOptionSelect = (option: SortOption) => {
    setSortOption(option);
    setShowFilterDropdown(false);
  };

  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "createdAt", label: "Recently Added" },
    { value: "title", label: "Title" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>My Tasks</h1>
            <p className={styles.heroSubtitle}>Stay organized and productive</p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>{todayTasks.length}</span>
              <span className={styles.heroStatLabel}>Today</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>{overdueTasks}</span>
              <span className={styles.heroStatLabel}>Overdue</span>
            </div>
          </div>
        </div>
        <div className={styles.heroGradient}></div>
      </div>

      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label>Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className={styles.filterSelect}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Recently Added</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}

      <div className={styles.timelineSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <FaClock className={styles.sectionIcon} />
            Today's Schedule
          </h3>
          <button className={styles.seeMore}>View All</button>
        </div>
        <div className={styles.timeline}>
          {timelineTasks.length > 0 ? (
            timelineTasks.map((task) => (
              <div key={task._id} className={styles.timelineItem}>
                <div className={styles.timelineTime}>{task.dueTime}</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>{task.title}</div>
                  <div className={styles.timelineCategory}>{task.category}</div>
                </div>
                <div
                  className={`${styles.timelineDot} ${
                    styles[`priority-${task.priority}`]
                  }`}
                />
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
        <div className={styles.tabsHeaderLeft}>
          <span className={styles.title}>My Tasks</span>
          <div className={styles.filterDropdownContainer}>
            <button
              className={styles.filterDropdownButton}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <FaFilter size={13} color="var(--text-color)" />
            </button>
            {showFilterDropdown && (
              <div className={styles.filterDropdown}>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={styles.filterDropdownOption}
                    onClick={() =>
                      handleSortOptionSelect(option.value as SortOption)
                    }
                  >
                    <span>{option.label}</span>
                    {sortOption === option.value && (
                      <FaCheck size={16} color="#fff" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.taskStats}>
          <span className={styles.taskCount}>{filteredTasks.length} tasks</span>
          {selectedCategory !== "All" && (
            <span className={styles.categoryTag}>{selectedCategory}</span>
          )}
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

      <TaskList
        tasks={filteredTasks}
        onTaskClick={handleTaskClick}
        onToggleCompletion={toggleTaskCompletion}
      />

      {filteredTasks.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FaSearch size={32} />
          </div>
          <h3>No tasks found</h3>
          <p>Try changing your filters or create a new task</p>
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
          title={selectedTask ? "Task Details" : "New Task"}
        >
          {selectedTask ? (
            <TaskDetail
              taskId={selectedTask}
              onClose={() => setIsTaskSheetOpen(false)}
            />
          ) : (
            <div>ok</div>
          )}
        </BottomSheet>
      )}

      {isCategorySheetOpen && (
        <BottomSheet onClose={handleCategorySheetClose} title="New Category">
          <AddCategoryForm
            onSubmit={handleAddCategory}
            onCancel={handleCategorySheetClose}
          />
        </BottomSheet>
      )}

      <div className={styles.overlayLocked}>
        <FaLock size={64} className={styles.lockIcon} />
      </div>
    </div>
  );
};
