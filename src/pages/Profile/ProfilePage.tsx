import { useTelegram } from "../../hooks/useTelegram";
import { Icon } from "../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import { handleShare } from "../../utils/utils";
import { useTasks } from "../../context/TaskContext";
import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  const { tgUser } = useTelegram();
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    highPriority: 0,
    overdue: 0,
  });

  useEffect(() => {
    // Calculate real stats from tasks
    const now = new Date();
    const calculatedStats = {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      active: tasks.filter((task) => !task.completed).length,
      highPriority: tasks.filter(
        (task) => task.priority === "high" && !task.completed
      ).length,
      overdue: tasks.filter(
        (task) => !task.completed && new Date(task.dueDate) < now
      ).length,
    };

    // Animate stats counting up
    const duration = 1000; // animation duration in ms
    const startTime = Date.now();

    const animateStats = () => {
      const progress = Math.min(1, (Date.now() - startTime) / duration);

      setStats({
        total: Math.floor(progress * calculatedStats.total),
        completed: Math.floor(progress * calculatedStats.completed),
        active: Math.floor(progress * calculatedStats.active),
        highPriority: Math.floor(progress * calculatedStats.highPriority),
        overdue: Math.floor(progress * calculatedStats.overdue),
      });

      if (progress < 1) {
        requestAnimationFrame(animateStats);
      }
    };

    animateStats();
  }, [tasks]);

  const getAchievements = () => {
    const completedRatio = stats.completed / Math.max(1, stats.total);
    if (completedRatio >= 0.9) return "Master Planner";
    if (completedRatio >= 0.7) return "Productive Pro";
    if (completedRatio >= 0.5) return "Task Ninja";
    return "Getting Started";
  };

  const getProductivityScore = () => {
    if (stats.total === 0) return 0;
    const baseScore = (stats.completed / stats.total) * 100;
    const penalty = stats.overdue * 5;
    return Math.max(0, Math.floor(baseScore - penalty));
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={handleShare}>
          <Icon variant="share" size={28} />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/settings")}
        >
          <Icon variant="settings" size={28} />
        </button>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <img
              src="https://t4.ftcdn.net/jpg/05/99/64/79/360_F_599647918_bmfbrXIWjwB7mOiWvH85F9iIwijsDjkd.jpg"
              alt="Profile"
              className={styles.avatarImage}
              loading="lazy"
            />
          </div>
          <div className={styles.userInfo}>
            <h1>{tgUser?.first_name || "User"}</h1>
            <p className={styles.username}>@{tgUser?.username || "username"}</p>
            <div className={styles.userStatus}>
              <span className={styles.statusBadge}>{getAchievements()}</span>
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Icon variant="list" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>Total Tasks</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Icon variant="check" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Icon variant="clock" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.active}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Icon variant="flag" size={24} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.highPriority}</span>
              <span className={styles.statLabel}>High Priority</span>
            </div>
          </div>
        </div>

        <div className={styles.progressSection}>
          <h2 className={styles.sectionTitle}>Productivity Score</h2>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${getProductivityScore()}%` }}
            >
              <span className={styles.progressText}>
                {getProductivityScore()}%
              </span>
            </div>
          </div>
        </div>

        <div className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {tasks.slice(0, 3).map((task) => (
              <div key={task._id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {task.completed ? (
                    <Icon variant="check" size={16} color="#4CAF50" />
                  ) : (
                    <Icon variant="clock" size={16} color="#FF9800" />
                  )}
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>{task.title}</p>
                  <p className={styles.activityMeta}>
                    {task.category} •{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
