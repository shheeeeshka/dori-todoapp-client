import { useState } from "react";
import {
  FaPlus,
  FaUser,
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaComment,
  FaQrcode,
  FaUsers,
  FaClock,
  FaPaperPlane,
  FaFire,
  FaBell,
} from "react-icons/fa";
import { MdTaskAlt, MdDashboard, MdTrendingUp } from "react-icons/md";
import styles from "./SharedTasksPage.module.css";

type Participant = {
  _id: string;
  name: string;
  avatar?: string;
};

type Comment = {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
};

type SharedTask = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  participants: Participant[];
  comments: Comment[];
  category: string;
  priority: "low" | "medium" | "high";
  createdBy: string;
};

export const SharedTasksPage = () => {
  const [newComment, setNewComment] = useState("");
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [joiningCode] = useState("TEAM-789-XYZ");

  const sharedTasks: SharedTask[] = [
    {
      _id: "1",
      title: "Team Project: Mobile App Design",
      description:
        "Finalize the UI components and create design system for our new mobile application.",
      dueDate: "2024-06-15",
      participants: [
        { _id: "1", name: "You", avatar: "Y" },
        { _id: "2", name: "Alex", avatar: "A" },
        { _id: "3", name: "Maria", avatar: "M" },
        { _id: "4", name: "John", avatar: "J" },
      ],
      comments: [
        {
          _id: "1",
          userId: "2",
          userName: "Alex",
          text: "When should we schedule our next meeting?",
          timestamp: "2024-06-10T14:30:00",
        },
        {
          _id: "2",
          userId: "1",
          userName: "You",
          text: "How about Friday at 3 PM? I'll prepare the design mockups.",
          timestamp: "2024-06-10T15:45:00",
        },
      ],
      category: "Design",
      priority: "high",
      createdBy: "1",
    },
    {
      _id: "2",
      title: "Marketing Campaign Launch",
      description:
        "Coordinate the launch of our Q3 marketing campaign across all platforms.",
      dueDate: "2024-07-01",
      participants: [
        { _id: "1", name: "You", avatar: "Y" },
        { _id: "5", name: "Sarah", avatar: "S" },
      ],
      comments: [
        {
          _id: "4",
          userId: "5",
          userName: "Sarah",
          text: "I suggest we focus on Instagram and LinkedIn for this campaign.",
          timestamp: "2024-06-08T10:15:00",
        },
      ],
      category: "Marketing",
      priority: "medium",
      createdBy: "5",
    },
  ];

  const filteredTasks = sharedTasks;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setNewComment("");
  };

  const toggleTaskDetails = (taskId: string) => {
    setActiveTask(activeTask === taskId ? null : taskId);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const copyJoiningCode = () => {
    navigator.clipboard.writeText(joiningCode);
  };

  const totalParticipants = sharedTasks.reduce(
    (sum, task) => sum + task.participants.length,
    0
  );
  const activeTeams = new Set(sharedTasks.map((task) => task.category)).size;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <div className={styles.avatarInitial}>D</div>
          </div>
          <div>
            <p className={styles.greeting}>Team Collaboration</p>
            <h2 className={styles.userName}>David</h2>
          </div>
        </div>
        <button className={styles.notificationButton}>
          <FaBell className={styles.bellIcon} />
          <span className={styles.notificationDot} />
        </button>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MdTaskAlt className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{sharedTasks.length}</span>
            <span className={styles.statLabel}>Shared Tasks</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <MdTrendingUp className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>{totalParticipants}</span>
            <span className={styles.statLabel}>Team Members</span>
          </div>
        </div>

        <div className={styles.statCardLarge}>
          <div className={styles.statIconLarge}>
            <MdDashboard className={styles.statIconSvgLarge} />
          </div>
          <div className={styles.statContentLarge}>
            <span className={styles.statNumberLarge}>{activeTeams}</span>
            <span className={styles.statLabelLarge}>Active Teams</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <button className={styles.actionButton} onClick={() => setShowQR(true)}>
          <div className={styles.actionIcon}>
            <FaQrcode size={20} />
          </div>
          <span>Join Code</span>
        </button>

        <button className={styles.actionButton}>
          <div className={styles.actionIcon}>
            <FaUsers size={20} />
          </div>
          <span>Invite</span>
        </button>

        <button className={styles.actionButton}>
          <div className={styles.actionIcon}>
            <FaPlus size={20} />
          </div>
          <span>New Team</span>
        </button>

        <button className={styles.actionButton}>
          <div className={styles.actionIcon}>
            <FaFire size={20} />
          </div>
          <span>Activity</span>
        </button>
      </div>

      <div className={styles.tasksHeader}>
        <h3 className={styles.sectionTitle}>Team Tasks</h3>
        <span className={styles.taskCount}>{filteredTasks.length} tasks</span>
      </div>

      <div className={styles.taskList}>
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={`${styles.taskCard} ${
              activeTask === task._id ? styles.expanded : ""
            }`}
          >
            <div
              className={styles.taskHeader}
              onClick={() => toggleTaskDetails(task._id)}
            >
              <div className={styles.taskTitleWrapper}>
                <span className={styles.taskTitle}>{task.title}</span>
                <div className={styles.taskMeta}>
                  <span className={styles.taskCategory}>{task.category}</span>
                  <span
                    className={`${styles.taskPriority} ${
                      styles[`priority-${task.priority}`]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className={styles.taskParticipants}>
                <FaUser size={14} />
                <span>{task.participants.length}</span>
              </div>
              {activeTask === task._id ? (
                <FaChevronUp size={18} className={styles.chevron} />
              ) : (
                <FaChevronDown size={18} className={styles.chevron} />
              )}
            </div>

            {activeTask === task._id && (
              <div className={styles.taskDetails}>
                <p className={styles.taskDescription}>{task.description}</p>

                <div className={styles.dueDate}>
                  <FaCalendar size={16} />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>

                <div className={styles.participantsSection}>
                  <h4>
                    <FaUsers size={16} />
                    Participants
                  </h4>
                  <div className={styles.participantsList}>
                    {task.participants.map((participant) => (
                      <div key={participant._id} className={styles.participant}>
                        <div className={styles.avatar}>
                          {participant.avatar}
                        </div>
                        <span>{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.commentsSection}>
                  <h4>
                    <FaComment size={16} />
                    Discussion
                  </h4>
                  {task.comments.length > 0 ? (
                    <div className={styles.commentsList}>
                      {task.comments.map((comment) => (
                        <div key={comment._id} className={styles.comment}>
                          <div className={styles.commentHeader}>
                            <div className={styles.avatar}>
                              {comment.userName.charAt(0).toUpperCase()}
                            </div>
                            <span className={styles.commentAuthor}>
                              {comment.userName}
                            </span>
                            <span className={styles.commentTime}>
                              <FaClock size={12} />
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className={styles.commentText}>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noComments}>
                      No comments yet. Start the conversation!
                    </p>
                  )}

                  <div className={styles.addComment}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type your message..."
                      className={styles.commentInput}
                    />
                    <button
                      onClick={handleAddComment}
                      className={styles.commentButton}
                      disabled={!newComment.trim()}
                    >
                      <FaPaperPlane size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FaUsers size={32} />
          </div>
          <h3>No shared tasks found</h3>
          <p>Create a new team or join existing one to start collaborating</p>
          <button
            className={styles.emptyAction}
            onClick={() => setShowQR(true)}
          >
            Join Team
          </button>
        </div>
      )}

      {showQR && (
        <div className={styles.qrModal}>
          <div className={styles.qrModalContent}>
            <div className={styles.qrModalHeader}>
              <h3>Team Join Code</h3>
              <button
                onClick={() => setShowQR(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.qrCodePlaceholder}>
              <FaQrcode size={80} />
              <div className={styles.joiningCodeDisplay}>
                <span>{joiningCode}</span>
              </div>
            </div>
            <div className={styles.qrModalFooter}>
              <p>Share this code with team members to collaborate</p>
              <button
                onClick={copyJoiningCode}
                className={styles.copyCodeButton}
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
