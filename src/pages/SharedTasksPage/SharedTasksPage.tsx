import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/Icon/Icon";
import styles from "./SharedTasksPage.module.css";

type Participant = {
  id: string;
  name: string;
  avatar?: string;
};

type Comment = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
};

type SharedTask = {
  id: string;
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

  // Mock data - in a real app this would come from context or API
  const sharedTasks: SharedTask[] = [
    {
      id: "1",
      title: "Discuss app design",
      description: "We need to finalize the UI components and color scheme",
      dueDate: "2023-06-15",
      participants: [
        { id: "1", name: "you" },
        { id: "2", name: "alex" },
        { id: "3", name: "maria" },
      ],
      comments: [
        {
          id: "1",
          userId: "2",
          userName: "alex",
          text: "When should we meet?",
          timestamp: "2023-06-10T14:30:00",
        },
        {
          id: "2",
          userId: "1",
          userName: "you",
          text: "How about Friday evening?",
          timestamp: "2023-06-10T15:45:00",
        },
      ],
      category: "Design",
      priority: "high",
      createdBy: "1",
    },
    {
      id: "2",
      title: "Plan team outing",
      description: "Organize a team building activity for next month",
      dueDate: "2023-07-01",
      participants: [
        { id: "1", name: "you" },
        { id: "4", name: "john" },
      ],
      comments: [
        {
          id: "3",
          userId: "4",
          userName: "john",
          text: "I suggest going bowling",
          timestamp: "2023-06-08T10:15:00",
        },
      ],
      category: "Team",
      priority: "medium",
      createdBy: "4",
    },
  ];

  const handleAddComment = (taskId: string) => {
    if (!newComment.trim()) return;

    // In a real app, this would dispatch an action or call an API
    console.log(`Adding comment to task ${taskId}: ${newComment}`);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Shared Tasks</h1>
        <button
          className={styles.inviteButton}
          onClick={() => navigate("/invite")}
        >
          <Icon variant="plus" size={20} />
          <span>Invite</span>
        </button>
      </div>

      <div className={styles.taskList}>
        {sharedTasks.map((task) => (
          <div
            key={task.id}
            className={`${styles.taskCard} ${
              activeTask === task.id ? styles.expanded : ""
            }`}
          >
            <div
              className={styles.taskHeader}
              onClick={() => toggleTaskDetails(task.id)}
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
                <Icon variant="user" size={16} />
                <span>{task.participants.length}</span>
              </div>
              <Icon
                variant={activeTask === task.id ? "chevron-up" : "chevron-down"}
                size={20}
                className={styles.chevron}
              />
            </div>

            {activeTask === task.id && (
              <div className={styles.taskDetails}>
                <p className={styles.taskDescription}>{task.description}</p>

                <div className={styles.dueDate}>
                  <Icon variant="calendar" size={16} />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>

                <div className={styles.participantsSection}>
                  <h4>Participants</h4>
                  <div className={styles.participantsList}>
                    {task.participants.map((participant) => (
                      <div key={participant.id} className={styles.participant}>
                        <div className={styles.avatar}>
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.commentsSection}>
                  <h4>Comments</h4>
                  {task.comments.length > 0 ? (
                    <div className={styles.commentsList}>
                      {task.comments.map((comment) => (
                        <div key={comment.id} className={styles.comment}>
                          <div className={styles.commentHeader}>
                            <div className={styles.avatar}>
                              {comment.userName.charAt(0).toUpperCase()}
                            </div>
                            <span className={styles.commentAuthor}>
                              {comment.userName}
                            </span>
                            <span className={styles.commentTime}>
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className={styles.commentText}>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noComments}>No comments yet</p>
                  )}

                  <div className={styles.addComment}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className={styles.commentInput}
                    />
                    <button
                      onClick={() => handleAddComment(task.id)}
                      className={styles.commentButton}
                      disabled={!newComment.trim()}
                    >
                      <Icon variant="plus" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
