import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { NavBar } from "../NavBar/NavBar";
import { SlidePanel } from "../SlidePanel/SlidePanel";
import { useState, type ReactNode } from "react";

type PanelContent = {
  component: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
} | null;

export const Layout = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState<PanelContent>(null);
  const [isClosing, setIsClosing] = useState(false);

  const openPanel = (
    content: Omit<NonNullable<PanelContent>, "showCloseButton"> & {
      showCloseButton?: boolean;
    },
  ) => {
    setPanelContent({
      ...content,
      showCloseButton: content.showCloseButton ?? true,
    });
    setIsPanelOpen(true);
    setIsClosing(false);
  };

  const closePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsPanelOpen(false);
      setPanelContent(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        <Outlet context={{ openPanel, closePanel }} />
      </main>
      <NavBar />
      {isPanelOpen && panelContent && (
        <SlidePanel
          onClose={closePanel}
          header={panelContent.header}
          footer={panelContent.footer}
          showCloseButton={panelContent.showCloseButton}
          isClosing={isClosing}
        >
          {panelContent.component}
        </SlidePanel>
      )}
    </div>
  );
};
