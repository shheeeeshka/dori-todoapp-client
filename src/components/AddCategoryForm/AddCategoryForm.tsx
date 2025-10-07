import { useState } from "react";
import styles from "./AddCategoryForm.module.css";

type AddCategoryFormProps = {
  onSubmit: (categoryName: string) => void;
  onCancel: () => void;
};

export const AddCategoryForm = ({ onSubmit }: AddCategoryFormProps) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSubmit(categoryName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="categoryName">Category Name</label>
        <input
          id="categoryName"
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          //   autoFocus
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Create Category
      </button>
    </form>
  );
};
