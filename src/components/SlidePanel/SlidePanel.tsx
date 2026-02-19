import type { ReactNode } from "react";
import { useEffect } from "react";
import styles from "./SlidePanel.module.css";

type SlidePanelProps = {
  children: ReactNode;
  onClose: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  isClosing?: boolean;
};

export const SlidePanel = ({
  children,
  onClose,
  header,
  footer,
  showCloseButton = true,
  isClosing = false,
}: SlidePanelProps) => {
  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
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

  const hasCustomHeader = header !== undefined;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.panel} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hasCustomHeader && showCloseButton && (
          <div className={styles.header}>
            <div className={styles.placeholder} />
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {hasCustomHeader && <div className={styles.header}>{header}</div>}

        <div className={styles.content}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};
