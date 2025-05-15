import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import { Icon } from "../Icon/Icon";
import styles from "./TaskDetail.module.css";

type TaskDetailProps = {
  taskId: string;
  onClose: () => void;
};

export const TaskDetail = ({ taskId, onClose }: TaskDetailProps) => {
  const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const task = tasks.find((t) => t.id === taskId);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate || "",
    category: task?.category || "General",
    priority: task?.priority || "medium",
  });

  if (!task) return null;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateTask(task.id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.editForm}>
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleInputChange}
            className={styles.editTitle}
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleInputChange}
            className={styles.editDescription}
            placeholder="Add description..."
          />

          <div className={styles.editMeta}>
            <select
              name="category"
              value={editData.category}
              onChange={handleInputChange}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>

            <select
              name="priority"
              value={editData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={editData.dueDate}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.editActions}>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button onClick={handleSave} className={styles.saveButton}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <div className={styles.taskStatus}>
              <button
                className={`${styles.checkbox} ${
                  task.completed ? styles.completed : ""
                }`}
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.completed && <Icon variant="check" size={16} />}
              </button>
              <span className={styles.statusText}>
                {task.completed ? "Completed" : "Active"}
              </span>
            </div>

            <div className={styles.taskPriority}>
              <Icon
                variant="flag"
                size={16}
                color={
                  task.priority === "high"
                    ? "#ff4d4f"
                    : task.priority === "medium"
                    ? "#faad14"
                    : "#52c41a"
                }
              />
              {task.priority} priority
            </div>
          </div>

          <h2 className={styles.taskTitle}>{task.title}</h2>

          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}

          <div className={styles.taskMeta}>
            <div className={styles.metaItem}>
              <Icon variant="calendar" size={16} />
              <span>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "No due date"}
              </span>
            </div>

            <div className={styles.metaItem}>
              <Icon variant="tag" size={16} />
              <span>{task.category}</span>
            </div>

            <div className={styles.metaItem}>
              <Icon variant="clock" size={16} />
              <span>
                Created:{" "}
                {new Date(task.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              <Icon variant="edit" size={16} />
              Edit
            </button>
            <button onClick={handleDelete} className={styles.deleteButton}>
              <Icon variant="delete" size={16} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};
