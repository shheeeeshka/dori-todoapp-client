interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
  allows_write_to_pm?: boolean;
}

interface TelegramWebAppInitData {
  user?: TelegramUser;
  query_id?: string;
}

interface TelegramWebApp {
  WebApp?: {
    close: () => void;
    expand: () => void;
    ready: () => void;
    showPopup: (params: { title: string; message: string }) => void;
    sendData: (data: string) => void;

    MainButton: {
      isVisible: boolean;
      show: () => void;
      hide: () => void;
      setText: (text: string) => void;
      onClick: (callback: () => void) => void;
    };

    initDataUnsafe?: TelegramWebAppInitData;
    version?: string;
    colorScheme?: string;

    backgroundColor?: string;
    themeParams?: Record<string, string>;
    isExpanded?: boolean;
    viewportHeight?: number;
    viewportStableHeight?: number;
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

  const expandApp = () => {
    tg?.expand();
  };

  return {
    onClose,
    onToggleButton,
    expandApp,
    tg,
    tgUser: tg?.initDataUnsafe?.user,
    queryId: tg?.initDataUnsafe?.query_id,
    tgVersion: tg?.version,
    tgColorScheme: tg?.colorScheme,
  };
}
