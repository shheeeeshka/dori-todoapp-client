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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const today = new Date();
  const todayDateString = today.toISOString().split("T")[0];

  // Format today's date as "17 April 2025"
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Generate calendar days (today + next 30 days)
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
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

  return (
    <div className={styles.container}>
      <div className={styles.appHeader}>
        <h1 className={styles.appTitle}>Dori to Dori</h1>
        <p className={styles.appSubtitle}>Your daily task manager</p>
      </div>

      <div className={styles.dateHeader}>{formattedDate}</div>

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

            return (
              <button
                key={index}
                className={`${styles.dayCard} ${isToday ? styles.today : ""} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleDateClick(date)}
              >
                <div className={styles.dayName}>{dayName}</div>
                <div className={styles.dayNumber}>{dayNumber}</div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate ? (
        <>
          <h1 className={styles.title}>{getTitleForSelectedDate()}</h1>
          <TaskList
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onToggleCompletion={toggleTaskCompletion}
          />
        </>
      ) : (
        <>
          <h1 className={styles.title}>Today</h1>
          <TaskList
            tasks={todayTasks}
            onTaskClick={handleTaskClick}
            onToggleCompletion={toggleTaskCompletion}
          />

          <h1 className={`${styles.title} ${styles.title2}`}>Upcoming</h1>
          <TaskList
            tasks={upcomingTasks}
            onTaskClick={handleTaskClick}
            onToggleCompletion={toggleTaskCompletion}
          />
        </>
      )}

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
