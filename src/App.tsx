import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/Router/AppRouter";
import { useTelegram } from "./hooks/useTelegram";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";

export const App = () => {
  const { tg, expandApp, isReady } = useTelegram();
  const { theme } = useTheme();

  useEffect(() => {
    if (tg && isReady) {
      console.log(`Launching...`);
      expandApp();
    }
  }, [tg, isReady, expandApp]);

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};
