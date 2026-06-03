import { API_PROVIDERS, DEFAULT_SYSTEM_PROMPT, getProvider } from "../data/apiProviders.js";
import { SPREADS, getSpread } from "../data/spreads.js?v=20260603-polish2";
import { TOPICS } from "../data/topics.js";
import { clearApiConfig, loadApiConfig, requestAiReading, saveApiConfig } from "../engine/aiClient.js";
import { formatReadingForShare, interpretReading } from "../engine/interpret.js";
import { secureRandomInt } from "../engine/random.js";
import { createReading, toPublicRecord } from "../engine/tarotEngine.js";
import { ANIMAL_GALLERY } from "../data/animals.js?v=20260603-polish2";
import { getCardVisual } from "../data/cardVisuals.js";

const READING_LOG_KEY = "astral-veil-reading-log";

const state = {
  topicId: "daily",
  spreadId: "three",
  reading: null,
  interpretation: null,
  flipped: new Set(),
  dealing: false,
  sound: false,
  hiddenClicks: 0,
  hiddenClickTimer: null,
  ravenClicks: 0,
  ravenClickTimer: null,
  pipiClicks: 0,
  pipiClickTimer: null,
  pipiRunning: false,
  ravenAnimal: null,
  guardianAnimal: null
};

const els = {
  topicOptions: document.querySelector("#topicOptions"),
  spreadOptions: document.querySelector("#spreadOptions"),
  questionInput: document.querySelector("#questionInput"),
  shuffleButton: document.querySelector("#shuffleButton"),
  resetButton: document.querySelector("#resetButton"),
  deckStack: document.querySelector("#deckStack"),
  stageStatus: document.querySelector("#stageStatus"),
  spreadBoard: document.querySelector("#spreadBoard"),
  resultCue: document.querySelector("#resultCue"),
  resultArea: document.querySelector("#resultArea"),
  randomDialog: document.querySelector("#randomDialog"),
  ravenButton: document.querySelector("#ravenButton"),
  cryptoStatus: document.querySelector("#cryptoStatus"),
  drawRecord: document.querySelector("#drawRecord"),
  apiDialog: document.querySelector("#apiDialog"),
  hiddenApiTrigger: document.querySelector("#hiddenApiTrigger"),
  providerSelect: document.querySelector("#providerSelect"),
  apiModelInput: document.querySelector("#apiModelInput"),
  apiEndpointInput: document.querySelector("#apiEndpointInput"),
  apiKeyInput: document.querySelector("#apiKeyInput"),
  apiEnabledSelect: document.querySelector("#apiEnabledSelect"),
  apiPromptInput: document.querySelector("#apiPromptInput"),
  providerNote: document.querySelector("#providerNote"),
  saveApiConfig: document.querySelector("#saveApiConfig"),
  clearApiConfig: document.querySelector("#clearApiConfig")
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function playTone(kind) {
  if (!state.sound) {
    return;
  }
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) {
    return;
  }
  const context = new AudioEngine();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const frequency = kind === "flip" ? 512 : kind === "done" ? 384 : 220;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.38);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.42);
}

function renderTopics() {
  els.topicOptions.innerHTML = TOPICS.map(
    (topic) => `
      <button class="segment-button ${topic.id === state.topicId ? "is-selected" : ""}" type="button" data-topic="${topic.id}">
        ${escapeHtml(topic.name)}
      </button>
    `
  ).join("");
}

function renderSpreads() {
  els.spreadOptions.innerHTML = SPREADS.map(
    (spread) => `
      <button class="spread-button ${spread.id === state.spreadId ? "is-selected" : ""}" type="button" data-spread="${spread.id}">
        <span class="spread-title">
          <span>${escapeHtml(spread.name)}</span>
          <span>${spread.positions.length} 张</span>
        </span>
        <small>${escapeHtml(spread.subtitle)} · ${escapeHtml(spread.description)}</small>
      </button>
    `
  ).join("");
}

function cardBackHtml() {
  return `
    <div class="card-face card-back">
      <img src="./assets/cards/tarot-back.webp" alt="" />
    </div>
  `;
}

const SUIT_ART = {
  wands: { hue: 28 },
  cups: { hue: 205 },
  swords: { hue: 252 },
  pentacles: { hue: 112 }
};

const PATTERN_NAMES = ["veil", "mandala", "comet", "garden", "blade", "coin", "lunar", "crown"];

function hashString(input) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = (hash * 16777619) >>> 0;
  }
  return hash >>> 0;
}

function cardArt(card) {
  const hash = hashString(card.id);
  const suitBase = SUIT_ART[card.suit];
  const baseHue = card.arcana === "major" ? (268 + card.number * 17) % 360 : suitBase.hue;
  const hue = (baseHue + (hash % 19) - 9 + 360) % 360;
  const hue2 = (hue + 42 + (hash % 38)) % 360;
  const pattern = PATTERN_NAMES[hash % PATTERN_NAMES.length];
  const starCount = 7 + (hash % 5);
  const stars = Array.from({ length: starCount }, (_, index) => ({
    x: 12 + ((hash >>> (index % 13)) + index * 17) % 76,
    y: 12 + ((hash >>> ((index + 5) % 13)) + index * 23) % 72,
    size: 3 + ((hash + index * 11) % 7)
  }));
  const sparks = Array.from({ length: 5 }, (_, index) => ({
    x: 18 + ((hash >>> ((index + 2) % 13)) + index * 19) % 62,
    y: 18 + ((hash >>> ((index + 7) % 13)) + index * 13) % 62,
    size: 12 + ((hash + index * 7) % 24)
  }));

  return {
    pattern,
    stars,
    sparks,
    style: [
      `--card-hue:${hue}`,
      `--card-hue-2:${hue2}`,
      `--spark-x:${18 + (hash % 64)}%`,
      `--spark-y:${16 + ((hash >>> 5) % 66)}%`,
      `--art-tilt:${((hash % 13) - 6) * 0.55}deg`,
      `--art-scale:${0.92 + (hash % 9) / 100}`
    ].join(";")
  };
}

function bindCardFaceImages(root = els.spreadBoard) {
  root.querySelectorAll(".generated-card-face").forEach((image) => {
    const front = image.closest(".card-front");
    const markLoaded = () => front?.classList.remove("face-loading");
    const markMissing = () => {
      front?.classList.add("face-missing");
      front?.classList.remove("face-loading");
      image.remove();
    };

    image.addEventListener("load", markLoaded, { once: true });
    image.addEventListener("error", markMissing, { once: true });

    if (image.complete) {
      if (image.naturalWidth > 0) {
        markLoaded();
      } else {
        markMissing();
      }
    }
  });
}

function cardFrontHtml(item) {
  const art = cardArt(item.card);
  const visual = getCardVisual(item.card);
  return `
    <div class="card-face card-front art-card art-${escapeHtml(item.card.arcana)} art-${escapeHtml(item.card.suit || "major")} pattern-${escapeHtml(art.pattern)} ${escapeHtml(visual.classes)} ${item.orientation === "reversed" ? "is-reversed" : ""} face-loading" style="${art.style}">
      <div class="art-illustration">
        <div class="art-foil"></div>
        <div class="art-window"></div>
        <div class="art-orbit orbit-one"></div>
        <div class="art-orbit orbit-two"></div>
        <div class="art-core">
          <span class="core-halo"></span>
          <span class="core-disc"></span>
          <span class="core-veil"></span>
        </div>
        <div class="art-constellation">
          ${art.stars
            .map((star) => `<span style="left:${star.x}%;top:${star.y}%;--star-size:${star.size}px"></span>`)
            .join("")}
        </div>
        <div class="art-sparks">
          ${art.sparks
            .map((spark) => `<span style="left:${spark.x}%;top:${spark.y}%;--spark-size:${spark.size}px"></span>`)
            .join("")}
        </div>
      </div>
      <img class="generated-card-face" src="${escapeHtml(visual.image)}" alt="" loading="lazy" decoding="async" />
      <div class="card-atmosphere" aria-hidden="true"><span></span></div>
    </div>
  `;
}

function renderSpreadBoard() {
  const spread = state.reading?.spread || getSpread(state.spreadId);
  const items = state.reading
    ? state.reading.drawn
    : spread.positions.map((position) => ({ position, card: null, orientation: "upright" }));

  els.spreadBoard.dataset.count = String(items.length);
  els.spreadBoard.innerHTML = items
    .map((item, index) => {
      const isFlipped = state.flipped.has(index);
      const label = state.reading
        ? `${item.position.label}：${item.card.nameCn}，${item.orientation === "upright" ? "正位" : "逆位"}`
        : `${item.position.label}：等待抽牌`;
      const orientationText = item.orientation === "upright" ? "正位" : "逆位";
      const caption = state.reading ? `${item.card.nameCn} · ${orientationText}` : "";
      return `
        <div class="draw-card ${state.dealing ? "is-dealing-in" : ""}" style="--deal-index:${index}">
          <button class="card-button ${isFlipped ? "is-flipped" : ""}" type="button" data-card-index="${index}" ${state.reading && !state.dealing ? "" : "disabled"} aria-label="${escapeHtml(label)}">
            <div class="card-shell">
              ${cardBackHtml()}
              ${state.reading ? cardFrontHtml(item) : ""}
            </div>
          </button>
          <div class="position-label">${escapeHtml(item.position.label)}</div>
          ${state.reading ? `<div class="revealed-card-caption ${isFlipped ? "is-visible" : ""}">${escapeHtml(caption)}</div>` : ""}
          <p class="position-role">${escapeHtml(item.position.role)}</p>
        </div>
      `;
    })
    .join("");
  bindCardFaceImages();
}

function updateDrawRecord() {
  const record = toPublicRecord(state.reading);
  els.drawRecord.textContent = record ? JSON.stringify(record, null, 2) : "尚未抽牌。";
}

function setResultCueVisible(visible) {
  els.resultCue.hidden = !visible;
  els.resultCue.classList.toggle("is-visible", visible);
}

function revealResultIfReady() {
  if (!state.reading || state.interpretation || state.flipped.size !== state.reading.drawn.length) {
    return;
  }
  state.interpretation = interpretReading(state.reading);
  renderResult();
  setResultCueVisible(true);
  els.stageStatus.textContent = "牌已经全部翻开，整盘解读已生成。";
  playTone("done");
}

function renderResult() {
  const reading = state.reading;
  const interpretation = state.interpretation;
  const apiConfig = loadApiConfig();
  if (!reading || !interpretation) {
    els.resultArea.classList.remove("is-visible");
    els.resultArea.innerHTML = "";
    return;
  }

  els.resultArea.classList.add("is-visible");
  els.resultArea.innerHTML = `
    <div class="result-head">
      <div>
        <h2>${escapeHtml(interpretation.headline)}</h2>
        <p class="summary-line">${escapeHtml(interpretation.oneLine)}</p>
      </div>
      <div class="result-actions">
        <button class="ghost-button" id="copyResultButton" type="button">复制结果</button>
        <button class="ghost-button" id="shareImageButton" type="button">下载分享图</button>
        <button class="ghost-button" id="saveReadingButton" type="button">保存到本机</button>
        ${
          apiConfig?.enabled === "on"
            ? '<button class="primary-button" id="aiEnhanceButton" type="button">AI 补充解读</button>'
            : ""
        }
      </div>
    </div>
    <div class="reading-grid">
      ${interpretation.cardInterpretations
        .map(
          (item) => `
          <article class="reading-item">
            <h3>
              <span>${escapeHtml(item.positionLabel)}</span>
              <span>${escapeHtml(item.cardName)} · ${escapeHtml(item.orientationLabel)}</span>
            </h3>
            <div class="keywords">${item.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div>
            <p>${escapeHtml(item.text)}</p>
            <p><strong>行动：</strong>${escapeHtml(item.advice)}</p>
          </article>
        `
        )
        .join("")}
    </div>
    <div class="synthesis">
      <h3>整盘综合</h3>
      <p>${escapeHtml(interpretation.synthesis)}</p>
      <h3>可以尝试的行动</h3>
      <ol class="action-list">${interpretation.actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ol>
      <h3>反思问题</h3>
      <ol class="question-list">${interpretation.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ol>
      <div id="aiResultSlot"></div>
    </div>
  `;

  document.querySelector("#copyResultButton")?.addEventListener("click", copyResult);
  document.querySelector("#shareImageButton")?.addEventListener("click", downloadShareImage);
  document.querySelector("#saveReadingButton")?.addEventListener("click", saveReadingToLocal);
  document.querySelector("#aiEnhanceButton")?.addEventListener("click", enhanceWithAi);
}

async function copyResult() {
  const text = formatReadingForShare(state.reading, state.interpretation);
  await navigator.clipboard.writeText(text);
  els.stageStatus.textContent = "结果文字已复制。";
}

function saveReadingToLocal() {
  const existing = JSON.parse(localStorage.getItem(READING_LOG_KEY) || "[]");
  existing.unshift({
    record: toPublicRecord(state.reading),
    interpretation: state.interpretation
  });
  localStorage.setItem(READING_LOG_KEY, JSON.stringify(existing.slice(0, 30)));
  els.stageStatus.textContent = "这次占卜已保存到本机浏览器。";
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  const words = Array.from(text);
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    context.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function downloadShareImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  const context = canvas.getContext("2d");

  context.fillStyle = "#090812";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(215,180,106,0.55)";
  context.lineWidth = 4;
  context.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

  context.fillStyle = "#f2d38b";
  context.font = "700 72px serif";
  context.fillText("星幕塔罗", 90, 150);
  context.font = "34px sans-serif";
  context.fillStyle = "#a99f91";
  context.fillText(`${state.reading.spread.name} · ${state.reading.topic.name}`, 90, 205);

  let y = 300;
  context.font = "38px serif";
  context.fillStyle = "#e8dcc2";
  state.reading.drawn.forEach((item) => {
    const orientation = item.orientation === "upright" ? "正位" : "逆位";
    context.fillText(`${item.position.label}：${item.card.nameCn} · ${orientation}`, 90, y);
    y += 64;
  });

  y += 38;
  context.font = "34px sans-serif";
  context.fillStyle = "#d7b46a";
  context.fillText("整盘主题", 90, y);
  y += 58;
  context.font = "32px sans-serif";
  context.fillStyle = "#e8dcc2";
  y = wrapCanvasText(context, state.interpretation.oneLine, 90, y, 1000, 52);

  y += 28;
  context.fillStyle = "#d7b46a";
  context.fillText("行动建议", 90, y);
  y += 58;
  context.fillStyle = "#e8dcc2";
  state.interpretation.actions.forEach((action, index) => {
    y = wrapCanvasText(context, `${index + 1}. ${action}`, 90, y, 1000, 52) + 8;
  });

  context.font = "26px sans-serif";
  context.fillStyle = "#a99f91";
  context.fillText("Web Crypto 本地洗牌 · 默认无 API 调用", 90, 1510);

  const link = document.createElement("a");
  link.download = `astral-veil-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

async function enhanceWithAi(event) {
  const button = event.currentTarget;
  const slot = document.querySelector("#aiResultSlot");
  const config = loadApiConfig();
  button.disabled = true;
  button.textContent = "请求中";
  slot.innerHTML = '<div class="ai-result">正在请求隐藏接口。若浏览器拦截 CORS，请改用自己的后端代理。</div>';

  try {
    const text = await requestAiReading({
      config,
      reading: state.reading,
      interpretation: state.interpretation
    });
    slot.innerHTML = `<div class="ai-result"><h3>AI 补充解读</h3><p>${escapeHtml(text || "接口返回为空。")}</p></div>`;
  } catch (error) {
    slot.innerHTML = `<div class="ai-result"><h3>AI 请求失败</h3><p>${escapeHtml(error.message)}</p></div>`;
  } finally {
    button.disabled = false;
    button.textContent = "AI 补充解读";
  }
}

function performShuffle() {
  if (state.dealing) {
    return;
  }
  els.shuffleButton.disabled = true;
  els.resultArea.classList.remove("is-visible");
  setResultCueVisible(false);
  state.reading = null;
  state.interpretation = null;
  state.flipped.clear();
  state.dealing = true;
  renderSpreadBoard();
  els.stageStatus.textContent = "正在洗牌";
  els.deckStack.classList.add("is-shuffling");
  playTone("shuffle");

  window.setTimeout(() => {
    try {
      state.reading = createReading({
        topicId: state.topicId,
        spreadId: state.spreadId,
        question: els.questionInput.value
      });
      els.stageStatus.textContent = `正在抽出 ${state.reading.drawn.length} 张牌。`;
      updateDrawRecord();
      renderSpreadBoard();
      els.deckStack.classList.remove("is-shuffling");
      window.setTimeout(() => {
        state.dealing = false;
        els.shuffleButton.disabled = false;
        els.stageStatus.textContent = "牌已落位。请逐张点击牌背翻开。";
        renderSpreadBoard();
      }, 620 + state.reading.drawn.length * 150);
    } catch (error) {
      els.stageStatus.textContent = error.message;
      state.dealing = false;
      els.deckStack.classList.remove("is-shuffling");
      els.shuffleButton.disabled = false;
    }
  }, 1080);
}

function resetReading() {
  state.reading = null;
  state.interpretation = null;
  state.flipped.clear();
  state.dealing = false;
  setResultCueVisible(false);
  els.questionInput.value = "";
  els.stageStatus.textContent = "选择主题和牌阵后开始洗牌。";
  updateDrawRecord();
  renderSpreadBoard();
  renderResult();
}

function fillProviderForm(providerId, config = {}) {
  const provider = getProvider(providerId);
  els.providerSelect.value = provider.id;
  els.apiModelInput.value = config.model || provider.model;
  els.apiEndpointInput.value = config.endpoint || provider.endpoint;
  els.apiKeyInput.value = config.apiKey || "";
  els.apiEnabledSelect.value = config.enabled || "off";
  els.apiPromptInput.value = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  els.providerNote.textContent = provider.note;
}

function renderApiPanel() {
  els.providerSelect.innerHTML = API_PROVIDERS.map(
    (provider) => `<option value="${provider.id}">${escapeHtml(provider.label)}</option>`
  ).join("");

  const config = loadApiConfig();
  fillProviderForm(config?.providerId || "openai", config || {});
}

function openApiPanel() {
  renderApiPanel();
  showDialog(els.apiDialog);
}

function saveApiPanelConfig() {
  saveApiConfig({
    providerId: els.providerSelect.value,
    model: els.apiModelInput.value.trim(),
    endpoint: els.apiEndpointInput.value.trim(),
    apiKey: els.apiKeyInput.value.trim(),
    enabled: els.apiEnabledSelect.value,
    systemPrompt: els.apiPromptInput.value.trim()
  });
  els.providerNote.textContent = "已保存到当前浏览器。公开仓库中没有写入任何真实密钥。";
  renderResult();
}

function ravenMarkup() {
  return `
    <span class="raven-aura" aria-hidden="true"></span>
    <img class="raven-avatar" src="./assets/animals/raven-generated.png" alt="" />
  `;
}

function restoreRavenButton() {
  els.ravenButton.classList.remove("is-animal", "is-fluttering");
  els.ravenButton.setAttribute("aria-label", "星幕守望者");
  els.ravenButton.removeAttribute("title");
  els.ravenButton.innerHTML = ravenMarkup();
  state.ravenAnimal = null;
}

function clearAnimalGuardian() {
  document.querySelector(".animal-guardian")?.remove();
  state.guardianAnimal = null;
}

function renderAnimalGuardian(animal) {
  clearAnimalGuardian();
  state.guardianAnimal = animal;
  const guardian = document.createElement("button");
  guardian.className = "animal-guardian";
  guardian.type = "button";
  guardian.setAttribute("aria-label", animal.nameCn);
  guardian.innerHTML = `<img src="./assets/animals/generated/${escapeHtml(animal.slug)}.png" alt="${escapeHtml(animal.nameCn)}" title="${escapeHtml(animal.nameCn)}" />`;
  guardian.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    clearAnimalGuardian();
  });
  document.body.appendChild(guardian);
}

function animateRaven() {
  els.ravenButton.classList.remove("is-fluttering");
  void els.ravenButton.offsetWidth;
  els.ravenButton.classList.add("is-fluttering");
  window.setTimeout(() => els.ravenButton.classList.remove("is-fluttering"), 760);
}

function transformRaven() {
  const animal = ANIMAL_GALLERY[secureRandomInt(ANIMAL_GALLERY.length)];
  state.ravenAnimal = animal;
  renderAnimalGuardian(animal);
}

function runPipiLap() {
  if (state.pipiRunning) {
    return;
  }

  state.pipiRunning = true;
  state.ravenClicks = 0;
  state.pipiClicks = 0;
  window.clearTimeout(state.ravenClickTimer);
  window.clearTimeout(state.pipiClickTimer);
  clearAnimalGuardian();

  const runner = document.createElement("div");
  runner.className = "pipi-runner";
  runner.setAttribute("aria-hidden", "true");
  runner.innerHTML = `
    <img src="./assets/animals/pipi-codex-dog.png" alt="" />
    <span class="pipi-trail one"></span>
    <span class="pipi-trail two"></span>
    <span class="pipi-trail three"></span>
  `;
  document.body.appendChild(runner);
  els.stageStatus.textContent = "隐藏彩蛋：皮皮出来绕场一圈。";

  window.setTimeout(() => {
    runner.remove();
    restoreRavenButton();
    state.pipiRunning = false;
    els.stageStatus.textContent = "皮皮跑完一圈，渡鸦回来了。";
  }, 5200);
}

function handleRavenClick() {
  if (state.pipiRunning) {
    return;
  }

  animateRaven();

  window.clearTimeout(state.pipiClickTimer);
  state.pipiClicks += 1;
  if (state.pipiClicks >= 16) {
    runPipiLap();
    return;
  }
  state.pipiClickTimer = window.setTimeout(() => {
    state.pipiClicks = 0;
  }, 5200);

  window.clearTimeout(state.ravenClickTimer);
  state.ravenClicks += 1;

  if (state.ravenClicks >= 3) {
    state.ravenClicks = 0;
    transformRaven();
    return;
  }

  state.ravenClickTimer = window.setTimeout(() => {
    state.ravenClicks = 0;
  }, 900);
}

function bindEvents() {
  els.topicOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic]");
    if (!button) {
      return;
    }
    state.topicId = button.dataset.topic;
    renderTopics();
  });

  els.spreadOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-spread]");
    if (!button) {
      return;
    }
    state.spreadId = button.dataset.spread;
    state.reading = null;
    state.interpretation = null;
    state.flipped.clear();
    state.dealing = false;
    setResultCueVisible(false);
    renderSpreads();
    renderSpreadBoard();
    renderResult();
    els.stageStatus.textContent = "牌阵已切换。开始洗牌后会生成新的牌面。";
  });

  els.spreadBoard.addEventListener("click", (event) => {
    const button = event.target.closest("[data-card-index]");
    if (!button || !state.reading || state.dealing) {
      return;
    }
    const index = Number(button.dataset.cardIndex);
    if (state.flipped.has(index)) {
      return;
    }
    state.flipped.add(index);
    button.classList.add("is-flipped");
    button.closest(".draw-card")?.querySelector(".revealed-card-caption")?.classList.add("is-visible");
    playTone("flip");
    window.setTimeout(revealResultIfReady, 420);
  });

  els.shuffleButton.addEventListener("click", performShuffle);
  els.resetButton.addEventListener("click", resetReading);
  els.ravenButton.addEventListener("click", handleRavenClick);

  els.hiddenApiTrigger.addEventListener("click", () => {
    window.clearTimeout(state.hiddenClickTimer);
    state.hiddenClicks += 1;
    state.hiddenClickTimer = window.setTimeout(() => {
      state.hiddenClicks = 0;
    }, 1200);

    if (state.hiddenClicks >= 5) {
      state.hiddenClicks = 0;
      openApiPanel();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "i") {
      event.preventDefault();
      openApiPanel();
    }
  });

  els.providerSelect.addEventListener("change", () => fillProviderForm(els.providerSelect.value));
  els.saveApiConfig.addEventListener("click", saveApiPanelConfig);
  els.clearApiConfig.addEventListener("click", () => {
    clearApiConfig();
    fillProviderForm("openai");
    els.providerNote.textContent = "本机隐藏 API 配置已清除。";
    renderResult();
  });
}

function randomUnit() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] / 0xffffffff;
}

function startStarfield() {
  const canvas = document.querySelector("#starfield");
  const context = canvas.getContext("2d");
  const stars = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    stars.length = 0;
    const count = Math.min(180, Math.floor((canvas.width * canvas.height) / 22000));
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: randomUnit() * canvas.width,
        y: randomUnit() * canvas.height,
        radius: 0.6 + randomUnit() * 1.8,
        alpha: 0.18 + randomUnit() * 0.58,
        drift: 0.08 + randomUnit() * 0.24
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(242, 211, 139, 0.72)";
    stars.forEach((star) => {
      context.globalAlpha = star.alpha;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
      if (!reducedMotion) {
        star.y += star.drift;
        if (star.y > canvas.height) {
          star.y = 0;
        }
      }
    });
    context.globalAlpha = 1;
    if (!reducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

function init() {
  els.cryptoStatus.textContent =
    globalThis.crypto && typeof globalThis.crypto.getRandomValues === "function"
      ? "window.crypto.getRandomValues 可用"
      : "不可用，无法洗牌";
  renderTopics();
  renderSpreads();
  renderSpreadBoard();
  renderApiPanel();
  updateDrawRecord();
  bindEvents();
  startStarfield();
}

init();
