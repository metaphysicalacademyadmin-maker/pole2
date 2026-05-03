import { useEffect } from 'react';

// Глобальний лічильник відкритих overlay'їв.
// Body locked коли counter > 0; розблокований коли усі закриті.
// Захищає від race condition коли overlay-й відкриваються/закриваються
// у вільному порядку — body не застрягає у hidden.
let overlayCounter = 0;
let originalBodyOverflow = '';

function lockBody() {
  if (typeof document === 'undefined') return;
  if (overlayCounter === 0) {
    originalBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
  }
  overlayCounter += 1;
}

function unlockBody() {
  if (typeof document === 'undefined') return;
  overlayCounter = Math.max(0, overlayCounter - 1);
  if (overlayCounter === 0) {
    document.body.style.overflow = originalBodyOverflow;
  }
}

// A11y hook для overlay-модалок:
//   1. Escape → onClose (можна вимкнути через options.escapable=false)
//   2. Лочить scroll body поки overlay відкритий (з захистом від race conditions)
//   3. Повертає focus на елемент-тригер після закриття
export function useOverlayA11y(onClose, options = {}) {
  const { lockScroll = true, escapable = true } = options;

  useEffect(() => {
    const trigger = typeof document !== 'undefined' ? document.activeElement : null;

    function onKeyDown(e) {
      if (escapable && e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    if (lockScroll) lockBody();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (lockScroll) unlockBody();
      // Повертаємо focus на тригер
      if (trigger && typeof trigger.focus === 'function') {
        try { trigger.focus(); } catch (_) {}
      }
    };
  }, [onClose, lockScroll, escapable]);
}
