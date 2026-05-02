import { create } from 'zustand';
import { getMeCached } from '../lib/me.js';

// Окремий store для профілю зареєстрованого юзера metaphysical-way.academy.
// НЕ персиститься у localStorage — це snapshot з бекенду на час сесії.
//
// Тримається окремо від ігрового store (який синхронізується через
// pole_game_state_v1 → MongoDB) щоб профіль не лип до fullSnapshot
// у БД і не плутав сановані данні гри.
//
// Використання:
//   const firstName = useProfileStore((s) => s.profile?.firstName);
//   const greet = firstName ? `Привіт, ${firstName}` : 'Привіт';
//
//   // Один раз на старті App:
//   useProfileStore.getState().load();
//
// Якщо юзер не у whitelist, гра у localhost-dev, або мережа лежить —
// profile залишається null і UI використовує fallback без імені.

export const useProfileStore = create((set, get) => ({
  profile: null,    // { id, firstName, lastName, email, avatar, birthDay, ... }
  loading: false,
  error: null,

  /** Завантажити профіль з бекенду (один раз — кешується у lib/me.js). */
  async load(opts) {
    if (get().loading || get().profile) return get().profile;
    set({ loading: true, error: null });
    try {
      const profile = await getMeCached(opts);
      set({ profile, loading: false });
      return profile;
    } catch (err) {
      // Тиха помилка — гра має працювати і без профілю.
      // 401/403 = юзер не залогінений / не у whitelist (локальний dev / iframe не на сайті).
      // 500 = мережа / БД — теж граємо без імені.
      set({ error: err.message || 'profile load failed', loading: false });
      return null;
    }
  },

  /** Очистити профіль (рідко потрібно — наприклад при logout у host-app). */
  reset() {
    set({ profile: null, loading: false, error: null });
  },
}));

/** Зручний геттер імені з fallback. */
export function getDisplayName(profile, fallback = '') {
  return profile?.firstName?.trim() || fallback;
}
