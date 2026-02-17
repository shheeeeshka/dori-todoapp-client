import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import { TaskForm } from "../../components/forms/TaskForm/TaskForm";
import { DatePickerDialog } from "../../components/DatePickerDialog/DatePickerDialog";
import { FaSearch, FaBell, FaCalendarAlt } from "react-icons/fa";
import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";
import { SlidePanel } from "../../components/SlidePanel/SlidePanel";

export const HomePage = () => {
  const { tasks, toggleTaskCompletion } = useTasks();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return date;
  });

  const getTasksForSelectedDate = () => {
    const targetDate = selectedDate || todayDateString;
    return tasks.filter(
      (task) => task.dueDate.split("T")[0] === targetDate && !task.completed,
    );
  };

  let filteredTasks = getTasksForSelectedDate();

  if (searchQuery.trim()) {
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setIsBottomSheetOpen(true);
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    if (selectedDate === dateString) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateString);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalSubtasks = tasks.reduce(
    (acc, task) => acc + (task.subtasks?.length || 0),
    0,
  );
  const totalTasks = tasks.length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high" && !task.completed,
  ).length;

  const favoriteWorkspaceTasks = tasks
    .filter((task) => task.category === "Work" && !task.completed)
    .slice(0, 3);

  const dailyTasksCompleted = tasks.filter(
    (task) => task.completed && task.dueDate.split("T")[0] === todayDateString,
  ).length;
  const dailyTasksTotal = tasks.filter(
    (task) => task.dueDate.split("T")[0] === todayDateString,
  ).length;
  const dailyProgress =
    dailyTasksTotal > 0
      ? Math.round((dailyTasksCompleted / dailyTasksTotal) * 100)
      : 0;

  const selectedDateObj = selectedDate ? new Date(selectedDate) : today;
  const calendarMonth = selectedDateObj.toLocaleDateString("en-US", {
    month: "long",
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Link to="profile" className={styles.avatar}>
            <img
              src="https://t4.ftcdn.net/jpg/05/99/64/79/360_F_599647918_bmfbrXIWjwB7mOiWvH85F9iIwijsDjkd.jpg"
              alt="Profile"
              className={styles.avatarImage}
              loading="lazy"
            />
          </Link>
          <div>
            <p className={styles.greeting}>Good Morning</p>
            <h2 className={styles.userName}>Dude</h2>
          </div>
        </div>
        <button
          className={styles.notificationButton}
          onClick={() => console.log("Open notifications")}
        >
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
            placeholder="Search your task..."
            className={styles.searchField}
          />
        </div>
      </div>

      <div className={styles.timelineHeader}>
        <h2 className={styles.timelineTitle}>Your Timeline</h2>
        <button
          className={styles.calendarButton}
          onClick={() => setIsCalendarOpen(true)}
        >
          {calendarMonth} <FaCalendarAlt className={styles.calendarIcon} />
        </button>
      </div>

      <div className={styles.calendarSection}>
        <div className={styles.calendarScroll}>
          {weekDays.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected =
              selectedDate === date.toISOString().split("T")[0];
            return (
              <button
                key={index}
                className={`${styles.dayCard} ${isToday ? styles.today : ""} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleDateClick(date)}
              >
                <span className={styles.dayName}>
                  {daysOfWeek[date.getDay()]}
                </span>
                <span
                  className={`${styles.dayNumber} ${
                    isToday ? styles.todayNumber : ""
                  }`}
                >
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <h3 className={styles.statTitle}>Work Tasks</h3>
            <span className={styles.taskCount}>
              {favoriteWorkspaceTasks.length}
            </span>
          </div>
          <div className={styles.workspaceTasks}>
            {favoriteWorkspaceTasks.map((task) => (
              <div key={task._id} className={styles.workspaceTask}>
                <div className={styles.taskDot} />
                <span className={styles.taskText}>{task.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.dailyProgress}>
            <div className={styles.dailyInfo}>
              <h3 className={styles.dailyTitle}>Daily Tasks</h3>
              <p className={styles.dailySubtitle}>
                {dailyTasksCompleted}/{dailyTasksTotal} done
              </p>
            </div>
            <div
              className={styles.progressCircle}
              style={{ "--progress": dailyProgress } as React.CSSProperties}
            >
              <div className={styles.progressText}>
                <span className={styles.progressNumber}>{dailyProgress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statCardLarge}>
          <div className={styles.statHeaderLarge}>
            <h3 className={styles.statTitleLarge}>All Tasks</h3>
            <span className={styles.totalCount}>{totalTasks}</span>
          </div>
          <div className={styles.taskBreakdown}>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Completed</span>
              <span className={styles.breakdownNumber}>{completedTasks}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Subtasks</span>
              <span className={styles.breakdownNumber}>{totalSubtasks}</span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Pending</span>
              <span className={styles.breakdownNumber}>
                {totalTasks - completedTasks}
              </span>
            </div>
            <div className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>High Priority</span>
              <span className={styles.breakdownNumber}>
                {highPriorityTasks}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.todayTasks}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "Today's Tasks"}
          </h3>
          <Link
            to="/tasks"
            className={styles.seeMore}
            onClick={() => console.log("See more tasks")}
          >
            See more
          </Link>
        </div>
        <TaskList
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onToggleCompletion={toggleTaskCompletion}
        />
      </div>

      <button className={styles.fab} onClick={() => setIsAddTaskOpen(true)}>
        <span>Create New Task</span>
      </button>

      {isBottomSheetOpen && selectedTask && (
        <BottomSheet onClose={() => setIsBottomSheetOpen(false)}>
          <TaskDetail
            taskId={selectedTask}
            onClose={() => setIsBottomSheetOpen(false)}
          />
        </BottomSheet>
      )}

      {isAddTaskOpen && (
        <SlidePanel onClose={() => setIsAddTaskOpen(false)}>
          <TaskForm
            onSubmit={() => setIsAddTaskOpen(false)}
            onClose={() => setIsAddTaskOpen(false)}
          />
        </SlidePanel>
      )}

      <DatePickerDialog
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={(date) => {
          const dateString = date.toISOString().split("T")[0];
          setSelectedDate(dateString);
        }}
      />
    </div>
  );
};
