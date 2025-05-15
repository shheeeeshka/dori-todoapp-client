import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/Router/AppRouter";
import { useTelegram } from "./hooks/useTelegram";
import { useEffect } from "react";

export const App = () => {
  const { tg } = useTelegram();

  useEffect(() => {
    tg?.ready();
  }, [tg]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};
