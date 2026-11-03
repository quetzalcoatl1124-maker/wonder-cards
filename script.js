/* ==========================================
   データ定義: 結果タイプ (6種)
   ========================================== */
const RESULTS = [
  {
    id: "creator",
    title: "アイデア創造クリエイター",
    icon: "🎨",
    desc: "ゼロから新しいものを考えたり、自由に表現することが大好きなタイプ！独自の視点でみんなを驚かせます。",
    action: "ノートに自由にアイデアスケッチを描いてみよう！"
  },
  {
    id: "analyst",
    title: "ひらめきロジック探偵",
    icon: "🔍",
    desc: "「なぜ？」「どうして？」を追求するのが得意なタイプ。複雑なパズルや仕掛けの解明にワクワクします。",
    action: "身近な機械やアプリの仕組みを調べてみよう！"
  },
  {
    id: "supporter",
    title: "みんなの絆キャプテン",
    icon: "🤝",
    desc: "人の気持ちに寄り添い、チームの雰囲気を明るくするのが得意なタイプ。みんなで協力する場面で力を発揮します。",
    action: "友達の悩みをじっくり聞いてアドバイスしてみよう！"
  },
  {
    id: "adventurer",
    title: "未知へ飛び込むチャレンジャー",
    icon: "🚀",
    desc: "食べたことのない料理や行ったことのない場所など、新しい体験への好奇心が旺盛な行動派タイプ！",
    action: "通ったことのない道を散歩してみよう！"
  },
  {
    id: "strategist",
    title: "未来を見通すマスターガイド",
    icon: "🧩",
    desc: "計画を立てたり、全体をまとめて効率よく進めることが上手なタイプ。ゲームの攻略も得意！",
    action: "1週間のわくわく計画表を作ってみよう！"
  },
  {
    id: "storyteller",
    title: "世界観をつむぐストーリーテラー",
    icon: "📚",
    desc: "物語や言葉、音楽などの世界に入り込み、豊かで深い感性を持つタイプ。独自の感情表現が魅力です。",
    action: "お気に入りの本や映画のレビューを書いてみよう！"
  }
];

/* ==========================================
   データ定義: 質問リスト (5問)
   ========================================== */
const QUESTIONS = [
  {
    q: "休日、突然自由な時間が1日できたらどうする？",
    options: [
      { text: "絵を描いたり、モノづくりをする", score: { creator: 2, storyteller: 1 } },
      { text: "読んだことのない本や動画で調べる", score: { analyst: 2, adventurer: 1 } },
      { text: "友達を誘って遊ぶ", score: { supporter: 2, adventurer: 1 } },
      { text: "1日のスケジュールを立てて効率よく過ごす", score: { strategist: 2, analyst: 1 } }
    ]
  },
  {
    q: "文化祭でクラスの出し物を決めるとき、やりたい役割は？",
    options: [
      { text: "看板や衣装のデザインを作る", score: { creator: 2 } },
      { text: "全体をまとめたり進行を管理する", score: { strategist: 2, supporter: 1 } },
      { text: "面白い企画のアイデアをどんどん出す", score: { adventurer: 2, creator: 1 } },
      { text: "劇の台本やBGMを考える", score: { storyteller: 2 } }
    ]
  },
  {
    q: "目の前に見たことのない「謎の箱」があります。どうする？",
    options: [
      { text: "仕組みを観察して開け方を論理的に考える", score: { analyst: 2 } },
      { text: "すぐに開けて中身を確かめてみる", score: { adventurer: 2 } },
      { text: "どんな宝物が入っているか想像を楽しむ", score: { storyteller: 2, creator: 1 } },
      { text: "周りの人と一緒に開ける相談をする", score: { supporter: 2 } }
    ]
  },
  {
    q: "ゲームをするときに一番楽しいと感じる瞬間は？",
    options: [
      { text: "オリジナルキャラや街を自由に作成するとき", score: { creator: 2 } },
      { text: "難解な謎解きやパズルをクリアしたとき", score: { analyst: 2 } },
      { text: "友達とマルチプレイで盛り上がるとき", score: { supporter: 2 } },
      { text: "広大なマップを冒険・探検するとき", score: { adventurer: 2, strategist: 1 } }
    ]
  },
  {
    // 5問目: スライダー専用質問 (仕掛け⑧)
    type: "slider",
    q: "何か新しい挑戦をするとき、「直感・ひらめき」と「じっくり計画」、どちらを重視する？",
    minText: "100% 直感・ひらめき！",
    maxText: "100% じっくり計画！"
  }
];

/* アプリの状態管理変数 */
let currentQuestionIndex = 0;
let scores = {};
let isFlipped = false;
let unlockedCards = [];

/* ==========================================
   初期化処理
   ========================================== */
window.addEventListener('DOMContentLoaded', () => {
  loadCollection();
  initScores();
});

function initScores() {
  scores = { creator: 0, analyst: 0, supporter: 0, adventurer: 0, strategist: 0, storyteller: 0 };
}

/* ==========================================
   画面切替処理
   ========================================== */
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

/* ==========================================
   仕掛け⑥: テーマカラー変更
   ========================================== */
function setTheme(theme) {
  if (theme === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

/* ==========================================
   クイズ進行処理
   ========================================== */
function startQuiz() {
  currentQuestionIndex = 0;
  initScores();
  showScreen('screen-quiz');
  renderQuestion();
}

function renderQuestion() {
  const qData = QUESTIONS[currentQuestionIndex];
  
  // プログレスバーの更新 (仕掛け②: 進み具合が見える)
  const progressPercent = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  document.getElementById('progress-bar').style.width = progressPercent + '%';
  document.getElementById('progress-num').textContent = `質問 ${currentQuestionIndex + 1} / ${QUESTIONS.length}`;

  const container = document.getElementById('quiz-content');

  // スライダー質問の判定
  if (qData.type === 'slider') {
    container.innerHTML = `
      <h3 class="question-title">${qData.q}</h3>
      <div class="slider-box" id="slider-bg">
        <div id="slider-icon" class="slider-preview-icon">⚡</div>
        <input type="range" min="0" max="100" value="50" class="custom-slider" id="interactive-slider" oninput="handleSliderChange(this.value)">
        <div class="slider-labels">
          <span>${qData.minText}</span>
          <span>${qData.maxText}</span>
        </div>
      </div>
      <button class="btn" style="width: 100%; margin-top: 16px;" onclick="selectSliderAnswer()">この感覚で決定！</button>
    `;
  } else {
    // 通常の選択肢質問
    let optionsHtml = qData.options.map((opt, idx) => `
      <button class="option-btn" onclick="selectOption(${idx})">
        <span>${opt.text}</span>
        <span style="color: var(--primary);">➔</span>
      </button>
    `).join('');

    container.innerHTML = `
      <h3 class="question-title">${qData.q}</h3>
      <div class="options-grid">${optionsHtml}</div>
    `;
  }
}

/* 通常選択肢の選択処理 (仕掛け①: 反応する) */
function selectOption(optionIndex) {
  const qData = QUESTIONS[currentQuestionIndex];
  const selected = qData.options[optionIndex];

  // スコアの加算
  for (let key in selected.score) {
    scores[key] += selected.score[key];
  }

  nextQuestion();
}

/* 仕掛け⑧: スライダー連動アニメーション */
function handleSliderChange(val) {
  const icon = document.getElementById('slider-icon');
  const box = document.getElementById('slider-bg');
  
  // スライダーの値に応じてアイコンサイズと回転、背景色を動的に変化させる
  const scale = 0.8 + (val / 100) * 0.6;
  const rotate = (val - 50) * 0.6;
  icon.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
  
  if (val < 50) {
    icon.textContent = "⚡"; // 直感
    box.style.background = `rgba(20, 184, 166, ${0.1 + (50 - val)/100})`;
  } else {
    icon.textContent = "📐"; // 計画
    box.style.background = `rgba(139, 92, 246, ${0.1 + (val - 50)/100})`;
  }
}

function selectSliderAnswer() {
  const val = parseInt(document.getElementById('interactive-slider').value);
  if (val < 50) {
    scores.adventurer += 2;
    scores.creator += 1;
  } else {
    scores.strategist += 2;
    scores.analyst += 1;
  }
  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

/* ==========================================
   結果計算 & カード表示 (仕掛け④ & ③)
   ========================================== */
function showResult() {
  // 一番高いスコアのタイプを特定
  let maxScore = -1;
  let winnerId = "creator";

  for (let key in scores) {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      winnerId = key;
    }
  }

  const resultData = RESULTS.find(r => r.id === winnerId) || RESULTS[0];

  // カード表面のデータをセット
  document.getElementById('res-icon').textContent = resultData.icon;
  document.getElementById('res-title').textContent = resultData.title;
  document.getElementById('res-desc').textContent = resultData.desc;
  document.getElementById('res-action').textContent = "おすすめ: " + resultData.action;

  // カードを裏面状態に戻して画面遷移
  isFlipped = false;
  document.getElementById('card-inner').classList.remove('flipped');
  showScreen('screen-result');

  // カード獲得保存 (仕掛け⑦: 変化が積み重なる)
  saveCardToCollection(resultData.id);
}

/* カードをめくる（仕掛け④: 予想・発見 & 仕掛け③: 達成を祝う） */
function flipCard() {
  if (isFlipped) return;
  isFlipped = true;

  document.getElementById('card-inner').classList.add('flipped');

  // カードが開示されたタイミングで紙吹雪エフェクト発生
  setTimeout(() => {
    launchConfetti();
  }, 300);
}

/* ==========================================
   仕掛け③: 達成を祝う 紙吹雪アニメーション
   ========================================== */
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const particles = [];
  const colors = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ec4899'];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.7) * 12,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // 重力
      p.rotation += p.vRot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (particles[0].y < canvas.height + 50) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

/* ==========================================
   仕掛け⑦: localStorageによるコレクションデータ保存
   ========================================== */
function loadCollection() {
  try {
    const saved = localStorage.getItem('wonder_cards_collection');
    if (saved) {
      unlockedCards = JSON.parse(saved);
    }
  } catch (e) {
    console.error('localStorage access failed:', e);
  }
}

function saveCardToCollection(cardId) {
  if (!unlockedCards.includes(cardId)) {
    unlockedCards.push(cardId);
    try {
      localStorage.setItem('wonder_cards_collection', JSON.stringify(unlockedCards));
    } catch (e) {
      console.error('localStorage save failed:', e);
    }
  }
}

/* ==========================================
   コレクション画面表示 (仕掛け⑤: 挑戦したくなる)
   ========================================== */
function showCollection() {
  const grid = document.getElementById('collection-grid');
  document.getElementById('collection-count').textContent = `${unlockedCards.length} / ${RESULTS.length}`;

  grid.innerHTML = RESULTS.map(r => {
    const isUnlocked = unlockedCards.includes(r.id);
    return `
      <div class="collection-item ${isUnlocked ? 'unlocked' : ''}">
        <div class="item-icon">${isUnlocked ? r.icon : '❓'}</div>
        <div class="item-name">${isUnlocked ? r.title : '？？？？'}</div>
      </div>
    `;
  }).join('');

  showScreen('screen-collection');
}

/* 再挑戦 */
function restartQuiz() {
  startQuiz();
}
