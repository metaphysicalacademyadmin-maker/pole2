// 9 секцій Книги Душі. Кожна — окремий компонент-блок.
// Дані передаються одним об'єктом data з SoulBook/index.jsx.

function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('uk-UA', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function barometerTier(v) {
  if (v >= 7) return 'інтегрований';
  if (v >= 3) return 'здоровий';
  if (v >= 0) return 'нейтральний';
  if (v >= -3) return 'застій';
  if (v >= -7) return 'тінь активна';
  return 'критичний';
}

export default function SoulBookSections({ data }) {
  return (
    <>
      <Cover data={data} />
      <PathStats data={data} />
      <KeysSection data={data} />
      <BarometersSection data={data} />
      <ArchetypeSection data={data} />
      <ShadowSection data={data} />
      <AuraSection data={data} />
      <CustomAnswersSection data={data} />
      <Closing data={data} />
    </>
  );
}

function Cover({ data }) {
  return (
    <section className="sb-section sb-cover">
      <div className="sb-cover-eyebrow">ПОЛЕ · Втілення</div>
      <h1 className="sb-cover-title">Книга Душі</h1>
      <div className="sb-cover-sub">— шлях, який ти пройшов через себе —</div>
      {data.intention && (
        <div className="sb-cover-intention">
          <div className="sb-label">намір з якого почалось</div>
          «{data.intention}»
        </div>
      )}
      <div className="sb-cover-date">
        {fmtDate(data.startedAt)} → {fmtDate(data.finishedAt)}
      </div>
      {data.sessionId && <div className="sb-cover-session">сесія · {data.sessionId.slice(0, 12)}</div>}
    </section>
  );
}

function PathStats({ data }) {
  return (
    <section className="sb-section">
      <h2 className="sb-h2">Шлях</h2>
      <div className="sb-stats-grid">
        <Stat n={data.completedLevels.length} label="рівнів пройдено" />
        <Stat n={data.cellsAnswered} label="клітинок" />
        <Stat n={data.customCount} label="своїх відповідей" />
        <Stat n={data.shadowAnswers} label="тіньових" />
        <Stat n={data.practiceCompletions.length} label="практик" />
        <Stat n={data.channelsUnlocked.length} label="каналів" />
      </div>
      <div className="sb-pathmode">
        Режим: <strong>{data.pathMode === 'touch' ? '◌ Дотик' : data.pathMode === 'path' ? '✦ Шлях' : '◉ Глибина'}</strong>
      </div>
      {data.evolutionEcho && (
        <div className="sb-echo">
          <div className="sb-label">ехо попередньої сесії</div>
          Раніше ти приходив з наміром «{data.evolutionEcho.previousIntention}». Пройшов {data.evolutionEcho.previousLevelsCompleted} рівнів.
        </div>
      )}
    </section>
  );
}

function KeysSection({ data }) {
  const keys = data.completedLevels.map((n) => ({ n, text: data.levelKeys[n] })).filter((k) => k.text);
  if (keys.length === 0) return null;
  return (
    <section className="sb-section">
      <h2 className="sb-h2">Сім ключів — твоїх</h2>
      <div className="sb-subhead">формули, з якими ти виходиш</div>
      <div className="sb-keys">
        {keys.map(({ n, text }) => (
          <div key={n} className="sb-key">
            <span className="sb-key-num">{n}</span>
            <span className="sb-key-text">«{text}»</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BarometersSection({ data }) {
  return (
    <section className="sb-section">
      <h2 className="sb-h2">Барометри · фінальний зріз</h2>
      <table className="sb-table">
        <tbody>
          {data.barometers.map((b) => {
            const v = data.resources[b.key] || 0;
            const tier = barometerTier(v);
            return (
              <tr key={b.key} className={v < 0 ? 'sb-row-shadow' : v >= 7 ? 'sb-row-strong' : ''}>
                <td className="sb-bar-name">{b.name}</td>
                <td className="sb-bar-val">{v > 0 ? `+${v}` : v}</td>
                <td className="sb-bar-tier">{tier}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function ArchetypeSection({ data }) {
  if (!data.archetype && !data.suggested) return null;
  return (
    <section className="sb-section">
      <h2 className="sb-h2">Архетип</h2>
      {data.archetype ? (
        <div className="sb-archetype">
          <div className="sb-archetype-symbol" style={{ color: data.archetype.color }}>{data.archetype.symbol}</div>
          <div className="sb-archetype-name">{data.archetype.name}</div>
          <div className="sb-archetype-desc">{data.archetype.description}</div>
          {data.suggested && data.suggested.id !== data.archetype.id && (
            <div className="sb-archetype-meta">
              Поле спершу побачило в тобі <strong>{data.suggested.name}</strong> — а ти впізнав себе іншим. Це теж шлях.
            </div>
          )}
        </div>
      ) : (
        <div className="sb-archetype-skipped">Калібровку було пропущено. Поле побачило {data.suggested?.name}.</div>
      )}
    </section>
  );
}

function ShadowSection({ data }) {
  if (data.snakePenalties.length === 0 && data.shadowMirrors.length === 0 && data.shadowAnswers === 0) return null;
  const cats = {};
  for (const m of data.shadowMirrors) cats[m.label] = (cats[m.label] || 0) + 1;
  return (
    <section className="sb-section">
      <h2 className="sb-h2">Тінь · що проявилось</h2>
      <div className="sb-shadow-grid">
        <Stat n={data.shadowAnswers} label="тіньових виборів" />
        <Stat n={data.snakePenalties.length} label="snake-зустрічей" />
        <Stat n={data.shadowSeen} label="дзеркало побачено" />
      </div>
      {Object.keys(cats).length > 0 && (
        <div className="sb-shadow-cats">
          <div className="sb-label">категорії тіні</div>
          {Object.entries(cats).map(([label, n]) => (
            <span key={label} className="sb-shadow-tag">{label} · {n}</span>
          ))}
        </div>
      )}
    </section>
  );
}

function AuraSection({ data }) {
  if (data.aura.count === 0) return null;
  const delta = data.aura.avgAfter - data.aura.avgBefore;
  return (
    <section className="sb-section">
      <h2 className="sb-h2">Аура · вимірювання</h2>
      <div className="sb-aura-numbers">
        <div className="sb-aura-num"><strong>{data.aura.count}</strong> вимірювань</div>
        <div className="sb-aura-num"><strong>{data.aura.avgBefore}</strong>см → <strong>{data.aura.avgAfter}</strong>см</div>
        <div className="sb-aura-num">Δ <strong>{delta > 0 ? '+' : ''}{delta}</strong>см середнє</div>
        <div className="sb-aura-num">найбільший приріст: <strong>+{data.aura.biggestGrowth}</strong>см</div>
      </div>
      {data.aura.keywords.length > 0 && (
        <div className="sb-aura-keywords">
          <div className="sb-label">ключові слова що приходили</div>
          {data.aura.keywords.slice(-12).map((k, i) => (
            <span key={i} className="sb-aura-keyword">{k}</span>
          ))}
        </div>
      )}
    </section>
  );
}

function CustomAnswersSection({ data }) {
  if (data.customAnswers.length === 0) return null;
  return (
    <section className="sb-section">
      <h2 className="sb-h2">Свої слова</h2>
      <div className="sb-subhead">найглибше — те що ти сказав сам</div>
      {data.customAnswers.map((a, i) => (
        <blockquote key={i} className="sb-quote">
          {a.text}
          <div className="sb-quote-meta">— {a.barometer}</div>
        </blockquote>
      ))}
    </section>
  );
}

function Closing({ data }) {
  return (
    <section className="sb-section sb-closing">
      <div className="sb-closing-quote">
        Джерело нікуди не ділось.<br />
        Воно завжди тут.<br />
        Питання тільки в тому — <em>чи ти тут</em>.
      </div>
      <div className="sb-closing-attr">— Поле, що побачило тебе</div>
    </section>
  );
}

function Stat({ n, label }) {
  return (
    <div className="sb-stat">
      <div className="sb-stat-num">{n}</div>
      <div className="sb-stat-label">{label}</div>
    </div>
  );
}
