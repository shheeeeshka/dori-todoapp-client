import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import styles from "./SlidePanel.module.css";

type SlidePanelProps = {
  children: ReactNode;
  onClose: () => void;
  title?: string | null;
};

export const SlidePanel = ({
  children,
  onClose,
  title = null,
}: SlidePanelProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);

    document.body.style.position = "fixed";
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";

      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={`${styles.panel} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
