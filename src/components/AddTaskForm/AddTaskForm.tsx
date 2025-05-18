import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import { PrioritySelector } from "../PrioritySelector/PrioritySelector";
import { Icon } from "../Icon/Icon";
import styles from "./AddTaskForm.module.css";

type AddTaskFormProps = {
  defaultCategory?: string;
  onSubmit: () => void;
};

export const AddTaskForm = ({
  defaultCategory,
  onSubmit,
}: AddTaskFormProps) => {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
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
          placeholder="Task title"
          required
          //   autoFocus
          className={styles.titleInput}
        />
      </div>

      <div className={styles.formGroup}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description (optional)"
          rows={3}
          className={styles.descriptionInput}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.dateLabel}>
            <Icon variant="calendar" size={18} />
            <span>Due Date</span>
            <div className={styles.dateInputContainer}>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={styles.dateInput}
              />
              <Icon
                variant="chevron-down"
                size={16}
                className={styles.datePickerIcon}
              />
            </div>
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.timeLabel}>
            <Icon variant="clock" size={18} />
            <span>Time (optional)</span>
            <input
              type="time"
              name="dueTime"
              value={formData.dueTime}
              onChange={handleInputChange}
              className={styles.timeInput}
            />
          </label>
        </div>
      </div>

      <div className={styles.prioritySection}>
        <span>Priority</span>
        <PrioritySelector
          selected={formData.priority}
          onChange={handlePriorityChange}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Add Task
      </button>
    </form>
  );
};
