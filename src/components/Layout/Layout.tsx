import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { NavBar } from "../NavBar/NavBar";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
};
