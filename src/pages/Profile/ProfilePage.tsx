import { useTelegram } from "../../hooks/useTelegram";
import { Icon } from "../../components/Icon/Icon";
import { useNavigate } from "react-router-dom";
import { handleShare } from "../../utils/utils";
import styles from "./ProfilePage.module.css";

export const ProfilePage = () => {
  const { tgUser } = useTelegram();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={handleShare}>
          <Icon variant="share" size={28} />
        </button>
        <button
          className={styles.actionButton}
          onClick={() => navigate("/settings")}
        >
          <Icon variant="settings" size={28} />
        </button>
      </div>

      <div className={styles.profileHeader}>
        <div className={styles.avatar}>
          <Icon variant="user" size={48} color="var(--primary-color)" />
        </div>
        <div className={styles.userInfo}>
          <h1>{tgUser?.first_name || "User"}</h1>
          <p className={styles.username}>@{tgUser?.username || "username"}</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>42</span>
          <span className={styles.statLabel}>Tasks</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>36</span>
          <span className={styles.statLabel}>Completed</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>6</span>
          <span className={styles.statLabel}>Active</span>
        </div>
      </div>
    </div>
  );
};
