import { NavLink } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaShareAlt, FaUser } from "react-icons/fa";
import styles from "./NavBar.module.css";

export const NavBar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaHome size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaCalendarAlt size={20} />
        <span>Tasks</span>
      </NavLink>
      <NavLink
        to="/shared"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaShareAlt size={20} />
        <span>Shared</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <FaUser size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
