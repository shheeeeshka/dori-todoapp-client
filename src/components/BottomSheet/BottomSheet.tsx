import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import styles from "./BottomSheet.module.css";

type BottomSheetProps = {
  children: ReactNode;
  onClose: () => void;
  title?: string | null;
};

export const BottomSheet = ({
  children,
  onClose,
  title = null,
}: BottomSheetProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

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

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0) {
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 100) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 300);
    }
    setCurrentY(0);
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleClose}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          transform: currentY > 0 ? `translateY(${currentY}px)` : undefined,
          opacity: currentY > 0 ? 1 - (currentY / 300) : undefined
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.dragHandleContainer}>
          <div className={styles.dragHandle} />
        </div>
        
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        )}
        
        <div className={styles.contentWrapper}>{children}</div>
      </div>
    </div>
  );
};