import { useTheme } from "../../hooks/useTheme";
import { ThemeSelector } from "../../components/ThemeSelector/ThemeSelector";
import styles from "./SettingsPage.module.css";
import { useState } from "react";

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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [language, setLanguage] = useState("en");

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2>Appearance</h2>
        <ThemeSelector
          themes={themes}
          currentTheme={theme}
          onSelectTheme={(newTheme) => switchTheme(newTheme)}
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
        <div className={styles.switchContainer}>
          <span>Sound</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={() => setSoundEnabled(!soundEnabled)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Sync & Backup</h2>
        <div className={styles.switchContainer}>
          <span>Auto‑sync</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={() => setAutoSync(!autoSync)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        <button className={styles.actionButton}>Backup now</button>
        <button className={styles.actionButton}>Restore from backup</button>
      </div>

      <div className={styles.section}>
        <h2>Language</h2>
        <select
          className={styles.select}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </div>

      <div className={styles.section}>
        <h2>About</h2>
        <p className={styles.aboutText}>
          ToDo App for Telegram
          <br />
          Version 2.1.0
          <br />© {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
