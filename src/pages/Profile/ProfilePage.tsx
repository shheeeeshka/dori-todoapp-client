import { useTelegram } from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import { handleShare } from "../../utils/utils";
import { useTasks } from "../../context/TaskContext";
import { useEffect, useState } from "react";
import {
  FaShare,
  FaCog,
  FaBars,
  FaList,
  FaCheck,
  FaClock,
  FaFlag,
} from "react-icons/fa";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
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

    const duration = 1000;
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
        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(true)}
        >
          <FaBars size={20} />
        </button>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleShare}>
            <FaShare size={20} />
          </button>
          <button
            className={styles.actionButton}
            onClick={() => navigate("/settings")}
          >
            <FaCog size={20} />
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {tgUser?.photo_url ? (
              <img
                src={tgUser.photo_url}
                alt="Profile"
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {tgUser?.first_name?.[0] || "U"}
              </div>
            )}
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
              <FaList size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>Total Tasks</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaCheck size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaClock size={20} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.active}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaFlag size={20} />
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
              <div key={task.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {task.completed ? (
                    <FaCheck size={16} color="#4CAF50" />
                  ) : (
                    <FaClock size={16} color="#FF9800" />
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

      {isMenuOpen && (
        <div className={styles.menuOverlay}>
          <div className={styles.menuContent}>
            <button
              className={styles.closeMenu}
              onClick={() => setIsMenuOpen(false)}
            >
              ×
            </button>
            <nav className={styles.menuNav}>
              <a href="/" className={styles.menuItem}>
                Home
              </a>
              <a href="/tasks" className={styles.menuItem}>
                Tasks
              </a>
              <a href="/shared" className={styles.menuItem}>
                Shared
              </a>
              <a href="/profile" className={styles.menuItem}>
                Profile
              </a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
