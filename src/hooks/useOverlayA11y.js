import { useEffect } from 'react';

// Глобальний стек відкритих overlay-handler'ів.
// ESC викликає тільки TOP-handler — щоб вкладений overlay закривався
// без зачеплення батьківських.
//
// Body locked поки stack непорожній; розблокований коли усі закриті.
// Захищає від race condition коли overlay-й відкриваються/закриваються
// у вільному порядку.

let stack = [];                    // [{ onClose, escapable }]
let originalBodyOverflow = '';
let keyListenerAttached = false;

function onGlobalKeyDown(e) {
  if (e.key !== 'Escape') return;
  const top = stack[stack.length - 1];
  if (top && top.escapable) {
    e.preventDefault();
    top.onClose?.();
  }
}

function attachKeyListener() {
  if (keyListenerAttached || typeof window === 'undefined') return;
  window.addEventListener('keydown', onGlobalKeyDown);
  keyListenerAttached = true;
}

function detachKeyListener() {
  if (!keyListenerAttached || typeof window === 'undefined') return;
  window.removeEventListener('keydown', onGlobalKeyDown);
  keyListenerAttached = false;
}

function pushOverlay(entry) {
  if (typeof document === 'undefined') return;
  if (stack.length === 0) {
    originalBodyOverflow = document.body.style.overflow || '';
    document.body.style.overflow = 'hidden';
    attachKeyListener();
  }
  stack.push(entry);
}

function popOverlay(entry) {
  if (typeof document === 'undefined') return;
  const idx = stack.lastIndexOf(entry);
  if (idx >= 0) stack.splice(idx, 1);
  if (stack.length === 0) {
    document.body.style.overflow = originalBodyOverflow;
    detachKeyListener();
  }
}

// A11y hook для overlay-модалок:
//   1. Escape → onClose (тільки top-most overlay)
//   2. Лочить scroll body поки відкрито хоч один overlay
//   3. Повертає focus на елемент-тригер після закриття
export function useOverlayA11y(onClose, options = {}) {
  const { lockScroll = true, escapable = true } = options;

  useEffect(() => {
    const trigger = typeof document !== 'undefined' ? document.activeElement : null;
    const entry = { onClose, escapable };

    if (lockScroll) pushOverlay(entry);
    else if (escapable) {
      // Без lockScroll — все одно треба пушити для коректного ESC-стеку
      pushOverlay(entry);
    }

    return () => {
      popOverlay(entry);
      if (trigger && typeof trigger.focus === 'function') {
        try { trigger.focus(); } catch (_) {}
      }
    };
  }, [onClose, lockScroll, escapable]);
}
