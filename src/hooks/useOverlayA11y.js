import { useEffect } from 'react';

// A11y hook для overlay-модалок:
//   1. Escape → onClose
//   2. Лочить scroll body поки overlay відкритий
//   3. Повертає focus на елемент-тригер після закриття
//
// Використовуй у будь-якій повноекранній overlay-сцені:
//   useOverlayA11y(onClose);
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

    let prevOverflow = '';
    if (lockScroll && typeof document !== 'undefined') {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (lockScroll && typeof document !== 'undefined') {
        document.body.style.overflow = prevOverflow;
      }
      // Повертаємо focus на тригер
      if (trigger && typeof trigger.focus === 'function') {
        try { trigger.focus(); } catch (_) {}
      }
    };
  }, [onClose, lockScroll, escapable]);
}
