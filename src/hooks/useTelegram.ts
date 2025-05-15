const tg = window?.Telegram?.WebApp;

export function useTelegram() {
    const onClose = () => {
        tg.close()
    }

    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }

    return {
        onClose,
        onToggleButton,
        tg,
        tgUser: tg?.initDataUnsafe?.user,
        queryId: tg?.initDataUnsafe?.query_id,
        tgVersion: tg?.version,
        tgColorScheme: tg?.colorScheme,
    }
}