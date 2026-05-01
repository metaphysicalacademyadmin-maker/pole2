// 9 пелюсток — розширений шлях після завершення 7 рівнів свідомості.
// Кожна пелюстка — окрема сфера життя зі своїм ключем цілісності.
// 3 клітинки на пелюстку = 27 клітинок post-game контенту.

export const PETALS = [
  {
    id: 'i_self', n: 1, name: 'Я', symbol: 'I', color: '#f0c574',
    domain: 'ідентичність · межі · авторство',
    description: 'Хто ти насправді — за межами ролей і очікувань',
    cells: [
      { id: 'i1', title: 'Хто я без ролей',
        question: 'Якщо забрати усі твої ролі (мати/працівник/перед іншими) — хто залишається?',
        options: [
          { text: 'Знаю свою серцевину. Там жива тиша — і я.', depth: 'deep', barometer: 'voice', delta: 3 },
          { text: 'Іноді її чую — в одинокості. Там я.', depth: 'mid', barometer: 'voice', delta: 1 },
          { text: 'Без ролей не знаю хто я. Це лякає.', depth: 'shadow', barometer: 'voice', delta: -2, shadow: 'розлитий' },
        ] },
      { id: 'i2', title: 'Авторство свого життя',
        question: 'Чи живеш ти СВОЄ життя — чи виконуєш сценарій від когось?',
        options: [
          { text: 'Своє. Знаю свій вибір. Беру відповідальність.', depth: 'deep', barometer: 'will', delta: 3 },
          { text: 'Частково. Багато моє — але деінде досі чужий план.', depth: 'mid', barometer: 'will', delta: 1 },
          { text: 'Виконую. Так склалось. Не я це починав.', depth: 'shadow', barometer: 'will', delta: -2, shadow: 'благочестя' },
        ] },
      { id: 'i3', title: 'Самооцінка без оплесків',
        question: 'Чи можеш ти знати свою цінність БЕЗ підтвердження зовні?',
        options: [
          { text: 'Так. Моя цінність — у мені, не у думках про мене.', depth: 'deep', barometer: 'light', delta: 3 },
          { text: 'Дозрів частково. Іноді зриваюсь у потребу схвалення.', depth: 'mid', barometer: 'light', delta: 1 },
          { text: 'Без оплесків я порожній. Це боляче визнавати.', depth: 'shadow', barometer: 'light', delta: -2, shadow: 'розлитий' },
        ] },
    ],
  },
  {
    id: 'ii_body', n: 2, name: 'Тіло', symbol: 'II', color: '#a8c898',
    domain: 'здоров\'я · сексуальність · дозвіл відчувати',
    description: 'Тіло як твій перший дім — і вірний свідок усього',
    cells: [
      { id: 'b1', title: 'Тіло як друг',
        question: 'Чи слухаєш ти тіло — чи проти нього живеш?',
        options: [
          { text: 'Слухаю. Іду за сигналами — голод, втома, бажання.', depth: 'deep', barometer: 'flow', delta: 3 },
          { text: 'Іноді. Коли воно стукає голосно — реагую.', depth: 'mid', barometer: 'flow', delta: 1 },
          { text: 'Я тіло використовую. Воно мені скаржиться болем.', depth: 'shadow', barometer: 'flow', delta: -2, shadow: 'насильство' },
        ] },
      { id: 'b2', title: 'Сексуальність як життя',
        question: 'Чи дозволяєш ти своїй сексуальності бути живою — без сорому?',
        options: [
          { text: 'Так. Це частина мене — як дихання. Без сорому.', depth: 'deep', barometer: 'flow', delta: 3 },
          { text: 'Працюю над цим. Сорому менше, ніж було.', depth: 'mid', barometer: 'flow', delta: 1 },
          { text: 'Сексуальність — заборонена тема. Не моя.', depth: 'shadow', barometer: 'flow', delta: -2, shadow: 'благочестя' },
        ] },
      { id: 'b3', title: 'Енергія як ресурс',
        question: 'Чи знаєш ти свій енергетичний бюджет — і не пробиваєш його?',
        options: [
          { text: 'Знаю. Сплю, відпочиваю, рухаюсь. Тіло як батарейка.', depth: 'deep', barometer: 'root', delta: 3 },
          { text: 'Часто пробиваю — потім відновлююсь. Цикл.', depth: 'mid', barometer: 'root', delta: 1 },
          { text: 'Я живу на 200%. Поки не зламаюсь — не зупиняюсь.', depth: 'shadow', barometer: 'root', delta: -2, shadow: 'насильство' },
        ] },
    ],
  },
  {
    id: 'iii_rod', n: 3, name: 'Рід', symbol: 'III', color: '#e8b0b8',
    domain: 'предки · родові програми · материнська і батьківська лінії',
    description: 'Те, що ти отримав — і що несеш далі. Або повертаєш.',
    cells: [
      { id: 'r1', title: 'Програми роду',
        question: 'Чи знаєш ти, які родові програми у тобі — і які з них вже не твої?',
        options: [
          { text: 'Знаю. Деякі вже повернув — поле розслабилось.', depth: 'deep', barometer: 'will', delta: 3 },
          { text: 'Бачу частково. Моє і чуже досі переплетене.', depth: 'mid', barometer: 'will', delta: 1 },
          { text: 'Ніяких програм. У моєму роді все нормально.', depth: 'shadow', barometer: 'will', delta: -2, shadow: 'засліплення' },
        ] },
      { id: 'r2', title: 'Подяка за життя',
        question: 'Чи можеш ти дякувати батькам — за те що вони ДАЛИ ТОБІ ЖИТТЯ — навіть якщо не дали більше?',
        options: [
          { text: 'Можу. Життя — велике. Інше — їх обмеження.', depth: 'deep', barometer: 'gratitude', delta: 3 },
          { text: 'Працюю над цим. Образа ще тримає.', depth: 'mid', barometer: 'gratitude', delta: 1 },
          { text: 'За що дякувати — за те що мене зламали?', depth: 'shadow', barometer: 'gratitude', delta: -2, shadow: 'гординя' },
        ] },
      { id: 'r3', title: 'Що передаєш далі',
        question: 'Що ти передаєш у рід після себе — як спадок?',
        options: [
          { text: 'Усвідомлю — і обираю свідомо. Передам зцілене.', depth: 'deep', barometer: 'clarity', delta: 3 },
          { text: 'Намагаюсь не повторити батьків — але не завжди вдається.', depth: 'mid', barometer: 'clarity', delta: 1 },
          { text: 'Не думав. Все одно так склалось — нащо думати.', depth: 'shadow', barometer: 'clarity', delta: -2, shadow: 'розлитий' },
        ] },
    ],
  },
  {
    id: 'iv_home', n: 4, name: 'Дім', symbol: 'IV', color: '#9fc8e8',
    domain: 'простір · опора · гроші як земля',
    description: 'Те, на чому ти стоїш — фізично і фінансово',
    cells: [
      { id: 'h1', title: 'Простір як я',
        question: 'Чи відображає твій дім — те, ким ти є?',
        options: [
          { text: 'Так. Дім говорить мене. Я там живу — не існую.', depth: 'deep', barometer: 'root', delta: 3 },
          { text: 'Частково. Деякі куточки — мої. Інші — чужі.', depth: 'mid', barometer: 'root', delta: 1 },
          { text: 'Я в просторі, який мені нав\'язали або який звик.', depth: 'shadow', barometer: 'root', delta: -2, shadow: 'застряг' },
        ] },
      { id: 'h2', title: 'Гроші як земля',
        question: 'Гроші — твоя опора чи постійна тривога?',
        options: [
          { text: 'Опора. Я знаю свої числа. Запас на 3+ міс. Тверда земля.', depth: 'deep', barometer: 'root', delta: 3 },
          { text: 'Працюю — провалююсь у тривогу час від часу.', depth: 'mid', barometer: 'root', delta: 1 },
          { text: 'Тільки не дивитись. Якщо подивлюсь — впаду.', depth: 'shadow', barometer: 'root', delta: -2, shadow: 'застряг' },
        ] },
      { id: 'h3', title: 'Заземлення щодня',
        question: 'Чи маєш ти ритуали які тримають тебе у тілі — щоранку?',
        options: [
          { text: 'Так. Вода, дихання, рух — щодня. Без цього не починаю.', depth: 'deep', barometer: 'root', delta: 3 },
          { text: 'Іноді. Коли тривога — згадую і повертаюсь.', depth: 'mid', barometer: 'root', delta: 1 },
          { text: 'Ритуалів нема. Я в голові цілий день.', depth: 'shadow', barometer: 'root', delta: -2, shadow: 'розлитий' },
        ] },
    ],
  },
  {
    id: 'v_relations', n: 5, name: 'Стосунки', symbol: 'V', color: '#f0a8b8',
    domain: 'партнерство · дружба · прощення · серцеве',
    description: 'Поле між людьми — де ти і інший зустрічаєтесь по-справжньому',
    cells: [
      { id: 's1', title: 'Близькість без розчинення',
        question: 'Чи можеш ти бути близьким — і залишатись собою?',
        options: [
          { text: 'Можу. Я в стосунках — і я ще тут. Дві окремі цілі.', depth: 'deep', barometer: 'love', delta: 3 },
          { text: 'Працюю. Іноді розчиняюсь, повертаюсь.', depth: 'mid', barometer: 'love', delta: 1 },
          { text: 'У близькості я зникаю. Або тримаю дистанцію — щоб не зникнути.', depth: 'shadow', barometer: 'love', delta: -2, shadow: 'розлитий' },
        ] },
      { id: 's2', title: 'Прощення тих хто ранив',
        question: 'Чи прощено всередині — кого ти не міг прощати роками?',
        options: [
          { text: 'Прощено. Не його — себе від цієї ноші. І це звільнило.', depth: 'deep', barometer: 'love', delta: 3 },
          { text: 'Працюю. Образа менша. Вже не пече.', depth: 'mid', barometer: 'love', delta: 1 },
          { text: 'Не прощу. І мені від цього тяжко — але я тримаюсь.', depth: 'shadow', barometer: 'love', delta: -2, shadow: 'застряг' },
        ] },
      { id: 's3', title: 'Бачу іншого як іншого',
        question: 'Чи можеш ти бачити іншу людину НЕ через свої проекції — а такою, яка вона є?',
        options: [
          { text: 'Можу часто. Це найскладніше — але і найцінніше.', depth: 'deep', barometer: 'clarity', delta: 3 },
          { text: 'Іноді. Коли пам\'ятаю про це — бачу.', depth: 'mid', barometer: 'clarity', delta: 1 },
          { text: 'Я бачу тільки своє в інших. Це я давно зрозумів.', depth: 'shadow', barometer: 'clarity', delta: -2, shadow: 'засліплення' },
        ] },
    ],
  },
  {
    id: 'vi_creativity', n: 6, name: 'Творчість', symbol: 'VI', color: '#c9b3e8',
    domain: 'натхнення · потік · дар · гра',
    description: 'Те, що тече з тебе коли ти просто є — без мети',
    cells: [
      { id: 'c1', title: 'Дар як хобі',
        question: 'Чи робиш ти щось РЕГУЛЯРНО — що нікому не потрібно крім тебе?',
        options: [
          { text: 'Так. У мене є практика — лише для мене. Це мій дар.', depth: 'deep', barometer: 'flow', delta: 3 },
          { text: 'Іноді — коли є час. Хочу частіше.', depth: 'mid', barometer: 'flow', delta: 1 },
          { text: 'Творчість — це для тих, хто має на це талант. Не для мене.', depth: 'shadow', barometer: 'flow', delta: -2, shadow: 'застряг' },
        ] },
      { id: 'c2', title: 'Гра без мети',
        question: 'Чи граєшся ти — як дитина, без мети, без оцінки результату?',
        options: [
          { text: 'Часто. Гра — мій спосіб бути живим. Без неї суховію.', depth: 'deep', barometer: 'flow', delta: 3 },
          { text: 'Зрідка. Дозволяю собі — коли ніхто не бачить.', depth: 'mid', barometer: 'flow', delta: 1 },
          { text: 'Грати? Я давно дорослий. Це несерйозно.', depth: 'shadow', barometer: 'flow', delta: -2, shadow: 'благочестя' },
        ] },
      { id: 'c3', title: 'Слухаю натхнення',
        question: 'Коли приходить імпульс творити — ти слухаєш або глушиш?',
        options: [
          { text: 'Слухаю. Зупиняю усе — і йду. Воно дороге.', depth: 'deep', barometer: 'voice', delta: 3 },
          { text: 'Іноді — записую "на потім". Часто потім не повертаюсь.', depth: 'mid', barometer: 'voice', delta: 1 },
          { text: 'Я не помічаю імпульсів. Або вже не довіряю їм.', depth: 'shadow', barometer: 'voice', delta: -2, shadow: 'засліплення' },
        ] },
    ],
  },
  {
    id: 'vii_realization', n: 7, name: 'Реалізація', symbol: 'VII', color: '#f5b870',
    domain: 'місія · голос у світі · своя правда',
    description: 'Як ти йдеш у світ — словом, ділом, дарунком',
    cells: [
      { id: 'rl1', title: 'Моя місія',
        question: 'Чи знаєш ти — для чого ти прийшов? Не "робота", а МІСІЯ.',
        options: [
          { text: 'Знаю. Можу описати у трьох реченнях. Іду цим.', depth: 'deep', barometer: 'clarity', delta: 3 },
          { text: 'Шукаю. Контури проступають — але ще не чітко.', depth: 'mid', barometer: 'clarity', delta: 1 },
          { text: 'Місія — для обраних. Я просто живу.', depth: 'shadow', barometer: 'clarity', delta: -2, shadow: 'засліплення' },
        ] },
      { id: 'rl2', title: 'Голос у світі',
        question: 'Чи говориш ти — те що бачиш — публічно, не лише на кухні?',
        options: [
          { text: 'Так. Маю канал, голос, аудиторію. Кажу.', depth: 'deep', barometer: 'voice', delta: 3 },
          { text: 'Інколи. Боюсь — але роблю. Маленькими кроками.', depth: 'mid', barometer: 'voice', delta: 1 },
          { text: 'Ні. Що я скажу — нічого нового. Світу не треба.', depth: 'shadow', barometer: 'voice', delta: -2, shadow: 'засліплення' },
        ] },
      { id: 'rl3', title: 'Гроші як підтвердження',
        question: 'Чи отримуєш ти від світу адекватну подяку (гроші, увага) — за те, що даєш?',
        options: [
          { text: 'Так. Енергообмін збалансований. Я даю — світ повертає.', depth: 'deep', barometer: 'will', delta: 3 },
          { text: 'Не завжди. Іноді даю забагато безоплатно.', depth: 'mid', barometer: 'will', delta: 1 },
          { text: 'Я даю — ніхто не цінує. Або беру — не вмію віддавати.', depth: 'shadow', barometer: 'will', delta: -2, shadow: 'застряг' },
        ] },
    ],
  },
  {
    id: 'viii_spirit', n: 8, name: 'Духовність', symbol: 'VIII', color: '#a89bd8',
    domain: 'інтуїція · знаки · видіння · віра',
    description: 'Зв\'язок з тим, що більше за тебе — як ти його чуєш',
    cells: [
      { id: 'sp1', title: 'Знаки і синхронності',
        question: 'Чи помічаєш ти знаки — і йдеш за ними?',
        options: [
          { text: 'Так. Поле говорить — я слухаю. Знаки відкривають дороги.', depth: 'deep', barometer: 'clarity', delta: 3 },
          { text: 'Помічаю. Часто сумніваюсь — це знак чи випадковість.', depth: 'mid', barometer: 'clarity', delta: 1 },
          { text: 'Це випадковості. Мозок шукає закономірності де їх нема.', depth: 'shadow', barometer: 'clarity', delta: -2, shadow: 'засліплення' },
        ] },
      { id: 'sp2', title: 'Тиша як практика',
        question: 'Чи маєш ти регулярну тишу — медитацію, мовчання, відключення?',
        options: [
          { text: 'Так. 20+ хвилин щодня. Без цього сходжу з рейок.', depth: 'deep', barometer: 'light', delta: 3 },
          { text: 'Намагаюсь. Час від часу — коли криза.', depth: 'mid', barometer: 'light', delta: 1 },
          { text: 'Тиша мене нервує. Заповнюю звуком, екраном, людьми.', depth: 'shadow', barometer: 'light', delta: -2, shadow: 'втеча' },
        ] },
      { id: 'sp3', title: 'Віра у Більше',
        question: 'Чи довіряєш ти що ЩОСЬ ВЕЛИКЕ за тобою тримає — навіть коли страшно?',
        options: [
          { text: 'Довіряю. Перевірив життям. Я — частина чогось більшого.', depth: 'deep', barometer: 'light', delta: 3 },
          { text: 'Хочу довіряти. Коли спокійно — так. У кризі — забуваю.', depth: 'mid', barometer: 'light', delta: 1 },
          { text: 'Я тримаю себе сам. Якщо вірити — значить здатись.', depth: 'shadow', barometer: 'light', delta: -2, shadow: 'гординя' },
        ] },
    ],
  },
  {
    id: 'ix_unity', n: 9, name: 'Єдність', symbol: 'IX', color: '#ffe7a8',
    domain: 'подяка · здавання · "Я є"',
    description: 'Те, що залишається коли ти перестаєш бути окремим',
    cells: [
      { id: 'u1', title: '"Я є" без додавань',
        question: 'Чи можеш ти СКАЗАТИ внутрішньо "Я є" — і не додати нічого?',
        options: [
          { text: 'Можу. Інколи — це і є правда. Без імен.', depth: 'deep', barometer: 'light', delta: 3 },
          { text: 'У дуже спокійні моменти — так. Тоді все зайве зникає.', depth: 'mid', barometer: 'light', delta: 1 },
          { text: '"Я є" мені нічого не каже. Я — тіло, ім\'я, історія.', depth: 'shadow', barometer: 'light', delta: -2, shadow: 'засліплення' },
        ] },
      { id: 'u2', title: 'Здавання',
        question: 'Чи вмієш ти ЗДАВАТИСЬ — тобто перестати тиснути, дозволити, довіритись?',
        options: [
          { text: 'Вмію. Це і є сила — а не слабкість.', depth: 'deep', barometer: 'light', delta: 3 },
          { text: 'Іноді. Коли вже немає сил — здаюсь і виявляється легше.', depth: 'mid', barometer: 'light', delta: 1 },
          { text: 'Здатись = програти. Я тримаюсь до кінця.', depth: 'shadow', barometer: 'will', delta: -2, shadow: 'гординя' },
        ] },
      { id: 'u3', title: 'Подяка як стан',
        question: 'Чи живеш ти у подяці — як стані, не реакції?',
        options: [
          { text: 'Так. Ранок починається з подяки. Це мій стержень.', depth: 'deep', barometer: 'gratitude', delta: 3 },
          { text: 'Дякую коли все добре. Коли важко — забуваю.', depth: 'mid', barometer: 'gratitude', delta: 1 },
          { text: 'За що дякувати — за те, що могло бути гірше?', depth: 'shadow', barometer: 'gratitude', delta: -2, shadow: 'гординя' },
        ] },
    ],
  },
];

export function findPetal(id) {
  return PETALS.find((p) => p.id === id) || null;
}
