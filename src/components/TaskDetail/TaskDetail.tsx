import { useState, useRef, useEffect } from "react";
import { useTasks } from "../../context/TaskContext";
import {
  FaCheck,
  FaFlag,
  FaCalendar,
  FaClock,
  FaTag,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import styles from "./TaskDetail.module.css";

type TaskDetailProps = {
  taskId: string;
  onClose: () => void;
};

export const TaskDetail = ({ taskId, onClose }: TaskDetailProps) => {
  const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const task = tasks.find((t) => t.id === taskId);

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

  const longPressTimer = useRef<number | null>(null);
  const LONG_PRESS_DURATION = 500;

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

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
    setEditingField(null);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  const handlePrioritySelect = (priority: "low" | "medium" | "high") => {
    setEditData((prev) => ({ ...prev, priority }));
    setShowPrioritySelect(false);
    handleSave();
  };

  const handleLongPressStart = (field: string) => {
    longPressTimer.current = window.setTimeout(() => {
      setEditingField(field);
    }, LONG_PRESS_DURATION);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const priorityConfig = {
    high: { color: "#ff4757", label: "High" },
    medium: { color: "#ffa502", label: "Medium" },
    low: { color: "#2ed573", label: "Low" },
  };

  const currentPriority = editingField ? editData.priority : task.priority;

  const renderEditableField = (
    field: string,
    value: string,
    placeholder: string,
    isTextarea = false
  ) => {
    if (editingField === field) {
      if (isTextarea) {
        return (
          <textarea
            name={field}
            value={value}
            onChange={handleInputChange}
            onBlur={handleSave}
            className={styles.editInput}
            placeholder={placeholder}
            rows={4}
            autoFocus
          />
        );
      }
      return (
        <input
          name={field}
          value={value}
          onChange={handleInputChange}
          onBlur={handleSave}
          className={styles.editInput}
          placeholder={placeholder}
          autoFocus
        />
      );
    }

    return (
      <div
        className={styles.viewField}
        onTouchStart={() => handleLongPressStart(field)}
        onTouchEnd={handleLongPressEnd}
        onMouseDown={() => handleLongPressStart(field)}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
      >
        {value || <span className={styles.placeholder}>{placeholder}</span>}
        <FaEdit className={styles.editIcon} size={14} />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.statusSection}>
          <button
            className={`${styles.checkbox} ${
              task.completed ? styles.completed : ""
            }`}
            onClick={() => toggleTaskCompletion(task.id)}
          >
            {task.completed && <FaCheck size={14} />}
          </button>
          <div className={styles.statusInfo}>
            <span className={styles.statusLabel}>Status</span>
            <span className={styles.statusText}>
              {task.completed ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>

        <div className={styles.prioritySection}>
          <div className={styles.priorityLabel}>Priority</div>
          <button
            className={styles.priorityButton}
            onClick={() => setShowPrioritySelect(!showPrioritySelect)}
          >
            <FaFlag color={priorityConfig[currentPriority].color} size={16} />
            <span>{priorityConfig[currentPriority].label}</span>
          </button>

          {showPrioritySelect && (
            <div className={styles.priorityDropdown}>
              {(["high", "medium", "low"] as const).map((priority) => (
                <button
                  key={priority}
                  className={styles.priorityOption}
                  onClick={() => handlePrioritySelect(priority)}
                >
                  <FaFlag color={priorityConfig[priority].color} size={14} />
                  <span>{priorityConfig[priority].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Title */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Title</label>
          {renderEditableField("title", editData.title, "Enter task title")}
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Description</label>
          {renderEditableField(
            "description",
            editData.description,
            "Add a description...",
            true
          )}
        </div>

        {/* Details Grid */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailHeader}>
              <FaCalendar className={styles.detailIcon} />
              <span className={styles.detailLabel}>Due Date</span>
            </div>
            {editingField === "dueDate" ? (
              <input
                type="date"
                name="dueDate"
                value={editData.dueDate}
                onChange={handleInputChange}
                onBlur={handleSave}
                className={styles.editInput}
                autoFocus
              />
            ) : (
              <div
                className={styles.viewField}
                onTouchStart={() => handleLongPressStart("dueDate")}
                onTouchEnd={handleLongPressEnd}
              >
                {editData.dueDate ? (
                  new Date(editData.dueDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                ) : (
                  <span className={styles.placeholder}>Set date</span>
                )}
                <FaEdit className={styles.editIcon} size={12} />
              </div>
            )}
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailHeader}>
              <FaClock className={styles.detailIcon} />
              <span className={styles.detailLabel}>Time</span>
            </div>
            {editingField === "dueTime" ? (
              <input
                type="time"
                name="dueTime"
                value={editData.dueTime || ""}
                onChange={handleInputChange}
                onBlur={handleSave}
                className={styles.editInput}
                autoFocus
              />
            ) : (
              <div
                className={styles.viewField}
                onTouchStart={() => handleLongPressStart("dueTime")}
                onTouchEnd={handleLongPressEnd}
              >
                {editData.dueTime || (
                  <span className={styles.placeholder}>Set time</span>
                )}
                <FaEdit className={styles.editIcon} size={12} />
              </div>
            )}
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailHeader}>
              <FaTag className={styles.detailIcon} />
              <span className={styles.detailLabel}>Category</span>
            </div>
            {editingField === "category" ? (
              <select
                name="category"
                value={editData.category}
                onChange={handleInputChange}
                onBlur={handleSave}
                className={styles.editInput}
                autoFocus
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
              </select>
            ) : (
              <div
                className={styles.viewField}
                onTouchStart={() => handleLongPressStart("category")}
                onTouchEnd={handleLongPressEnd}
              >
                {editData.category}
                <FaEdit className={styles.editIcon} size={12} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={handleDelete} className={styles.deleteButton}>
          <FaTrash size={16} />
          Delete Task
        </button>
      </div>
    </div>
  );
};
