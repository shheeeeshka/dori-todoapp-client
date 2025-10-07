import { useState, useRef } from "react";
import { useTasks } from "../../context/TaskContext";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { TaskDetail } from "../../components/TaskDetail/TaskDetail";
import { TaskList } from "../../components/TaskList/TaskList";
import { AddTaskForm } from "../../components/AddTaskForm/AddTaskForm";
import {
  FaPlus,
  FaSearch,
  FaBell,
  FaCalendarAlt,
  FaStar,
  FaChartLine,
} from "react-icons/fa";
import { MdDashboard, MdTaskAlt } from "react-icons/md";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const { tasks, toggleTaskCompletion } = useTasks();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString === todayDateString ? null : dateString);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = task.dueDate.split("T")[0];

    if (selectedDate) {
      return taskDate === selectedDate && !task.completed;
    } else {
      return (
        (taskDate === todayDateString && !task.completed) ||
        (taskDate > todayDateString && !task.completed)
      );
    }
  });

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = task.dueDate.split("T")[0];
    return taskDate === todayDateString && !task.completed;
  });

  const upcomingTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = task.dueDate.split("T")[0];
    return taskDate > todayDateString && !task.completed;
  });

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId);
    setIsBottomSheetOpen(true);
  };

  const getTitleForSelectedDate = () => {
    if (!selectedDate) return null;

    const date = new Date(selectedDate);
    const isToday = selectedDate === todayDateString;
    const isTomorrow =
      selectedDate ===
      new Date(today.setDate(today.getDate() + 1)).toISOString().split("T")[0];

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high" && !task.completed
  ).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarInitial}>D</div>
          </div>
          <div className={styles.userDetails}>
            <p className={styles.greeting}>Good morning</p>
            <h1>David</h1>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconButton}>
            <FaSearch size={18} />
          </button>
          <button className={styles.iconButton}>
            <FaBell size={18} />
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MdTaskAlt size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{totalTasks}</span>
            <span className={styles.statLabel}>Total Tasks</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaChartLine size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{completionRate}%</span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaStar size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{highPriorityTasks}</span>
            <span className={styles.statLabel}>Priority</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <button
          className={styles.quickAction}
          onClick={() => setIsAddTaskOpen(true)}
        >
          <div className={styles.actionIcon}>
            <FaPlus size={20} />
          </div>
          <span>Add Task</span>
        </button>

        <button className={styles.quickAction}>
          <div className={styles.actionIcon}>
            <FaCalendarAlt size={20} />
          </div>
          <span>Schedule</span>
        </button>

        <button className={styles.quickAction}>
          <div className={styles.actionIcon}>
            <FaStar size={20} />
          </div>
          <span>Priority</span>
        </button>

        <button className={styles.quickAction}>
          <div className={styles.actionIcon}>
            <MdDashboard size={20} />
          </div>
          <span>Projects</span>
        </button>
      </div>

      <div className={styles.calendarSection}>
        <div className={styles.sectionHeader}>
          <h3>This Week</h3>
          <span className={styles.dateDisplay}>{formattedDate}</span>
        </div>

        <div className={styles.calendarContainer}>
          <div className={styles.calendarScroll}>
            {calendarDays.map((date, index) => {
              const dayName = date.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const dayNumber = date.getDate();
              const dateString = date.toISOString().split("T")[0];
              const isToday = dateString === todayDateString;
              const isSelected = selectedDate === dateString;
              const dayTasks = tasks.filter(
                (task) =>
                  task.dueDate &&
                  task.dueDate.split("T")[0] === dateString &&
                  !task.completed
              );

              return (
                <button
                  key={index}
                  className={`${styles.dayCard} ${
                    isToday ? styles.today : ""
                  } ${isSelected ? styles.selected : ""}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className={styles.dayName}>{dayName}</div>
                  <div className={styles.dayNumber}>{dayNumber}</div>
                  {dayTasks.length > 0 && (
                    <div className={styles.taskIndicator}>
                      {dayTasks.length}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.tasksSection}>
        <div className={styles.sectionHeader}>
          <h3>{selectedDate ? getTitleForSelectedDate() : "Today's Tasks"}</h3>
          <span className={styles.taskCount}>
            {selectedDate ? filteredTasks.length : todayTasks.length}
          </span>
        </div>

        {selectedDate ? (
          <TaskList
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onToggleCompletion={toggleTaskCompletion}
          />
        ) : (
          <>
            <TaskList
              tasks={todayTasks}
              onTaskClick={handleTaskClick}
              onToggleCompletion={toggleTaskCompletion}
            />

            {upcomingTasks.length > 0 && (
              <>
                <div className={styles.sectionHeader}>
                  <h3>Upcoming Tasks</h3>
                  <span className={styles.taskCount}>
                    {upcomingTasks.length}
                  </span>
                </div>
                <TaskList
                  tasks={upcomingTasks}
                  onTaskClick={handleTaskClick}
                  onToggleCompletion={toggleTaskCompletion}
                />
              </>
            )}
          </>
        )}
      </div>

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

      {isAddTaskOpen && (
        <BottomSheet
          onClose={() => setIsAddTaskOpen(false)}
          showCloseButton
          title="Add New Task"
        >
          <AddTaskForm onSubmit={() => setIsAddTaskOpen(false)} />
        </BottomSheet>
      )}
    </div>
  );
};
