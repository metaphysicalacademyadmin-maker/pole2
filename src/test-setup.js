import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Прибираємо DOM між тестами, щоб не лишалось залишків модалок.
afterEach(() => {
  cleanup();
});
