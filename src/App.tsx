import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/Router/AppRouter";
import { useTelegram } from "./hooks/useTelegram";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";

export const App = () => {
  const { tg, expandApp } = useTelegram();
  const { theme } = useTheme();

  useEffect(() => {
    if (tg?.initDataUnsafe) {
      console.log(`Launching...`);
      tg?.ready();
      expandApp();
    }
  }, [tg, expandApp]);

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};
