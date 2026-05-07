import { useEffect } from 'react';

// Глобальний стек відкритих overlay-handler'ів.
// ESC викликає тільки TOP-handler — щоб вкладений overlay закривався
// без зачеплення батьківських.
//
// Body locked поки stack непорожній; розблокований коли усі закриті.
// Захищає від race condition коли overlay-й відкриваються/закриваються
// у вільному порядку.

let stack = [];                    // [{ onClose, escapable }]
let savedScroll = null;            // { y, htmlOverflow, bodyOverflow, bodyPosition, bodyTop, bodyWidth }
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

// Бомбостійкий scroll-lock: блокуємо і <html>, і <body>, бо у різних
// браузерах scroll-target різний. Плюс position:fixed на body зберігає
// scroll position — інакше після закриття overlay сторінка стрибає вгору.
function lockBackgroundScroll() {
  const html = document.documentElement;
  const body = document.body;
  savedScroll = {
    y: window.scrollY,
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    bodyPosition: body.style.position,
    bodyTop: body.style.top,
    bodyWidth: body.style.width,
  };
  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${savedScroll.y}px`;
  body.style.width = '100%';
}

function unlockBackgroundScroll() {
  if (!savedScroll) return;
  const html = document.documentElement;
  const body = document.body;
  html.style.overflow = savedScroll.htmlOverflow;
  body.style.overflow = savedScroll.bodyOverflow;
  body.style.position = savedScroll.bodyPosition;
  body.style.top = savedScroll.bodyTop;
  body.style.width = savedScroll.bodyWidth;
  window.scrollTo(0, savedScroll.y);
  savedScroll = null;
}

function pushOverlay(entry) {
  if (typeof document === 'undefined') return;
  if (stack.length === 0) {
    lockBackgroundScroll();
    attachKeyListener();
  }
  stack.push(entry);
}

function popOverlay(entry) {
  if (typeof document === 'undefined') return;
  const idx = stack.lastIndexOf(entry);
  if (idx >= 0) stack.splice(idx, 1);
  if (stack.length === 0) {
    unlockBackgroundScroll();
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
        // preventScroll — інакше focus() сам прокручує сторінку до тригера,
        // перебиваючи window.scrollTo() у unlockBackgroundScroll.
        try { trigger.focus({ preventScroll: true }); } catch (_) {}
      }
    };
  }, [onClose, lockScroll, escapable]);
}
