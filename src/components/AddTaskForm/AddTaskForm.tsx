import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import { FaCalendar, FaClock, FaTag } from "react-icons/fa";
import styles from "./AddTaskForm.module.css";

type AddTaskFormProps = {
  defaultCategory?: string;
  onSubmit: () => void;
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

    onSubmit();
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
