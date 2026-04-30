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
  telegram_personal: {
    label: 'Telegram (особисто)',
    handle: '@dr_Zayats',
    url: 'https://t.me/dr_Zayats',
    icon: '✈',
    description: 'Особистий контакт автора курсу',
  },
  telegram_chat: {
    label: 'Чат гравців',
    handle: 'Спільнота Поля',
    url: 'https://t.me/+xE6tLBQ81dhkY2M6',
    icon: '💬',
    description: 'Чат тих хто йде через Поле — підтримка, відкриття, питання',
  },
  appointment: {
    label: 'Записатись на прийом',
    handle: 'консультація з автором',
    url: 'https://t.me/dr_Zayats',
    icon: '🪷',
    description: 'Особистий розбір через метафізичну Академію',
  },
};

export const CONTACT_ORDER = [
  'academy',
  'instagram',
  'telegram_chat',
  'telegram_personal',
  'appointment',
];
