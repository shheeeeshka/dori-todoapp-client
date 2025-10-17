import { useTelegram } from "../../hooks/useTelegram";
import { useNavigate } from "react-router-dom";
import { handleShare } from "../../utils/utils";
import { useTasks } from "../../context/TaskContext";
import { useEffect, useState } from "react";
import {
  FaShare,
  FaCog,
  FaCheck,
  FaClock,
  FaList,
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

  const getRecentHistory = () => {
    return tasks
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  };

  const formatHistoryTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const achievements = [
    {
      _id: 1,
      name: "First Steps",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/0d/Neil_Armstrong_pose.jpg",
      unlocked: stats.total >= 1,
    },
    {
      _id: 2,
      name: "Task Master",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/USAFA_Hosts_Elon_Musk_%28Image_1_of_17%29_%28cropped%29.jpg/330px-USAFA_Hosts_Elon_Musk_%28Image_1_of_17%29_%28cropped%29.jpg",
      unlocked: stats.completed >= 10,
    },
    {
      _id: 3,
      name: "Early Bird",
      image: "https://er10.kz/wp-content/uploads/2025/01/kuk.jpg",
      unlocked: stats.overdue === 0 && stats.total >= 5,
    },
    {
      _id: 4,
      name: "Productivity Guru",
      image:
        "https://cdn1.ozonusercontent.com/s3/club-storage/images/article_image_752x940/1009/c500/274cf41a-97d0-431e-8ea1-c1bc0e45d7a8.jpeg",
      unlocked: getProductivityScore() >= 80,
    },
    {
      _id: 5,
      name: "Priority Pro",
      image:
        "https://iy.kommersant.ru/Issues.photo/NEWS/2023/11/23/KMO_096855_34369_1_t222_123453.jpg",
      unlocked: stats.highPriority >= 5,
    },
    {
      _id: 6,
      name: "Marathon Runner",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Steve_Jobs_Headshot_2010-CROP.jpg/1200px-Steve_Jobs_Headshot_2010-CROP.jpg",
      unlocked: stats.total >= 50,
    },
  ];

  const handleViewAll = () => {
    console.log("View all history");
  };

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
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
              <FaList size={18} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.total}</span>
              <span className={styles.statLabel}>Total Tasks</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaCheck size={18} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaClock size={18} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statNumber}>{stats.active}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaFlag size={18} />
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

        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <button className={styles.viewAllButton} onClick={handleViewAll}>
              View All
            </button>
          </div>
          <div className={styles.historyList}>
            {getRecentHistory().map((task) => (
              <div key={task._id} className={styles.historyItem}>
                <div className={styles.historyIcon}>
                  {task.completed ? (
                    <FaCheck size={14} />
                  ) : (
                    <FaClock size={14} />
                  )}
                </div>
                <div className={styles.historyContent}>
                  <p className={styles.historyTaskTitle}>{task.title}</p>
                  <p className={styles.historyMeta}>
                    {task.category} • {task.priority} priority
                  </p>
                </div>
                <div className={styles.historyTime}>
                  {formatHistoryTime(task.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.achievementSection}>
          <h2 className={styles.sectionTitle}>Achievements</h2>
          <div className={styles.achievementScroll}>
            {achievements.map((achievement) => (
              <div
                key={achievement._id}
                className={`${styles.achievementItem} ${
                  !achievement.unlocked ? styles.achievementLocked : ""
                }`}
              >
                <img
                  src={achievement.image}
                  alt={achievement.name}
                  className={styles.achievementImage}
                />
                <span className={styles.achievementName}>
                  {achievement.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
