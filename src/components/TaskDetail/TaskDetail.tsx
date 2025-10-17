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
  FaPaperclip,
} from "react-icons/fa";
import styles from "./TaskDetail.module.css";

type TaskDetailProps = {
  taskId: string;
  onClose: () => void;
};

export const TaskDetail = ({ taskId, onClose }: TaskDetailProps) => {
  const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const task = tasks.find((t) => t._id === taskId);

  const [editData, setEditData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate?.split("T")[0] || "",
    dueTime: task?.dueTime || "",
    category: task?.category || "General",
    projectId: task?.projectId || "",
    priority: task?.priority || "medium",
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [showPrioritySelect, setShowPrioritySelect] = useState(false);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);

  const longPressTimer = useRef<number | null>(null);

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
    updateTask(task._id, {
      ...editData,
      subtasks,
      dueDate: editData.dueDate ? `${editData.dueDate}T00:00:00` : "",
    });
    setEditingField(null);
  };

  const handleDelete = () => {
    deleteTask(task._id);
    onClose();
  };

  const handlePrioritySelect = (priority: "low" | "medium" | "high") => {
    setEditData((prev) => ({ ...prev, priority }));
    setShowPrioritySelect(false);
    handleSave();
  };

  const handleFieldPress = (field: string) => {
    setEditingField(field);
  };

  const addSubtask = () => {
    const newSubtask = {
      _id: Date.now().toString(),
      title: "",
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const updateSubtask = (id: string, updates: Partial<{ title: string; completed: boolean }>) => {
    setSubtasks(subtasks.map(st => 
      st._id === id ? { ...st, ...updates } : st
    ));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st._id !== id));
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
      <div className={styles.viewField} onClick={() => handleFieldPress(field)}>
        <span className={value ? styles.fieldValue : styles.placeholder}>
          {value || placeholder}
        </span>
        <FaEdit className={styles.editIcon} size={14} />
      </div>
    );
  };

  const renderFilePreview = (file: any) => {
    if (file.type?.startsWith('image/')) {
      return (
        <div className={styles.filePreview}>
          <img src={file.url} alt={file.name} className={styles.fileImage} />
          <span className={styles.fileName}>{file.name}</span>
        </div>
      );
    }
    
    return (
      <div className={styles.fileItem}>
        <FaPaperclip className={styles.fileIcon} />
        <span className={styles.fileName}>{file.name}</span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.dragHandle} />

      <div className={styles.header}>
        <div className={styles.statusSection}>
          <button
            className={`${styles.checkbox} ${
              task.completed ? styles.completed : ""
            }`}
            onClick={() => toggleTaskCompletion(task._id)}
          >
            {task.completed && <FaCheck size={16} color="#fff" />}
          </button>
          <div className={styles.statusInfo}>
            <span className={styles.statusLabel}>Status</span>
            <span className={styles.statusText}>
              {task.completed ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>

        <div className={styles.prioritySection}>
          <span className={styles.priorityLabel}>Priority</span>
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

      <div className={styles.content}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Title</label>
          {renderEditableField("title", editData.title, "Enter task title")}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Description</label>
          {renderEditableField(
            "description",
            editData.description,
            "Add description...",
            true
          )}
        </div>

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
                onClick={() => handleFieldPress("dueDate")}
              >
                <span
                  className={
                    editData.dueDate ? styles.fieldValue : styles.placeholder
                  }
                >
                  {editData.dueDate
                    ? new Date(editData.dueDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "Set date"}
                </span>
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
                value={editData.dueTime}
                onChange={handleInputChange}
                onBlur={handleSave}
                className={styles.editInput}
                autoFocus
              />
            ) : (
              <div
                className={styles.viewField}
                onClick={() => handleFieldPress("dueTime")}
              >
                <span
                  className={
                    editData.dueTime ? styles.fieldValue : styles.placeholder
                  }
                >
                  {editData.dueTime || "Set time"}
                </span>
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
                onClick={() => handleFieldPress("category")}
              >
                <span className={styles.fieldValue}>{editData.category}</span>
                <FaEdit className={styles.editIcon} size={12} />
              </div>
            )}
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailHeader}>
              <FaTag className={styles.detailIcon} />
              <span className={styles.detailLabel}>Project</span>
            </div>
            {editingField === "projectId" ? (
              <select
                name="projectId"
                value={editData.projectId}
                onChange={handleInputChange}
                onBlur={handleSave}
                className={styles.editInput}
                autoFocus
              >
                <option value="">No Project</option>
                <option value="project1">Project 1</option>
                <option value="project2">Project 2</option>
                <option value="project3">Project 3</option>
              </select>
            ) : (
              <div
                className={styles.viewField}
                onClick={() => handleFieldPress("projectId")}
              >
                <span className={styles.fieldValue}>
                  {editData.projectId || "No Project"}
                </span>
                <FaEdit className={styles.editIcon} size={12} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Subtasks</label>
          <div className={styles.subtasksList}>
            {subtasks.map((subtask) => (
              <div key={subtask._id} className={styles.subtaskItem}>
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={(e) => updateSubtask(subtask._id, { completed: e.target.checked })}
                  className={styles.subtaskCheckbox}
                />
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => updateSubtask(subtask._id, { title: e.target.value })}
                  onBlur={handleSave}
                  placeholder="Subtask title"
                  className={styles.subtaskInput}
                />
                <button
                  onClick={() => deleteSubtask(subtask._id)}
                  className={styles.deleteSubtaskButton}
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
            <button onClick={addSubtask} className={styles.addSubtaskButton}>
              + Add Subtask
            </button>
          </div>
        </div>

        {task.attachments && task.attachments.length > 0 && (
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Attachments</label>
            <div className={styles.attachmentsGrid}>
              {task.attachments.map((file) => (
                <div key={file._id} className={styles.attachmentCard}>
                  {renderFilePreview(file)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button onClick={handleDelete} className={styles.deleteButton}>
          <FaTrash size={16} />
          Delete Task
        </button>
      </div>
    </div>
  );
};