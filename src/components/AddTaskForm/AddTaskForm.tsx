import { useState, useRef } from "react";
import { useTasks } from "../../context/TaskContext";
import {
  FaCalendar,
  FaClock,
  FaTag,
  FaPaperclip,
  FaTimes,
} from "react-icons/fa";
import styles from "./AddTaskForm.module.css";

type AddTaskFormProps = {
  defaultCategory?: string;
  onSubmit: () => void;
};

type FileAttachment = {
  id: string;
  file: File;
  url: string;
};

export const AddTaskForm = ({
  defaultCategory,
  onSubmit,
}: AddTaskFormProps) => {
  const { addTask, categories } = useTasks();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    dueTime: "",
    category: defaultCategory || "General",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        continue;
      }

      const url = URL.createObjectURL(file);
      newAttachments.push({
        id: Date.now().toString() + i,
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
      const attachment = prev.find((a) => a.id === id);
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    addTask({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime || null,
      category: formData.category,
      priority: formData.priority,
    });

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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Task Planner Mobile Apps"
          required
          className={styles.titleInput}
        />
      </div>

      <div className={styles.formGroup}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Add task description..."
          rows={3}
          className={styles.descriptionInput}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FaCalendar className={styles.labelIcon} />
            Due date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FaClock className={styles.labelIcon} />
            Time
          </label>
          <input
            type="time"
            name="dueTime"
            value={formData.dueTime}
            onChange={handleInputChange}
            className={styles.timeInput}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <FaTag className={styles.labelIcon} />
          Workspace
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={styles.selectInput}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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
        <label className={styles.label}>
          <FaPaperclip className={styles.labelIcon} />
          Attachments
        </label>

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
              <div key={attachment.id} className={styles.attachmentItem}>
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
                  onClick={() => removeAttachment(attachment.id)}
                  className={styles.removeFileButton}
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!formData.title.trim()}
      >
        Create
      </button>
    </form>
  );
};
