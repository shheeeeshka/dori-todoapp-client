interface TelegramWebApp {
  WebApp?: {
    close: () => void;
    MainButton: {
      isVisible: boolean;
      show: () => void;
      hide: () => void;
    };
    initDataUnsafe?: {
      user?: any;
      query_id?: string;
    };
    version?: string;
    colorScheme?: string;
  };
}

declare global {
  interface Window {
    Telegram?: TelegramWebApp;
  }
}

export function useTelegram() {
  const tg = window.Telegram?.WebApp;

  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    if (tg?.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg?.MainButton.show();
    }
  };

  return {
    onClose,
    onToggleButton,
    tg,
    tgUser: tg?.initDataUnsafe?.user,
    queryId: tg?.initDataUnsafe?.query_id,
    tgVersion: tg?.version,
    tgColorScheme: tg?.colorScheme,
  };
}
