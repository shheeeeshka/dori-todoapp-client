import { useTelegram } from "../../hooks/useTelegram";
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
  FaFire,
  FaRocket,
  FaStar,
} from "react-icons/fa";
import styles from "./ProfilePage.module.css";
import { useOutletContext } from "react-router-dom";
import { SettingsForm } from "../../components/forms/SettingsForm/SettingsForm";

type LayoutContext = {
  openPanel: (content: {
    component: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    showCloseButton?: boolean;
  }) => void;
  closePanel: () => void;
};

export const ProfilePage = () => {
  const { tgUser } = useTelegram();
  const { tasks } = useTasks();
  const { openPanel, closePanel } = useOutletContext<LayoutContext>();
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
        (task) => task.priority === "high" && !task.completed,
      ).length,
      overdue: tasks.filter(
        (task) => !task.completed && new Date(task.dueDate) < now,
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
      if (progress < 1) requestAnimationFrame(animateStats);
    };
    animateStats();
  }, [tasks]);

  const getProductivityScore = () => {
    if (stats.total === 0) return 0;
    const baseScore = (stats.completed / stats.total) * 100;
    const penalty = stats.overdue * 5;
    return Math.max(0, Math.min(100, Math.floor(baseScore - penalty)));
  };

  const getLevel = () => {
    const score = getProductivityScore();
    if (score >= 80)
      return { name: "Master", icon: <FaRocket />, color: "#f84a06" };
    if (score >= 50) return { name: "Pro", icon: <FaFire />, color: "#ff6b2b" };
    if (score >= 20)
      return { name: "Rookie", icon: <FaStar />, color: "#ff9f4b" };
    return { name: "Beginner", icon: <FaStar />, color: "#b0b0b0" };
  };

  const getRecentHistory = () => {
    return tasks
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
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
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const achievements = [
    {
      id: 1,
      name: "First Task",
      icon: <FaCheck />,
      unlocked: stats.total >= 1,
      color: "#4caf50",
    },
    {
      id: 2,
      name: "Task Master",
      icon: <FaList />,
      unlocked: stats.completed >= 10,
      color: "#2196f3",
    },
    {
      id: 3,
      name: "Early Bird",
      icon: <FaClock />,
      unlocked: stats.overdue === 0 && stats.total >= 5,
      color: "#ff9800",
    },
    {
      id: 4,
      name: "Priority Pro",
      icon: <FaFlag />,
      unlocked: stats.highPriority >= 5,
      color: "#f44336",
    },
  ];

  const handleOpenSettings = () => {
    openPanel({
      component: <SettingsForm onClose={closePanel} />,
      showCloseButton: false,
    });
  };

  const productivityScore = getProductivityScore();
  const level = getLevel();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset =
    circumference - (productivityScore / 100) * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={handleShare}>
          <FaShare size={18} />
        </button>
        <div className={styles.avatar}>
          <img
            src="https://t4.ftcdn.net/jpg/05/99/64/79/360_F_599647918_bmfbrXIWjwB7mOiWvH85F9iIwijsDjkd.jpg"
            alt="Profile"
            className={styles.avatarImage}
          />
        </div>
        <button className={styles.actionButton} onClick={handleOpenSettings}>
          <FaCog size={18} />
        </button>
      </div>

      <div className={styles.userInfo}>
        <h1>{tgUser?.first_name || "User"}</h1>
        <p className={styles.username}>@{tgUser?.username || "username"}</p>
        <div
          className={styles.levelBadge}
          style={{ background: level.color + "20", color: level.color }}
        >
          {level.icon} {level.name}
        </div>
      </div>

      <div className={styles.scoreSection}>
        <div className={styles.scoreCircle}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--card-border)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={level.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className={styles.scoreValue}>
            <span className={styles.scoreNumber}>{productivityScore}</span>
            <span className={styles.scoreLabel}>score</span>
          </div>
        </div>
        <div className={styles.scoreInfo}>
          <h3>Productivity Score</h3>
          <p>
            {stats.completed} completed • {stats.active} active
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <FaList className={styles.statIcon} style={{ color: "#2196f3" }} />
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaCheck className={styles.statIcon} style={{ color: "#4caf50" }} />
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.completed}</span>
            <span className={styles.statLabel}>Done</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaClock className={styles.statIcon} style={{ color: "#ff9800" }} />
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.active}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <FaFlag className={styles.statIcon} style={{ color: "#f44336" }} />
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{stats.highPriority}</span>
            <span className={styles.statLabel}>High</span>
          </div>
        </div>
      </div>

      <div className={styles.achievementSection}>
        <h2>Achievements</h2>
        <div className={styles.achievementGrid}>
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`${styles.achievementCard} ${!a.unlocked ? styles.locked : ""}`}
            >
              <div
                className={styles.achievementIcon}
                style={{ background: a.color + "20", color: a.color }}
              >
                {a.icon}
              </div>
              <span className={styles.achievementName}>{a.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.historySection}>
        <h2>Recent Activity</h2>
        <div className={styles.historyList}>
          {getRecentHistory().map((task) => (
            <div key={task._id} className={styles.historyItem}>
              <div
                className={styles.historyIcon}
                style={{
                  background: task.completed ? "#4caf5020" : "#ff980020",
                  color: task.completed ? "#4caf50" : "#ff9800",
                }}
              >
                {task.completed ? <FaCheck size={12} /> : <FaClock size={12} />}
              </div>
              <div className={styles.historyContent}>
                <p className={styles.historyTitle}>{task.title}</p>
                <p className={styles.historyMeta}>{task.category}</p>
              </div>
              <span className={styles.historyTime}>
                {formatHistoryTime(task.updatedAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
