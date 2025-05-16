import { useTelegram } from "./useTelegram";
import { useLayoutEffect, useState } from "react";

export function useTheme() {
  const { tgColorScheme } = useTelegram();
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("color_theme");
    return storedTheme || tgColorScheme || "light";
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const switchTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("color_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return { theme, switchTheme };
}
