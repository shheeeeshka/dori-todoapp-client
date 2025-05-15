import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { ThemeSelector } from "../../components/ThemeSelector/ThemeSelector";
import styles from "./SettingsPage.module.css";

const themes = [
  { id: "light", name: "Light", colors: ["#ff7eb9", "#d4a5ff"] },
  { id: "dark", name: "Dark", colors: ["#ff7eb9", "#d4a5ff"] },
  { id: "pink", name: "Pink", colors: ["#ff7eb9", "#ff65a3"] },
  { id: "lilac", name: "Lilac", colors: ["#b399ff", "#d4a5ff"] },
  { id: "gradient", name: "Gradient", colors: ["#ff7eb9", "#d4a5ff"] },
];

export const SettingsPage = () => {
  const { theme, switchTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className={styles.container}>
      <h1>Settings</h1>

      <div className={styles.section}>
        <h2>Appearance</h2>
        <ThemeSelector
          themes={themes}
          currentTheme={theme}
          onSelectTheme={(newTheme) => {
            document.documentElement.setAttribute("data-theme", newTheme);
          }}
        />
      </div>

      <div className={styles.section}>
        <h2>Notifications</h2>
        <div className={styles.switchContainer}>
          <span>Enable notifications</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h2>About</h2>
        <p className={styles.aboutText}>
          ToDo App for Telegram
          <br />
          Version 1.0.0
          <br />© 2025
        </p>
      </div>
    </div>
  );
};
