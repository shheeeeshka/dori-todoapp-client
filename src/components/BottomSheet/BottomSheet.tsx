import { useEffect, useState, ReactNode } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./BottomSheet.module.css";
import { handleShare } from "../../utils/utils";

type BottomSheetProps = {
  children: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  showShareButton?: boolean;
  title?: string | null;
};

export const BottomSheet = ({
  children,
  onClose,
  showCloseButton = true,
  showShareButton = false,
  title = null,
}: BottomSheetProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.modalHeader}
          style={{
            justifyContent:
              showShareButton || title ? "space-between" : "flex-end",
          }}
        >
          {showShareButton && (
            <button className={styles.actionButton} onClick={handleShare}>
              <Icon variant="share" size={26} color="var(--primary-color)" />
            </button>
          )}
          {title && <span className={styles.modalTitle}>{title}</span>}
          {showCloseButton && (
            <button className={styles.actionButton} onClick={handleClose}>
              <Icon variant="close" size={26} color="var(--primary-color)" />
            </button>
          )}
        </div>
        <div className={styles.contentWrapper}>{children}</div>
      </div>
    </div>
  );
};
