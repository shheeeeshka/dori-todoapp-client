import { NavLink } from "react-router-dom";
import { Icon } from "../Icon/Icon";
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
        <Icon variant="home" size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <Icon variant="list" size={24} />
        <span>Tasks</span>
      </NavLink>
      <NavLink
        to="/add-task"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <Icon variant="plus-circle" size={24} />
        <span>Add Task</span>
      </NavLink>
      <NavLink
        to="/shared"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <Icon variant="share" size={24} />
        <span>Shared</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ""}`
        }
      >
        <Icon variant="user" size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
