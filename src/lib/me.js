// Клієнтська обгортка для отримання профілю поточного юзера.
// Бекенд: metaphysical-way2 → GET /api/games/<slug>/me
// Auth: автоматично через cookie сесії (гра у iframe на тому ж домені).
// Slug визначається з URL автоматично.
//
// Деталі — у CLAUDE.md → секція «👤 Профіль юзера».

// Визначення slug:
// Гра рендериться через <iframe srcDoc> на metaphysical-way.academy/<slug>.
// У srcdoc-iframe `window.location.pathname` === "/srcdoc" (бо документ
// — about:srcdoc), і простий `split('/')[0]` дає "srcdoc" замість справжнього
// slug. srcdoc-iframe успадковує origin парента, тому `window.parent.location`
// доступний без CORS-помилки.
const detectSlug = () => {
  if (typeof window === "undefined") return "";
  // Спершу — pathname парент-сторінки (працює всередині srcdoc iframe).
  try {
    if (window.parent && window.parent !== window) {
      const parentPath = window.parent.location?.pathname;
      if (parentPath) {
        const seg = parentPath.split("/").filter(Boolean)[0];
        if (seg && seg !== "srcdoc") return seg;
      }
    }
  } catch {
    // Cross-origin block — рідкісний випадок (наприклад вбудовано на іншому
    // домені). Падаємо на власний location.
  }
  // Fallback: власний location (для standalone preview build:embed → file://).
  const seg = window.location.pathname.split("/").filter(Boolean)[0];
  if (seg && seg !== "srcdoc") return seg;
  return "";
};

/**
 * Отримати профіль поточного юзера.
 *
 * @param {Object} [opts]
 * @param {string[]} [opts.include] — додаткові секції:
 *   'group'                 — навч. група + tariff + курс
 *   'channels'              — куплені/отримані канали
 *   'wishlistChannels'      — канали у вибраному
 *   'recommendedChannels'   — канали які викладач порадив
 *   'completedTopics'       — пройдені теми
 *   'bio'                   — вільний текст «про себе»
 * @param {string} [opts.slug] — необов'язково, за замовчуванням з URL
 *
 * @returns {Promise<{
 *   id: string, firstName: string, lastName: string, email: string,
 *   avatar: string|null, roles: string[],
 *   birthDay?: number, birthMonth?: number, birthYear?: number,
 *   telegram?: string, city?: string, country?: string, profession?: string,
 *   studentSince?: string, registeredAt?: string,
 *   bio?: string,
 *   learningGroup?: { id, name, courseName, tariff } | null,
 *   additionalGroups?: { id, name }[],
 *   ownedChannels?: { id, name, summary }[],
 *   wishlistChannels?: { id, name, summary }[],
 *   recommendedChannels?: { id, name, summary }[],
 *   completedTopics?: { id, title, slug, contextType }[]
 * }>}
 *
 * @example
 *   const me = await getMe();
 *   greet(`Привіт, ${me.firstName}!`);
 *
 * @example
 *   const me = await getMe({ include: ['group', 'completedTopics'] });
 *   if (me.learningGroup?.courseName) showCourse(me.learningGroup.courseName);
 *   const passed = me.completedTopics.length;
 *
 * @throws {Error} err.status === 401 (no session) | 403 (not whitelisted)
 *                 | 404 (slug not found) | 500
 */
export async function getMe({ include, slug } = {}) {
  const realSlug = slug || detectSlug();
  if (!realSlug) {
    throw new Error("Cannot determine game slug from URL");
  }
  const qs = include?.length ? `?include=${encodeURIComponent(include.join(","))}` : "";
  const res = await fetch(`/api/games/${encodeURIComponent(realSlug)}/me${qs}`, {
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || `me failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/**
 * Кешований варіант — щоб не ходити на бекенд на кожен виклик.
 * Кешує по ключу include-set; за тим самим набором повертає той самий profile.
 */
const _cache = new Map();
export async function getMeCached(opts = {}) {
  const key = (opts.include || []).slice().sort().join(",");
  if (_cache.has(key)) return _cache.get(key);
  const promise = getMe(opts);
  _cache.set(key, promise);
  try {
    return await promise;
  } catch (err) {
    _cache.delete(key); // не кешуй помилки
    throw err;
  }
}

/**
 * Скинь кеш — наприклад, після того як юзер змінив профіль у головному
 * додатку і повернувся у гру (рідко потрібно).
 */
export function clearMeCache() {
  _cache.clear();
}
