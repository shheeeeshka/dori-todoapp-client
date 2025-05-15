import { Outlet } from "react-router-dom";
import { NavBar } from "../NavBar/NavBar";
import styles from "./Layout.module.css";

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
