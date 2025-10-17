import { useState } from "react";
import {
  FaPlus,
  FaCalendar,
  FaChevronDown,
  FaChevronUp,
  FaComment,
  FaQrcode,
  FaUsers,
  FaClock,
  FaPaperPlane,
  FaSearch,
  FaCrown,
  FaRocket,
  FaChartLine,
  FaCheckCircle,
  FaRegClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdTaskAlt, MdDashboard } from "react-icons/md";
import styles from "./SharedTasksPage.module.css";

type Participant = {
  _id: string;
  name: string;
  avatar?: string;
  role?: string;
};

type Comment = {
  _id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
};

type Workspace = {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  memberCount: number;
  taskCount: number;
  recentActivity: string;
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
  workspaceId: string;
  progress?: number;
  tags?: string[];
};

export const SharedTasksPage = () => {
  const [newComment, setNewComment] = useState("");
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [joiningCode] = useState("TEAM-789-XYZ");
  const [activeTab, setActiveTab] = useState<"workspaces" | "tasks">(
    "workspaces"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const workspaces: Workspace[] = [
    {
      _id: "1",
      name: "Product Launch",
      description: "Mobile app development and release",
      icon: "🚀",
      color: "#FF6B6B",
      memberCount: 8,
      taskCount: 23,
      recentActivity: "2 hours ago",
    },
    {
      _id: "2",
      name: "Marketing Team",
      description: "Q3 campaign planning and execution",
      icon: "📈",
      color: "#4ECDC4",
      memberCount: 5,
      taskCount: 15,
      recentActivity: "1 day ago",
    },
    {
      _id: "3",
      name: "Design Studio",
      description: "UI/UX design and prototyping",
      icon: "🎨",
      color: "#45B7D1",
      memberCount: 6,
      taskCount: 18,
      recentActivity: "3 hours ago",
    },
    {
      _id: "4",
      name: "Research Lab",
      description: "User research and analytics",
      icon: "🔬",
      color: "#96CEB4",
      memberCount: 4,
      taskCount: 12,
      recentActivity: "5 hours ago",
    },
  ];

  const sharedTasks: SharedTask[] = [
    {
      _id: "1",
      title: "Team Project: Mobile App Design",
      description:
        "Finalize the UI components and create design system for our new mobile application. We need to complete the onboarding flow and dashboard redesign.",
      dueDate: "2024-06-15",
      participants: [
        { _id: "1", name: "You", avatar: "Y", role: "Lead" },
        { _id: "2", name: "Alex", avatar: "A", role: "Designer" },
        { _id: "3", name: "Maria", avatar: "M", role: "Developer" },
        { _id: "4", name: "John", avatar: "J", role: "QA" },
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
      workspaceId: "1",
      progress: 75,
      tags: ["UI", "Mobile", "Design System"],
    },
    {
      _id: "2",
      title: "Marketing Campaign Launch",
      description:
        "Coordinate the launch of our Q3 marketing campaign across all platforms including social media, email, and paid advertising.",
      dueDate: "2024-07-01",
      participants: [
        { _id: "1", name: "You", avatar: "Y", role: "Manager" },
        { _id: "5", name: "Sarah", avatar: "S", role: "Content" },
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
      workspaceId: "2",
      progress: 40,
      tags: ["Social Media", "Content", "Ads"],
    },
    {
      _id: "3",
      title: "User Research Synthesis",
      description:
        "Analyze and synthesize findings from recent user interviews and usability tests to inform product decisions.",
      dueDate: "2024-06-20",
      participants: [
        { _id: "1", name: "You", avatar: "Y", role: "Researcher" },
        { _id: "6", name: "Mike", avatar: "M", role: "Analyst" },
        { _id: "7", name: "Lisa", avatar: "L", role: "PM" },
      ],
      comments: [],
      category: "Research",
      priority: "medium",
      createdBy: "6",
      workspaceId: "4",
      progress: 25,
      tags: ["Research", "Analysis", "UX"],
    },
  ];

  const filteredTasks = sharedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <FaExclamationTriangle className={styles.priorityIcon} />;
      case "medium":
        return <FaRegClock className={styles.priorityIcon} />;
      case "low":
        return <FaCheckCircle className={styles.priorityIcon} />;
      default:
        return <FaRegClock className={styles.priorityIcon} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Team Collaboration</h1>
            <p className={styles.heroSubtitle}>Work together, achieve more</p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>
                {sharedTasks.length}
              </span>
              <span className={styles.heroStatLabel}>Active Projects</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNumber}>{totalParticipants}</span>
              <span className={styles.heroStatLabel}>Team Members</span>
            </div>
          </div>
        </div>
        <div className={styles.heroGradient}></div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks, teams, or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.navigationTabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "workspaces" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("workspaces")}
        >
          <MdDashboard className={styles.tabIcon} />
          Workspaces
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "tasks" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("tasks")}
        >
          <MdTaskAlt className={styles.tabIcon} />
          All Tasks
        </button>
      </div>

      {activeTab === "workspaces" && (
        <div className={styles.workspacesGrid}>
          {workspaces.map((workspace) => (
            <div key={workspace._id} className={styles.workspaceCard}>
              <div className={styles.workspaceHeader}>
                <div
                  className={styles.workspaceIcon}
                  style={{ backgroundColor: workspace.color }}
                >
                  {workspace.icon}
                </div>
                <div className={styles.workspaceInfo}>
                  <h3 className={styles.workspaceName}>{workspace.name}</h3>
                  <p className={styles.workspaceDescription}>
                    {workspace.description}
                  </p>
                </div>
                <button className={styles.workspaceMenu}>⋯</button>
              </div>

              <div className={styles.workspaceStats}>
                <div className={styles.workspaceStat}>
                  <FaUsers className={styles.statIcon} />
                  <span>{workspace.memberCount} members</span>
                </div>
                <div className={styles.workspaceStat}>
                  <MdTaskAlt className={styles.statIcon} />
                  <span>{workspace.taskCount} tasks</span>
                </div>
              </div>

              <div className={styles.workspaceProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>Active</span>
              </div>

              <div className={styles.workspaceFooter}>
                <span className={styles.recentActivity}>
                  Updated {workspace.recentActivity}
                </span>
                <button className={styles.joinButton}>
                  <FaRocket className={styles.joinIcon} />
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "tasks" && (
        <>
          <div className={styles.quickActions}>
            <button
              className={styles.actionButton}
              onClick={() => setShowQR(true)}
            >
              <div className={styles.actionIcon}>
                <FaQrcode size={20} />
              </div>
              <span>Join Team</span>
            </button>

            <button className={styles.actionButton}>
              <div className={styles.actionIcon}>
                <FaUsers size={20} />
              </div>
              <span>Members</span>
            </button>

            <button className={styles.actionButton}>
              <div className={styles.actionIcon}>
                <FaPlus size={20} />
              </div>
              <span>Create</span>
            </button>

            <button className={styles.actionButton}>
              <div className={styles.actionIcon}>
                <FaChartLine size={20} />
              </div>
              <span>Analytics</span>
            </button>
          </div>

          <div className={styles.tasksHeader}>
            <div className={styles.headerLeft}>
              <h3 className={styles.sectionTitle}>Team Tasks</h3>
              <span className={styles.taskCount}>
                {filteredTasks.length} tasks
              </span>
            </div>
            <div className={styles.viewControls}>
              <button className={styles.viewButton}>Recent</button>
              <button className={styles.viewButton}>Priority</button>
            </div>
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
                  <div className={styles.taskMain}>
                    {getPriorityIcon(task.priority)}
                    <div className={styles.taskTitleWrapper}>
                      <span className={styles.taskTitle}>{task.title}</span>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskCategory}>
                          {task.category}
                        </span>
                        <span
                          className={`${styles.taskPriority} ${
                            styles[`priority-${task.priority}`]
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.progress && (
                          <div className={styles.progressBadge}>
                            {task.progress}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.taskActions}>
                    <div className={styles.taskParticipants}>
                      <FaUsers size={12} />
                      <span>{task.participants.length}</span>
                    </div>
                    {activeTask === task._id ? (
                      <FaChevronUp size={16} className={styles.chevron} />
                    ) : (
                      <FaChevronDown size={16} className={styles.chevron} />
                    )}
                  </div>
                </div>

                {activeTask === task._id && (
                  <div className={styles.taskDetails}>
                    <p className={styles.taskDescription}>{task.description}</p>

                    {task.tags && (
                      <div className={styles.tagsContainer}>
                        {task.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={styles.dueDate}>
                      <FaCalendar size={14} />
                      <span>Due: {formatDate(task.dueDate)}</span>
                      {task.progress && (
                        <div className={styles.taskProgress}>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span>{task.progress}%</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.participantsSection}>
                      <h4>
                        <FaUsers size={14} />
                        Team Members
                      </h4>
                      <div className={styles.participantsList}>
                        {task.participants.map((participant) => (
                          <div
                            key={participant._id}
                            className={styles.participant}
                          >
                            <div className={styles.avatar}>
                              {participant.avatar}
                              {participant.role === "Lead" && (
                                <FaCrown className={styles.leaderBadge} />
                              )}
                            </div>
                            <div className={styles.participantInfo}>
                              <span className={styles.participantName}>
                                {participant.name}
                              </span>
                              <span className={styles.participantRole}>
                                {participant.role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.commentsSection}>
                      <h4>
                        <FaComment size={14} />
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
                                <div className={styles.commentInfo}>
                                  <span className={styles.commentAuthor}>
                                    {comment.userName}
                                  </span>
                                  <span className={styles.commentTime}>
                                    <FaClock size={10} />
                                    {formatTime(comment.timestamp)}
                                  </span>
                                </div>
                              </div>
                              <p className={styles.commentText}>
                                {comment.text}
                              </p>
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
                          <FaPaperPlane size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "tasks" && filteredTasks.length === 0 && (
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
