import styles from "./SettingsForm.module.css";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useTheme } from "../../../hooks/useTheme";
import { ThemeSelector } from "../../ThemeSelector/ThemeSelector";
import { SlidePanel } from "../../SlidePanel/SlidePanel";

type SettingsFormProps = {
  onClose: () => void;
};

const themes = [
  { id: "light", name: "Light", colors: ["#ff7eb9", "#d4a5ff"] },
  { id: "dark", name: "Dark", colors: ["#ff7eb9", "#d4a5ff"] },
  { id: "pink", name: "Pink", colors: ["#ff7eb9", "#ff65a3"] },
  { id: "lilac", name: "Lilac", colors: ["#b399ff", "#d4a5ff"] },
  { id: "gradient", name: "Gradient", colors: ["#ff7eb9", "#d4a5ff"] },
];

export const SettingsForm = ({ onClose }: SettingsFormProps) => {
  const { theme, switchTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [language, setLanguage] = useState("en");

  const header = (
    <>
      <button type="button" onClick={onClose} className={styles.backButton}>
        <FaArrowLeft size={20} />
      </button>
      <h2 className={styles.title}>Settings</h2>
      <div className={styles.placeholder} />
    </>
  );

  return (
    <form className={styles.form}>
      <SlidePanel onClose={onClose} header={header} showCloseButton={false}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Appearance</h3>
            <ThemeSelector
              themes={themes}
              currentTheme={theme}
              onSelectTheme={(newTheme) => switchTheme(newTheme)}
            />
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Notifications</h3>
            <div className={styles.switchContainer}>
              <span className={styles.switchLabel}>Enable notifications</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.switchContainer}>
              <span className={styles.switchLabel}>Sound</span>
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
            <h3 className={styles.sectionTitle}>Sync & Backup</h3>
            <div className={styles.switchContainer}>
              <span className={styles.switchLabel}>Auto‑sync</span>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={() => setAutoSync(!autoSync)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <button type="button" className={styles.actionButton}>
              Backup now
            </button>
            <button type="button" className={styles.actionButton}>
              Restore from backup
            </button>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Language</h3>
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
            <h3 className={styles.sectionTitle}>About</h3>

            <div className={styles.aboutCard}>
              <div className={styles.aboutHeader}>
                <div className={styles.appIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className={styles.appInfo}>
                  <span className={styles.appName}>ToDo App</span>
                  <span className={styles.appVersion}>v2.1.0</span>
                </div>
                <span className={styles.badge}>PWA</span>
              </div>

              <div className={styles.aboutFooter}>
                <p className={styles.copyright}>
                  © {new Date().getFullYear()} · Made by{" "}
                  <span className={styles.heart}>shheeeeshka</span>
                </p>
                <div className={styles.links}>
                  <a href="#" className={styles.link}>
                    Privacy
                  </a>
                  <span className={styles.linkDivider}>·</span>
                  <a href="#" className={styles.link}>
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlidePanel>
    </form>
  );
};
