import {
  FiCheck,
  FiPlus,
  FiPlusCircle,
  FiSettings,
  FiHome,
  FiList,
  FiUser,
  FiShare2,
  FiX,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiTag,
  FiFlag,
  FiChevronDown,
  FiChevronUp,
  FiClock,
} from "react-icons/fi";
import type { ComponentType, SVGProps } from "react";
import styles from "./Icon.module.css";

type IconVariant =
  | "check"
  | "plus"
  | "plus-circle"
  | "settings"
  | "home"
  | "list"
  | "user"
  | "share"
  | "close"
  | "edit"
  | "delete"
  | "calendar"
  | "tag"
  | "flag"
  | "chevron-down"
  | "chevron-up"
  | "clock";

type IconProps = {
  variant: IconVariant;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
};

const iconMap: Record<IconVariant, ComponentType<SVGProps<SVGSVGElement>>> = {
  check: FiCheck,
  plus: FiPlus,
  "plus-circle": FiPlusCircle,
  settings: FiSettings,
  home: FiHome,
  list: FiList,
  user: FiUser,
  share: FiShare2,
  close: FiX,
  edit: FiEdit2,
  delete: FiTrash2,
  calendar: FiCalendar,
  tag: FiTag,
  flag: FiFlag,
  "chevron-down": FiChevronDown,
  "chevron-up": FiChevronUp,
  clock: FiClock,
};

export const Icon = ({
  variant,
  size = 24,
  color = "currentColor",
  className = "",
  onClick,
}: IconProps) => {
  const IconComponent = iconMap[variant];

  return (
    <IconComponent
      size={size}
      color={color}
      className={`${styles.icon} ${className}`}
      onClick={onClick}
    />
  );
};
