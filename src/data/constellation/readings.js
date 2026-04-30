// Правила зчитування простору — генерують точкові питання
// на основі розташування фігур. Це "голос Поля".
//
// Кожне правило: {when: (figures) => boolean, message: (figures) => string, tag: string}

const FIELD_CENTER = { x: 300, y: 300 };
const FIELD_RADIUS = 250;

// ───── Утиліти геометрії ─────

export function distance(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isLookingAt(observer, target, tolerance = 60) {
  // Чи дивиться observer у напрямку target?
  // observer.rotation — кут (deg), 0 = вгору, 180 = вниз.
  if (typeof observer.rotation !== 'number') return false;
  const dx = target.x - observer.x;
  const dy = target.y - observer.y;
  const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  const diff = ((observer.rotation - targetAngle + 540) % 360) - 180;
  return Math.abs(diff) < tolerance;
}

function findFigure(figures, type) {
  return figures.find((f) => f.type === type) || null;
}

// ───── Правила ─────

export const RULES = [
  {
    id: 'father_far',
    tag: 'батько',
    when: (figs) => {
      const self = findFigure(figs, 'self');
      const father = findFigure(figs, 'father');
      return self && father && distance(self, father) > 280;
    },
    message: () => 'Твій тато стоїть далеко. Поле помічає це. Чи знаєш ти чому?',
  },
  {
    id: 'mother_far',
    tag: 'мама',
    when: (figs) => {
      const self = findFigure(figs, 'self');
      const mother = findFigure(figs, 'mother');
      return self && mother && distance(self, mother) > 280;
    },
    message: () => 'Мама далі ніж серце дозволило б. Що між вами?',
  },
  {
    id: 'parents_apart',
    tag: 'батьки',
    when: (figs) => {
      const f = findFigure(figs, 'father');
      const m = findFigure(figs, 'mother');
      return f && m && distance(f, m) > 250;
    },
    message: () => 'Між батьками — простір. Це нормально. Ти не зобовʼязаний їх поєднати.',
  },
  {
    id: 'self_alone',
    tag: 'я',
    when: (figs) => {
      const self = findFigure(figs, 'self');
      if (!self) return false;
      return figs.filter((f) => f.type !== 'self' && distance(self, f) < 200).length === 0;
    },
    message: () => 'Ти стоїш сам. Ніхто з родини не достатньо близько щоб торкнутись. Це твій вибір зараз?',
  },
  {
    id: 'excluded_present',
    tag: 'виключений',
    when: (figs) => !!findFigure(figs, 'excluded'),
    message: () => 'Виключений сьогодні у полі. Ти його кличеш — і це сміливий акт.',
  },
  {
    id: 'excluded_between',
    tag: 'виключений',
    when: (figs) => {
      const self = findFigure(figs, 'self');
      const father = findFigure(figs, 'father');
      const ex = findFigure(figs, 'excluded');
      if (!self || !father || !ex) return false;
      // ex розміщений між self і father?
      const midX = (self.x + father.x) / 2;
      const midY = (self.y + father.y) / 2;
      return distance({ x: midX, y: midY }, ex) < 80;
    },
    message: () => 'Виключений стоїть між тобою і батьком. Це він тримає рід — навіть невидимо.',
  },
  {
    id: 'self_in_front_of_parent',
    tag: 'порядок',
    when: (figs) => {
      const self = findFigure(figs, 'self');
      const father = findFigure(figs, 'father');
      const mother = findFigure(figs, 'mother');
      if (!self) return false;
      const before = (parent) => parent && self.y < parent.y - 80;
      return before(father) || before(mother);
    },
    message: () => 'Ти стоїш попереду батьків. Інколи дитина бере на себе батьківську роль. Чи це твоє місце?',
  },
  {
    id: 'all_close',
    tag: 'близькість',
    when: (figs) => {
      if (figs.length < 3) return false;
      const self = findFigure(figs, 'self');
      if (!self) return false;
      const close = figs.filter((f) => f.type !== 'self' && distance(self, f) < 150);
      return close.length >= 2;
    },
    message: () => 'Багато близьких поруч. Тебе тримають. Дозволь відчути цю опору.',
  },
  {
    id: 'early_dead_facing_away',
    tag: 'смерть',
    when: (figs) => {
      const ed = findFigure(figs, 'early_dead');
      const self = findFigure(figs, 'self');
      return ed && self && !isLookingAt(ed, self);
    },
    message: () => 'Той, хто пішов рано, дивиться не на тебе. Він відпускає тебе у життя — це його дар.',
  },
  {
    id: 'grandparent_alone',
    tag: 'предки',
    when: (figs) => {
      const gf = findFigure(figs, 'grandfather');
      const gm = findFigure(figs, 'grandmother');
      const father = findFigure(figs, 'father');
      const mother = findFigure(figs, 'mother');
      if (gf && father && distance(gf, father) > 280) return true;
      if (gm && mother && distance(gm, mother) > 280) return true;
      return false;
    },
    message: () => 'Між поколіннями розрив. Якась історія не була розказана. Чи знаєш яка?',
  },
];

// Повертає 3-5 найбільш доречних reading'ів для поточної розстановки.
export function readField(figures) {
  const matching = RULES.filter((r) => {
    try { return r.when(figures); } catch (_) { return false; }
  });
  if (matching.length <= 4) return matching.map(formatReading);
  // Якщо багато — беремо рандомну вибірку 4
  const shuffled = [...matching].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map(formatReading);
}

function formatReading(rule) {
  return { id: rule.id, tag: rule.tag, message: typeof rule.message === 'function' ? rule.message() : rule.message };
}
