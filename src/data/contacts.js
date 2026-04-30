// Контакти — централізована конфігурація.
// Якщо посилання змінюється — це єдине місце куди треба внести зміни.

export const CONTACTS = {
  academy: {
    label: 'Метафізична Академія',
    handle: 'metaphysical-way.academy',
    url: 'https://metaphysical-way.academy',
    icon: '🎓',
    description: 'Курси, методики, спільнота — повна школа метафізичної роботи',
  },
  instagram: {
    label: 'Instagram',
    handle: '@metaphysical_way',
    url: 'https://instagram.com/metaphysical_way',
    icon: '📷',
    description: 'Щоденні матеріали, практики, теорія',
  },
  telegram_chat: {
    label: 'Спільнота гравців ПОЛЕ',
    handle: 'Telegram-чат · закрита група',
    url: 'https://t.me/+xE6tLBQ81dhkY2M6',
    icon: '👥',
    description: 'Закрита група гравців — підтримка, відкриття, питання, обмін досвідом',
  },
  telegram_personal: {
    label: 'Telegram особистий',
    handle: '@dr_Zayats',
    url: 'https://t.me/dr_Zayats',
    icon: '💬',
    description: 'Прямий зв\'язок з автором курсу — питання, запис на прийом',
  },
};

export const CONTACT_ORDER = [
  'academy',
  'instagram',
  'telegram_chat',
  'telegram_personal',
];
