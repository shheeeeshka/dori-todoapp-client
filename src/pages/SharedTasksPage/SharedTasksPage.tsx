import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaUser,
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaComment,
  FaQrcode,
  FaShare,
  FaUsers,
  FaClock,
  FaPaperPlane,
  FaFire,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
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
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [joiningCode, setJoiningCode] = useState("TEAM-789-XYZ");

  const sharedTasks: SharedTask[] = [
    {
      _id: "1",
      title: "Team Project: Mobile App Design",
      description:
        "Finalize the UI components and create design system for our new mobile application. We need to decide on color palette, typography, and component library.",
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
        {
          _id: "3",
          userId: "3",
          userName: "Maria",
          text: "I've updated the color scheme based on our last discussion.",
          timestamp: "2024-06-11T09:15:00",
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
        "Coordinate the launch of our Q3 marketing campaign across all platforms including social media, email, and paid advertising.",
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
    {
      _id: "3",
      title: "Product Development Sprint",
      description:
        "Weekly sprint planning and task allocation for the development team. Review progress and adjust timelines as needed.",
      dueDate: "2024-06-20",
      participants: [
        { _id: "1", name: "You", avatar: "Y" },
        { _id: "6", name: "Mike", avatar: "M" },
        { _id: "7", name: "Lisa", avatar: "L" },
      ],
      comments: [],
      category: "Development",
      priority: "high",
      createdBy: "6",
    },
  ];

  const handleAddComment = (taskId: string) => {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Shared Tasks</h1>
          <div className={styles.headerActions}>
            <button
              className={styles.headerButton}
              onClick={() => setShowQR(true)}
            >
              <FaQrcode size={20} />
            </button>
            <button
              className={styles.inviteButton}
              onClick={() => navigate("/invite")}
            >
              <FaPlus size={16} />
              <span>Invite</span>
            </button>
          </div>
        </div>
        <p className={styles.headerSubtitle}>
          Collaborate with your team on shared tasks
        </p>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUsers size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>3</span>
            <span className={styles.statLabel}>Active Teams</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaFire size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statNumber}>12</span>
            <span className={styles.statLabel}>Total Tasks</span>
          </div>
        </div>
      </div>

      <div className={styles.qrSection}>
        <div className={styles.qrCard}>
          <div className={styles.qrHeader}>
            <FaQrcode size={24} />
            <h3>Join with Code</h3>
          </div>
          <div className={styles.joiningCode}>
            <span>{joiningCode}</span>
            <button onClick={copyJoiningCode} className={styles.copyButton}>
              Copy
            </button>
          </div>
          <p className={styles.qrHint}>
            Share this code with team members to join your tasks
          </p>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Team Tasks</h2>
        <span className={styles.taskCount}>{sharedTasks.length} tasks</span>
      </div>

      <div className={styles.taskList}>
        {sharedTasks.map((task) => (
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
                      onClick={() => handleAddComment(task._id)}
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

      {showQR && (
        <div className={styles.qrModal}>
          <div className={styles.qrModalContent}>
            <div className={styles.qrModalHeader}>
              <h3>Scan to Join</h3>
              <button
                onClick={() => setShowQR(false)}
                className={styles.closeButton}
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <div className={styles.qrCodePlaceholder}>
              <FaQrcode size={120} />
              <p>QR Code Display</p>
            </div>
            <div className={styles.qrModalFooter}>
              <p>Scan this code to join the shared task team</p>
              <button
                onClick={copyJoiningCode}
                className={styles.copyCodeButton}
              >
                Copy Joining Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
