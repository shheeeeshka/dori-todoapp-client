import { useState } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./CategorySelector.module.css";

type CategorySelectorProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export const CategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.selectorButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedCategory}</span>
        <Icon variant={isOpen ? "chevron-up" : "chevron-down"} size={16} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryItem} ${
                category === selectedCategory ? styles.active : ""
              }`}
              onClick={() => {
                onSelectCategory(category);
                setIsOpen(false);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
