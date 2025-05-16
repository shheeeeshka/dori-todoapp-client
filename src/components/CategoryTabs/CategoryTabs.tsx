import { Icon } from "../Icon/Icon";
import styles from "./CategoryTabs.module.css";

type CategoryTabsProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onAddCategory: () => void;
};

export const CategoryTabs = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: CategoryTabsProps) => {
  return (
    <div className={styles.tabs}>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.tab} ${
            category === selectedCategory ? styles.active : ""
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
      <button className={styles.addTab} onClick={onAddCategory}>
        <Icon variant="plus" size={20} />
      </button>
    </div>
  );
};
