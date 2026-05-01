// Правила зчитування простору — генерують точкові питання
// на основі розташування фігур. Це "голос Поля".
// 27 правил з 7 категорій. Helpers: far/close/present/looking — щоб кожне правило ≤4 рядки.

// ───── Утиліти геометрії ─────

export function distance(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isLookingAt(observer, target, tolerance = 60) {
  if (typeof observer.rotation !== 'number') return false;
  const dx = target.x - observer.x;
  const dy = target.y - observer.y;
  const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  const diff = ((observer.rotation - targetAngle + 540) % 360) - 180;
  return Math.abs(diff) < tolerance;
}

const find = (figs, type) => figs.find((f) => f.type === type) || null;
const far = (figs, a, b, t = 280) => {
  const fa = find(figs, a), fb = find(figs, b);
  return fa && fb && distance(fa, fb) > t;
};
const near = (figs, a, b, t = 150) => {
  const fa = find(figs, a), fb = find(figs, b);
  return fa && fb && distance(fa, fb) < t;
};
const present = (figs, ...types) => types.every((t) => !!find(figs, t));
const between = (figs, mid, a, b, t = 100) => {
  const fa = find(figs, a), fb = find(figs, b), fm = find(figs, mid);
  if (!fa || !fb || !fm) return false;
  return distance({ x: (fa.x + fb.x) / 2, y: (fa.y + fb.y) / 2 }, fm) < t;
};

// ───── Правила ─────

export const RULES = [
  // FAMILY
  { id: 'father_far', tag: 'батько',
    when: (f) => far(f, 'self', 'father'),
    message: () => 'Твій тато стоїть далеко. Поле помічає це. Чи знаєш ти чому?' },
  { id: 'mother_far', tag: 'мама',
    when: (f) => far(f, 'self', 'mother'),
    message: () => 'Мама далі ніж серце дозволило б. Що між вами?' },
  { id: 'parents_apart', tag: 'батьки',
    when: (f) => far(f, 'father', 'mother', 250),
    message: () => 'Між батьками — простір. Це нормально. Ти не зобовʼязаний їх поєднати.' },
  { id: 'self_alone', tag: 'я',
    when: (figs) => {
      const self = find(figs, 'self');
      if (!self) return false;
      return figs.filter((x) => x.type !== 'self' && distance(self, x) < 200).length === 0;
    },
    message: () => 'Ти стоїш сам. Ніхто з родини не достатньо близько. Це твій вибір зараз?' },
  { id: 'excluded_present', tag: 'виключений',
    when: (f) => present(f, 'excluded'),
    message: () => 'Виключений сьогодні у полі. Ти його кличеш — і це сміливий акт.' },
  { id: 'excluded_between', tag: 'виключений',
    when: (f) => between(f, 'excluded', 'self', 'father', 80),
    message: () => 'Виключений стоїть між тобою і батьком. Це він тримає рід.' },
  { id: 'self_in_front_of_parent', tag: 'порядок',
    when: (figs) => {
      const self = find(figs, 'self');
      const father = find(figs, 'father'), mother = find(figs, 'mother');
      if (!self) return false;
      return (father && self.y < father.y - 80) || (mother && self.y < mother.y - 80);
    },
    message: () => 'Ти стоїш попереду батьків. Дитина бере на себе батьківську роль. Чи це твоє місце?' },
  { id: 'all_close', tag: 'близькість',
    when: (figs) => {
      if (figs.length < 3) return false;
      const self = find(figs, 'self');
      if (!self) return false;
      return figs.filter((x) => x.type !== 'self' && distance(self, x) < 150).length >= 2;
    },
    message: () => 'Багато близьких поруч. Тебе тримають. Дозволь відчути цю опору.' },
  { id: 'early_dead_facing_away', tag: 'смерть',
    when: (figs) => {
      const ed = find(figs, 'early_dead'), self = find(figs, 'self');
      return ed && self && !isLookingAt(ed, self);
    },
    message: () => 'Той, хто пішов рано, дивиться не на тебе. Він відпускає тебе у життя.' },
  { id: 'grandparent_alone', tag: 'предки',
    when: (figs) => far(figs, 'grandfather', 'father') || far(figs, 'grandmother', 'mother'),
    message: () => 'Між поколіннями розрив. Якась історія не була розказана.' },

  // INNER
  { id: 'ego_in_front_of_soul', tag: 'его',
    when: (figs) => {
      const e = find(figs, 'ego'), s = find(figs, 'soul');
      return e && s && e.y > s.y + 60;
    },
    message: () => 'Его стоїть перед Душею — закриває її від світу. Що боїшся показати?' },
  { id: 'soul_far_from_self', tag: 'душа',
    when: (f) => far(f, 'self', 'soul', 220),
    message: () => 'Душа далеко від Я. Памʼять про себе справжнього чекає.' },
  { id: 'body_far', tag: 'тіло',
    when: (f) => far(f, 'self', 'body', 200),
    message: () => 'Тіло стоїть осторонь. Ти живеш «у голові» — повернись додому.' },
  { id: 'spirit_present', tag: 'дух',
    when: (f) => present(f, 'spirit'),
    message: () => 'Дух у полі. Це не маленька подія — ти кличеш звʼязок з Джерелом.' },
  { id: 'shadow_close', tag: 'тінь',
    when: (f) => near(f, 'self', 'inner_shadow', 150),
    message: () => 'Тінь поруч — це сміливо. Сила в тому що не воюєш, а слухаєш.' },

  // TRIANGLE
  { id: 'karpman_triangle_active', tag: 'трикутник',
    when: (figs) => ['victim', 'persecutor', 'rescuer'].filter((t) => find(figs, t)).length >= 2,
    message: () => 'Трикутник Карпмана активний. Поки ти всередині — енергія тече по колу. Хто з трьох ти?' },
  { id: 'victim_close_to_self', tag: 'жертва',
    when: (f) => near(f, 'self', 'victim', 130),
    message: () => 'Жертва близько до Я. Це твій звичний дім. Що отримуєш від цього стану?' },
  { id: 'executioner_inside', tag: 'палач',
    when: (f) => near(f, 'self', 'executioner', 180),
    message: () => 'Палач — у тобі. Найжорстокіший внутрішній голос. Він захищав колись. Тепер не потрібен.' },
  { id: 'rescuer_in_front', tag: 'рятівник',
    when: (figs) => {
      const r = find(figs, 'rescuer'), self = find(figs, 'self');
      return r && self && r.y < self.y - 60 && Math.abs(r.x - self.x) < 100;
    },
    message: () => 'Рятівник попереду тебе. Ти живеш чужим життям — рятуючи інших від їх шляху.' },

  // SYSTEM + HIGHER + TRANSCENDENT + ENERGY
  { id: 'unrecognized_present', tag: 'непризнаний',
    when: (f) => present(f, 'unrecognized'),
    message: () => 'Непризнаний у полі. Ти кличеш правду яку мовчали. Акт відновлення цілісності.' },
  { id: 'unrecognized_between_parents', tag: 'непризнаний',
    when: (f) => between(f, 'unrecognized', 'father', 'mother', 120),
    message: () => 'Непризнаний стоїть між батьками. Це він тримає шов. Назви — він заслуговує на місце.' },
  { id: 'super_ego_pressing', tag: 'над-я',
    when: (f) => near(f, 'self', 'super_ego', 140),
    message: () => 'Над-Я тисне поруч. Це чужий голос — мами, тата, культури. Чий саме?' },
  { id: 'higher_self_above', tag: 'вище я',
    when: (figs) => {
      const h = find(figs, 'higher_self'), s = find(figs, 'self');
      return h && s && h.y < s.y - 100;
    },
    message: () => 'Вище Я над тобою — здоровий порядок. Слухай — воно знає що далі.' },
  { id: 'creator_far', tag: 'творець',
    when: (f) => far(f, 'self', 'creator', 350),
    message: () => 'Творець далеко. Ти забув звідки прийшов. Подивись угору — Він не пішов нікуди.' },
  { id: 'cause_effect_chain', tag: 'причина',
    when: (f) => present(f, 'cause', 'effect'),
    message: () => 'Причина і Наслідок у полі. Подивись лінію між ними — там твій урок цієї історії.' },
  { id: 'stuck_power_present', tag: 'сила',
    when: (f) => present(f, 'stuck_power'),
    message: () => 'Застрягла сила знайшла голос. Поклади поруч «Рух» — і дозволь течії повернутись.' },
  { id: 'karma_close', tag: 'карма',
    when: (f) => near(f, 'self', 'karma', 180),
    message: () => 'Карма поруч з Я. Щось завершується через тебе. Дозволь — це не покарання, це прохід.' },
  { id: 'dark_forces_present', tag: 'чорні сили',
    when: (f) => present(f, 'dark_forces'),
    message: () => 'Чорні сили у полі. Назвати їх — вже половина зцілення. Поклади поруч «Світлі сили».' },
  { id: 'dark_vs_light', tag: 'баланс',
    when: (f) => present(f, 'dark_forces', 'light_forces'),
    message: () => 'Темне і Світле стоять у полі разом. Це не війна — це порядок. Обидва служать.' },
  { id: 'dead_close_to_self', tag: 'мертві',
    when: (f) => near(f, 'self', 'dead', 160),
    message: () => 'Мертвий поруч з Я. Чию незавершену історію носиш? Час повернути її туди де вона належить.' },
  { id: 'cosmic_influence_present', tag: 'космос',
    when: (f) => present(f, 'cosmic_influence'),
    message: () => 'Космос свідчить — твій момент щось значить більше за побут. Подивись зорі сьогодні вночі.' },
];

// Повертає 3-5 найбільш доречних reading'ів для поточної розстановки.
export function readField(figures) {
  const matching = RULES.filter((r) => {
    try { return r.when(figures); } catch (_) { return false; }
  });
  if (matching.length <= 4) return matching.map(formatReading);
  const shuffled = [...matching].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map(formatReading);
}

function formatReading(rule) {
  return { id: rule.id, tag: rule.tag, message: typeof rule.message === 'function' ? rule.message() : rule.message };
}
