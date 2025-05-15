import styles from "./ThemeSelector.module.css";

type Theme = {
  id: string;
  name: string;
  colors: string[];
};

type ThemeSelectorProps = {
  themes: Theme[];
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
};

export const ThemeSelector = ({
  themes,
  currentTheme,
  onSelectTheme,
}: ThemeSelectorProps) => {
  return (
    <div className={styles.container}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={`${styles.themeButton} ${
            theme.id === currentTheme ? styles.active : ""
          }`}
          onClick={() => onSelectTheme(theme.id)}
        >
          <div
            className={styles.themePreview}
            style={{
              background:
                theme.id === "gradient"
                  ? "linear-gradient(135deg, #fff5f7 0%, #f8f5ff 100%)"
                  : theme.colors[0],
            }}
          >
            <div
              className={styles.themeAccent}
              style={{ backgroundColor: theme.colors[1] }}
            />
          </div>
          <span>{theme.name}</span>
        </button>
      ))}
    </div>
  );
};
