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
    dueDate: task?.dueDate.split("T")[0] || "",
    dueTime: task?.dueTime || "",
    category: task?.category || "General",
    priority: task?.priority || "medium",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPrioritySelect, setShowPrioritySelect] = useState(false);

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
    updateTask(task.id, {
      ...editData,
      dueDate: editData.dueDate ? `${editData.dueDate}T00:00:00` : "",
    });
    setIsEditing(false);
    setEditingField(null);
    console.log({ editingField });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  // const handleFieldClick = (field: string) => {
  //   if (isEditing) {
  //     setEditingField(field);
  //   }
  // };

  const handlePrioritySelect = (priority: "low" | "medium" | "high") => {
    setEditData((prev) => ({ ...prev, priority }));
    setShowPrioritySelect(false);
  };

  const priorityColors = {
    high: "#ff4d4f",
    medium: "#faad14",
    low: "#52c41a",
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.taskStatus}>
          <button
            className={`${styles.checkbox} ${
              task.completed ? styles.completed : ""
            }`}
            onClick={() => toggleTaskCompletion(task.id)}
          >
            {task.completed && <Icon variant="check" color="#fff" size={26} />}
          </button>
          <span className={styles.statusText}>
            {task.completed ? "Completed" : "Active"}
          </span>
        </div>

        <div className={styles.taskPriority}>
          <button
            className={styles.priorityButton}
            onClick={() =>
              isEditing && setShowPrioritySelect(!showPrioritySelect)
            }
          >
            <Icon
              variant="flag"
              size={16}
              color={
                isEditing
                  ? priorityColors[editData.priority]
                  : priorityColors[task.priority]
              }
            />
            {isEditing ? editData.priority : task.priority} priority
          </button>

          {isEditing && showPrioritySelect && (
            <div className={styles.prioritySelect}>
              {(["high", "medium", "low"] as const).map((priority) => (
                <button
                  key={priority}
                  className={styles.priorityOption}
                  onClick={() => handlePrioritySelect(priority)}
                >
                  <Icon
                    variant="flag"
                    size={16}
                    color={priorityColors[priority]}
                  />
                  {priority} priority
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <>
          <div className={styles.editField}>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleInputChange}
              className={`${styles.editInput} ${styles.taskTitle}`}
              placeholder="Task title"
            />
          </div>

          <div className={styles.editField}>
            <textarea
              name="description"
              value={editData.description}
              onChange={handleInputChange}
              className={`${styles.editInput} ${styles.taskDescription}`}
              placeholder="Add description..."
              rows={3}
            />
          </div>

          <div className={styles.taskMeta}>
            <div className={styles.metaItem}>
              <Icon variant="calendar" size={16} />
              <input
                type="date"
                name="dueDate"
                value={editData.dueDate}
                onChange={handleInputChange}
                className={styles.editInput}
              />
            </div>

            <div className={styles.metaItem}>
              <Icon variant="clock" size={16} />
              <input
                type="time"
                name="dueTime"
                value={editData.dueTime || ""}
                onChange={handleInputChange}
                className={styles.editInput}
              />
            </div>

            <div className={styles.metaItem}>
              <Icon variant="tag" size={16} />
              <select
                name="category"
                value={editData.category}
                onChange={handleInputChange}
                className={styles.editInput}
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => setIsEditing(false)}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
            <button onClick={handleSave} className={styles.primaryButton}>
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <>
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

            {task.dueTime && (
              <div className={styles.metaItem}>
                <Icon variant="clock" size={16} />
                <span>{task.dueTime}</span>
              </div>
            )}

            <div className={styles.metaItem}>
              <Icon variant="tag" size={16} />
              <span>{task.category}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.secondaryButton}
            >
              <Icon variant="edit" size={16} />
              Edit Task
            </button>
            <button onClick={handleDelete} className={styles.dangerButton}>
              <Icon variant="delete" size={16} />
              Delete Task
            </button>
          </div>
        </>
      )}
    </div>
  );
};
