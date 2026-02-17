import { useState, useRef } from "react";
import {
  FaPaperclip,
  FaTimes,
  FaPlus,
  FaEllipsisH,
  FaArrowLeft,
  FaBell,
  FaBellSlash,
  FaCopy,
  FaTrash,
  FaStar,
  FaChevronDown,
} from "react-icons/fa";
import styles from "./TaskForm.module.css";
import { useTasks } from "../../../context/TaskContext";

type TaskFormProps = {
  defaultCategory?: string;
  onSubmit: () => void;
  onClose: () => void;
  taskId?: string;
};

type FileAttachment = {
  _id: string;
  file: File;
  url: string;
};

type Subtask = {
  _id: string;
  title: string;
  completed: boolean;
};

export const TaskForm = ({
  defaultCategory,
  onSubmit,
  onClose,
  taskId,
}: TaskFormProps) => {
  const { addTask, updateTask, tasks } = useTasks();
  const [showMenu, setShowMenu] = useState(false);
  const [disableNotifications, setDisableNotifications] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  const existingTask = taskId ? tasks.find((t) => t._id === taskId) : null;

  const [formData, setFormData] = useState({
    title: existingTask?.title || "",
    description: existingTask?.description || "",
    dueDate:
      existingTask?.dueDate?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
    endDate: "",
    timeline: existingTask?.dueTime || "",
    category: existingTask?.category || defaultCategory || "General",
    projectId: existingTask?.projectId || "",
    priority: (existingTask?.priority || "medium") as "low" | "medium" | "high",
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>(
    existingTask?.subtasks?.map((st) => ({
      _id: st._id,
      title: st.title,
      completed: st.completed,
    })) || [],
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Work",
    "Design",
    "Development",
    "Personal",
    "Documentation",
    "General",
  ];

  const workspaces = [
    { id: "", name: "Search workspaces" },
    { id: "project1", name: "PCS Foodie Workspace" },
    { id: "project2", name: "TRIPPES Landing Page" },
    { id: "project3", name: "UNIGLO Workspace" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (priority: "low" | "medium" | "high") => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 200 * 1024 * 1024) {
        alert("File size must be less than 200MB");
        continue;
      }

      const url = URL.createObjectURL(file);
      newAttachments.push({
        _id: Date.now().toString() + i,
        file,
        url,
      });
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a._id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a._id !== id);
    });
  };

  const addSubtask = () => {
    const newSubtask: Subtask = {
      _id: Date.now().toString(),
      title: "",
      completed: false,
    };
    setSubtasks([...subtasks, newSubtask]);
  };

  const updateSubtask = (id: string, title: string) => {
    setSubtasks(subtasks.map((st) => (st._id === id ? { ...st, title } : st)));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st._id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (existingTask) {
      updateTask(existingTask._id, {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        dueTime: formData.timeline || null,
        category: formData.category,
        projectId: formData.projectId,
        priority: formData.priority,
        subtasks: subtasks.filter((st) => st.title.trim() !== ""),
      });
    } else {
      addTask({
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        dueTime: formData.timeline || null,
        category: formData.category,
        projectId: formData.projectId,
        priority: formData.priority,
        subtasks: subtasks.filter((st) => st.title.trim() !== ""),
      });
    }

    attachments.forEach((attachment) => {
      URL.revokeObjectURL(attachment.url);
    });

    onSubmit();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (file: File): string => {
    const type = file.type;
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎥";
    if (type.startsWith("audio/")) return "🎵";
    if (type === "application/pdf") return "📄";
    if (type.includes("document") || type.includes("word")) return "📝";
    if (type.includes("spreadsheet") || type.includes("excel")) return "📊";
    if (type.includes("presentation") || type.includes("powerpoint"))
      return "📑";
    return "📎";
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    switch (action) {
      case "notifications":
        setDisableNotifications(!disableNotifications);
        break;
      case "duplicate":
        console.log("Duplicate task");
        break;
      case "delete":
        if (existingTask) {
          if (window.confirm("Delete this task?")) {
            onClose();
          }
        }
        break;
      case "favorite":
        console.log("Add to favorites");
        break;
    }
  };

  const selectCategory = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  };

  const selectWorkspace = (workspaceId: string, workspaceName: string) => {
    setFormData((prev) => ({ ...prev, projectId: workspaceId }));
    setShowWorkspaceDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <button type="button" onClick={onClose} className={styles.backButton}>
          <FaArrowLeft size={20} />
        </button>
        <h2 className={styles.title}>
          {existingTask ? "Edit Task" : "New Task"}
        </h2>
        <div className={styles.menuContainer}>
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className={styles.menuButton}
          >
            <FaEllipsisH size={20} />
          </button>
          {showMenu && (
            <div className={styles.contextMenu}>
              <button
                type="button"
                onClick={() => handleMenuAction("notifications")}
                className={styles.menuItem}
              >
                {disableNotifications ? (
                  <FaBell size={16} />
                ) : (
                  <FaBellSlash size={16} />
                )}
                <span>
                  {disableNotifications
                    ? "Enable Notifications"
                    : "Disable Notifications"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuAction("duplicate")}
                className={styles.menuItem}
              >
                <FaCopy size={16} />
                <span>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuAction("favorite")}
                className={styles.menuItem}
              >
                <FaStar size={16} />
                <span>Add to Favorites</span>
              </button>
              <button
                type="button"
                onClick={() => handleMenuAction("delete")}
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
              >
                <FaTrash size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Task title"
            required
            className={styles.titleInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add task description..."
            rows={4}
            className={styles.descriptionInput}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Due date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>End date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Daily timeline</label>
          <input
            type="time"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            className={styles.timeInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <div className={styles.customSelect}>
            <div
              className={styles.selectTrigger}
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <span>{formData.category}</span>
              <FaChevronDown size={14} className={styles.selectIcon} />
            </div>
            {showCategoryDropdown && (
              <div className={styles.dropdownMenu}>
                {categories.map((category) => (
                  <div
                    key={category}
                    className={styles.dropdownItem}
                    onClick={() => selectCategory(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Workspace</label>
          <div className={styles.customSelect}>
            <div
              className={styles.selectTrigger}
              onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            >
              <span>
                {workspaces.find((w) => w.id === formData.projectId)?.name ||
                  "Search workspaces"}
              </span>
              <FaChevronDown size={14} className={styles.selectIcon} />
            </div>
            {showWorkspaceDropdown && (
              <div className={styles.dropdownMenu}>
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className={styles.dropdownItem}
                    onClick={() =>
                      selectWorkspace(workspace.id, workspace.name)
                    }
                  >
                    {workspace.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Priority</label>
          <div className={styles.priorityButtons}>
            <button
              type="button"
              className={`${styles.priorityButton} ${
                formData.priority === "low" ? styles.prioritySelected : ""
              }`}
              onClick={() => handlePriorityChange("low")}
            >
              Low
            </button>
            <button
              type="button"
              className={`${styles.priorityButton} ${
                formData.priority === "medium" ? styles.prioritySelected : ""
              }`}
              onClick={() => handlePriorityChange("medium")}
            >
              Medium
            </button>
            <button
              type="button"
              className={`${styles.priorityButton} ${
                formData.priority === "high" ? styles.prioritySelected : ""
              }`}
              onClick={() => handlePriorityChange("high")}
            >
              High
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Subtasks</label>
          <div className={styles.subtasksList}>
            {subtasks.map((subtask) => (
              <div key={subtask._id} className={styles.subtaskItem}>
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => updateSubtask(subtask._id, e.target.value)}
                  placeholder="Subtask title"
                  className={styles.subtaskInput}
                />
                <button
                  type="button"
                  onClick={() => deleteSubtask(subtask._id)}
                  className={styles.deleteSubtaskButton}
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSubtask}
              className={styles.addSubtaskButton}
            >
              <FaPlus size={14} />
              Add Subtask
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Attachments</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="*/*"
            className={styles.fileInput}
            id="file-upload"
          />
          <label htmlFor="file-upload" className={styles.fileUploadButton}>
            <FaPaperclip size={16} />
            <span>Choose Files</span>
          </label>
          {attachments.length > 0 && (
            <div className={styles.attachmentsList}>
              {attachments.map((attachment) => (
                <div key={attachment._id} className={styles.attachmentItem}>
                  <span className={styles.fileIcon}>
                    {getFileIcon(attachment.file)}
                  </span>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>
                      {attachment.file.name}
                    </span>
                    <span className={styles.fileSize}>
                      {formatFileSize(attachment.file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment._id)}
                    className={styles.removeFileButton}
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!formData.title.trim()}
        >
          {existingTask ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};
