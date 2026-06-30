import { API_PROVIDERS, getProvider } from "../data/apiProviders.js";
import { COIN_SIDES, EARTHLY_HOURS, METHOD_DEFS } from "../data/zhouyi.js";
import { DEFAULT_ZHOUYI_PROMPT, requestZhouyiAiReading } from "../engine/zhouyiAiClient.js?v=20260701-assistant1";
import {
  createCoinReading,
  createMeihuaReading,
  createXiaoLiuRenReading,
  formatZhouyiForShare,
  toZhouyiRecord
} from "../engine/zhouyiEngine.js";

const VERSION = "20260701-assistant1";
const ZHOUYI_LOG_KEY = "astral-veil-zhouyi-log";
const ZHOUYI_API_CONFIG_KEY = "astral-veil-zhouyi-api-config";

const state = {
  methodId: "liuyao",
  coinMode: "auto",
  liuRenMode: "manual",
  meiHuaMode: "time",
  manualCoins: Array.from({ length: 6 }, () => Array(3).fill(null)),
  reading: null
};

const els = {
  body: document.body,
  methodTabs: document.querySelector("#methodTabs"),
  questionInput: document.querySelector("#questionInput"),
  methodControls: document.querySelector("#methodControls"),
  actionRow: document.querySelector("#actionRow"),
  copyButton: document.querySelector("#copyButton"),
  saveButton: document.querySelector("#saveButton"),
  aiButton: document.querySelector("#aiButton"),
  statusLine: document.querySelector("#statusLine"),
  stage: document.querySelector("#divinationStage"),
  resultArea: document.querySelector("#resultArea"),
  recordView: document.querySelector("#recordView"),
  apiDialog: document.querySelector("#apiDialog"),
  apiOpenButton: document.querySelector("#apiOpenButton"),
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
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setStatus(message, tone = "neutral") {
  els.statusLine.textContent = message;
  els.statusLine.dataset.tone = tone;
}

function showDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function loadZhouyiApiConfig() {
  try {
    const raw = localStorage.getItem(ZHOUYI_API_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveZhouyiApiConfig(config) {
  localStorage.setItem(ZHOUYI_API_CONFIG_KEY, JSON.stringify(config));
}

function clearZhouyiApiConfig() {
  localStorage.removeItem(ZHOUYI_API_CONFIG_KEY);
}

function currentQuestion() {
  return els.questionInput.value.trim();
}

function methodLabel(id) {
  return METHOD_DEFS.find((method) => method.id === id)?.name || METHOD_DEFS[0].name;
}

function readingOriginLabel(reading) {
  const labels = {
    "manual-coins": "场外铜钱记录",
    "web-crypto-coins": "随机铜钱起课",
    "manual-lunar-time": "手填月日时",
    "local-date-time": "当前日期时辰",
    "manual-numbers": "三数起卦",
    "local-time": "当前时间起卦"
  };
  return labels[reading.source] || reading.algorithm;
}

function renderAnswerSection(section) {
  const lead = section.lead || section.body || "";
  const detail = section.detail || "";
  const points = Array.isArray(section.points) ? section.points : [];

  return `
    <article>
      <h3>${escapeHtml(section.title)}</h3>
      <p class="section-lead">${escapeHtml(lead)}</p>
      ${detail ? `<p class="section-detail">${escapeHtml(detail)}</p>` : ""}
      ${
        points.length
          ? `<ul>${points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`
          : ""
      }
    </article>
  `;
}

function renderMethodTabs() {
  els.methodTabs.innerHTML = METHOD_DEFS.map(
    (method) => `
      <button class="method-tab ${method.id === state.methodId ? "is-selected" : ""}" type="button" data-method="${method.id}">
        <span>${escapeHtml(method.name)}</span>
        <small>${escapeHtml(method.subtitle)}</small>
      </button>
    `
  ).join("");
  els.body.dataset.method = state.methodId;
}

function optionButtons(name, value, options) {
  return `
    <div class="micro-switch" role="group" aria-label="${escapeHtml(name)}">
      ${options
        .map(
          (option) => `
            <button class="micro-button ${value === option.id ? "is-selected" : ""}" type="button" data-switch="${escapeHtml(
              name
            )}" data-value="${escapeHtml(option.id)}">${escapeHtml(option.label)}</button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderCoinControls() {
  const manualRows = state.manualCoins
    .map((coins, lineIndex) => {
      const lineLabel = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"][lineIndex];
      return `
        <div class="manual-line">
          <span class="manual-line-label">${lineLabel}</span>
          ${coins
            .map(
              (side, coinIndex) => `
                <div class="coin-pair" role="group" aria-label="${lineLabel}第 ${coinIndex + 1} 枚">
                  ${Object.values(COIN_SIDES)
                    .map(
                      (coinSide) => `
                        <button
                          class="coin-side ${side === coinSide.id ? "is-selected" : ""}"
                          type="button"
                          data-line="${lineIndex}"
                          data-coin="${coinIndex}"
                          data-side="${coinSide.id}"
                        >
                          ${coinSide.label}
                        </button>
                      `
                    )
                    .join("")}
                </div>
              `
            )
            .join("")}
        </div>
      `;
    })
    .join("");

  return `
    <section class="control-card">
      <div class="control-heading">
        <h2>六爻铜钱</h2>
        <p>用三枚铜钱成一爻，六次成卦。正面记阴值二，反面记阳值三；系统会据此换算阴阳、动爻与变卦。</p>
      </div>
      ${optionButtons("coinMode", state.coinMode, [
        { id: "auto", label: "随机投掷" },
        { id: "manual", label: "场外输入" }
      ])}
      ${
        state.coinMode === "manual"
          ? `<div class="manual-coins">${manualRows}</div>`
          : `<div class="coin-orbit-preview" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>`
      }
    </section>
  `;
}

function renderLiuRenControls() {
  const hourOptions = EARTHLY_HOURS.map(
    (hour) => `<option value="${hour.id}">${hour.label}</option>`
  ).join("");
  return `
    <section class="control-card">
      <div class="control-heading">
        <h2>小六壬</h2>
        <p>用月、日、时顺数落入六宫，适合快速看当下气口。手动模式请填农历月日时；当前时间模式按本机日期与时辰换算。</p>
      </div>
      ${optionButtons("liuRenMode", state.liuRenMode, [
        { id: "manual", label: "输入月日时" },
        { id: "current", label: "当前时间" }
      ])}
      ${
        state.liuRenMode === "manual"
          ? `<div class="form-grid three">
              <label><span>农历月</span><input id="lunarMonthInput" type="number" min="1" max="12" value="6" /></label>
              <label><span>农历日</span><input id="lunarDayInput" type="number" min="1" max="30" value="15" /></label>
              <label><span>时辰</span><select id="hourBranchInput">${hourOptions}</select></label>
            </div>`
          : `<div class="number-well">当前时间模式取本机日期与时辰递数，落入大安、留连、速喜、赤口、小吉、空亡六宫。同一日期、同一时辰内结果固定；跨入新时辰后才会变化。</div>`
      }
    </section>
  `;
}

function renderMeiHuaControls() {
  return `
    <section class="control-card">
      <div class="control-heading">
        <h2>梅花易数</h2>
        <p>以时间或数字起卦，重点看本卦、变卦和体用关系。时间模式取当前年月日时；三数模式使用你输入的上卦数、下卦数与动爻数。</p>
      </div>
      ${optionButtons("meiHuaMode", state.meiHuaMode, [
        { id: "time", label: "当前时间" },
        { id: "numbers", label: "三数起卦" }
      ])}
      ${
        state.meiHuaMode === "numbers"
          ? `<div class="form-grid three">
              <label><span>上卦数</span><input id="upperNumberInput" type="number" value="7" /></label>
              <label><span>下卦数</span><input id="lowerNumberInput" type="number" value="12" /></label>
              <label><span>动爻数</span><input id="movingNumberInput" type="number" value="5" /></label>
            </div>`
          : `<div class="number-well">时间模式会取当前年月日与时辰数起卦。它适合没有心念数字时快速成课；结果只作为整理问题的参考。</div>`
      }
    </section>
  `;
}

function renderMethodControls() {
  if (state.methodId === "xiaoliuren") {
    els.methodControls.innerHTML = renderLiuRenControls();
  } else if (state.methodId === "meihua") {
    els.methodControls.innerHTML = renderMeiHuaControls();
  } else {
    els.methodControls.innerHTML = renderCoinControls();
  }
  renderActionRow();
}

function renderActionRow() {
  const randomCoinMode = state.methodId === "liuyao" && state.coinMode === "auto";
  els.actionRow.innerHTML = randomCoinMode
    ? `<button class="ghost-button clear-only" id="clearButton" type="button">清空</button>`
    : `
        <button class="primary-button" id="castButton" type="button">
          <span aria-hidden="true"></span>
          起课
        </button>
        <button class="ghost-button" id="clearButton" type="button">清空</button>
      `;
}

function lineHtml(line, index) {
  return `
    <div class="yao-line ${line.yang ? "is-yang" : "is-yin"} ${line.moving ? "is-moving" : ""}">
      <span class="line-label">${escapeHtml(["初", "二", "三", "四", "五", "上"][index])}</span>
      <span class="line-stroke"><i></i><i></i></span>
      <span class="line-name">${escapeHtml(line.name || (line.yang ? "阳爻" : "阴爻"))}</span>
    </div>
  `;
}

function renderHexagramBlock(title, hexagram, lines) {
  return `
    <article class="hexagram-card">
      <span class="hexagram-title">${escapeHtml(title)}</span>
      <div class="hexagram-lines">${[...lines].reverse().map((line, reversedIndex) => lineHtml(line, 5 - reversedIndex)).join("")}</div>
      <div class="hexagram-name">
        <strong>第 ${hexagram.number} 卦 · ${escapeHtml(hexagram.name)}</strong>
        <span>${escapeHtml(hexagram.upper.name)}上${escapeHtml(hexagram.lower.name)}下</span>
      </div>
      <p>${escapeHtml(hexagram.theme)}</p>
    </article>
  `;
}

function renderBaguaSeal() {
  const trigramLabels = ["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];
  return `
    <div class="bagua-seal" aria-hidden="true">
      <span class="seal-ring ring-a"></span>
      <span class="seal-ring ring-b"></span>
      <span class="seal-ring ring-c"></span>
      ${trigramLabels
        .map((label, index) => `<span class="trigram-mark mark-${index}">${label}</span>`)
        .join("")}
      <span class="coin coin-a"></span>
      <span class="coin coin-b"></span>
      <span class="coin coin-c"></span>
    </div>
  `;
}

function renderEmptyStage() {
  els.stage.innerHTML = `
    ${renderBaguaSeal()}
    <div class="stage-copy">
      <h2>待起课</h2>
      <p>在左侧选择方法后点击起课，卦象、动爻、六宫或体用会在这里显示。解读会说明结构与变化点，不替代现实判断。</p>
    </div>
  `;
}

function renderCoinStage(reading) {
  els.stage.innerHTML = `
    <div class="stage-grid">
      ${renderHexagramBlock("本卦", reading.hexagram, reading.lines)}
      ${
        reading.changedHexagram
          ? renderHexagramBlock("之卦", reading.changedHexagram, reading.changedLines)
          : `<article class="hexagram-card calm-card">
              <span class="hexagram-title">无动爻</span>
              ${renderBaguaSeal()}
              <p>${escapeHtml(reading.moving.text)}</p>
            </article>`
      }
    </div>
    <div class="coin-log">
      ${reading.lines
        .map(
          (line, index) => `
            <span>
              <b>${escapeHtml(["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"][index])}</b>
              ${line.coins.map((side) => COIN_SIDES[side].label).join("")}
              · ${line.total} · ${escapeHtml(line.name)}
            </span>
          `
        )
        .join("")}
    </div>
  `;
}

function renderLiuRenStage(reading) {
  const palaces = ["大安", "留连", "速喜", "赤口", "小吉", "空亡"];
  els.stage.innerHTML = `
    <div class="liuren-wheel">
      ${palaces
        .map(
          (name, index) => `
            <span class="liuren-palace palace-${index} ${reading.palace.name === name ? "is-active" : ""}">${name}</span>
          `
        )
        .join("")}
      <div class="liuren-center">
        <strong>${escapeHtml(reading.palace.name)}</strong>
        <span>${escapeHtml(reading.palace.tone)}</span>
      </div>
    </div>
    <div class="stage-copy stage-copy-right">
      <h2>${escapeHtml(reading.palace.name)}</h2>
      <p>${escapeHtml(reading.interpretation.oneLine)}</p>
      <small>${escapeHtml(reading.formula)}</small>
    </div>
  `;
}

function renderMeiHuaStage(reading) {
  els.stage.innerHTML = `
    <div class="stage-grid">
      ${renderHexagramBlock("本卦", reading.hexagram, reading.lines)}
      ${renderHexagramBlock("之卦", reading.changedHexagram, reading.changedLines)}
    </div>
    <div class="tiyong-row">
      <span>体卦 ${escapeHtml(reading.body.name)} · ${escapeHtml(reading.body.element)}</span>
      <span>用卦 ${escapeHtml(reading.use.name)} · ${escapeHtml(reading.use.element)}</span>
      <span>${escapeHtml(reading.relation.label)}</span>
      <span>${escapeHtml(reading.moving.label)}</span>
    </div>
  `;
}

function renderStage() {
  if (!state.reading) {
    renderEmptyStage();
  } else if (state.reading.methodId === "xiaoliuren") {
    renderLiuRenStage(state.reading);
  } else if (state.reading.methodId === "meihua") {
    renderMeiHuaStage(state.reading);
  } else {
    renderCoinStage(state.reading);
  }
}

function renderResult() {
  const reading = state.reading;
  if (!reading) {
    els.resultArea.innerHTML = "";
    els.recordView.textContent = "尚未起课。";
    return;
  }

  els.resultArea.innerHTML = `
    <section class="answer-paper">
      <div class="answer-head">
        <div>
          <span>${escapeHtml(reading.methodName)} · ${escapeHtml(readingOriginLabel(reading))}</span>
          <h2>${escapeHtml(reading.interpretation.headline)}</h2>
        </div>
        <p>${escapeHtml(reading.interpretation.oneLine)}</p>
      </div>
      <div class="answer-sections">
        ${reading.interpretation.sections.map((section) => renderAnswerSection(section)).join("")}
      </div>
      <div id="aiResultSlot" class="ai-result-slot" hidden></div>
    </section>
  `;
  els.recordView.textContent = JSON.stringify(toZhouyiRecord(reading), null, 2);
}

function collectManualCoins() {
  return state.manualCoins.map((coins, lineIndex) => {
    if (coins.some((side) => !side)) {
      throw new Error(`请补全${["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"][lineIndex]}的三枚铜钱。`);
    }
    return coins;
  });
}

function createCurrentReading() {
  const question = currentQuestion();
  if (state.methodId === "xiaoliuren") {
    if (state.liuRenMode === "manual") {
      return createXiaoLiuRenReading({
        question,
        lunarMonth: document.querySelector("#lunarMonthInput")?.value,
        lunarDay: document.querySelector("#lunarDayInput")?.value,
        hourBranch: document.querySelector("#hourBranchInput")?.value
      });
    }
    return createXiaoLiuRenReading({ question, date: new Date() });
  }

  if (state.methodId === "meihua") {
    if (state.meiHuaMode === "numbers") {
      return createMeihuaReading({
        question,
        upperNumber: document.querySelector("#upperNumberInput")?.value,
        lowerNumber: document.querySelector("#lowerNumberInput")?.value,
        movingNumber: document.querySelector("#movingNumberInput")?.value
      });
    }
    return createMeihuaReading({ question });
  }

  return createCoinReading({
    question,
    manualLines: state.coinMode === "manual" ? collectManualCoins() : null
  });
}

function triggerCastingMotion() {
  els.body.classList.remove("is-casting");
  void els.body.offsetWidth;
  els.body.classList.add("is-casting");
  window.setTimeout(() => {
    els.body.classList.remove("is-casting");
  }, 980);
}

function performReading() {
  try {
    triggerCastingMotion();
    state.reading = createCurrentReading();
    renderStage();
    renderResult();
    setStatus(`${methodLabel(state.methodId)}已成课。`, "good");
    els.copyButton.disabled = false;
    els.saveButton.disabled = false;
    els.aiButton.disabled = false;
  } catch (error) {
    setStatus(error.message, "warn");
  }
}

async function copyResult() {
  if (!state.reading) {
    return;
  }
  await navigator.clipboard.writeText(formatZhouyiForShare(state.reading));
  setStatus("解读文字已复制。", "good");
}

function saveReading() {
  if (!state.reading) {
    return;
  }
  const existing = JSON.parse(localStorage.getItem(ZHOUYI_LOG_KEY) || "[]");
  existing.unshift({
    record: toZhouyiRecord(state.reading),
    text: formatZhouyiForShare(state.reading)
  });
  localStorage.setItem(ZHOUYI_LOG_KEY, JSON.stringify(existing.slice(0, 30)));
  setStatus("已保存到本机浏览器。", "good");
}

async function enhanceWithAi() {
  if (!state.reading) {
    return;
  }
  const config = loadZhouyiApiConfig();
  if (config?.enabled !== "on") {
    showDialog(els.apiDialog);
    setStatus("请先在补写设置中启用。", "warn");
    return;
  }
  const slot = document.querySelector("#aiResultSlot");
  slot.hidden = false;
  slot.innerHTML = "<strong>补充解读中</strong><p>正在根据本次起课记录生成补充文字。</p>";
  try {
    const text = await requestZhouyiAiReading({ config, reading: state.reading });
    slot.innerHTML = `<strong>补充解读</strong><p>${escapeHtml(text).replaceAll("\n", "<br />")}</p>`;
    setStatus("补充解读已返回。", "good");
  } catch (error) {
    slot.innerHTML = `<strong>补充解读失败</strong><p>${escapeHtml(error.message)}</p>`;
    setStatus(error.message, "warn");
  }
}

function resetPage() {
  state.reading = null;
  state.manualCoins = Array.from({ length: 6 }, () => Array(3).fill(null));
  els.copyButton.disabled = true;
  els.saveButton.disabled = true;
  els.aiButton.disabled = true;
  renderMethodControls();
  renderStage();
  renderResult();
  setStatus("已清空，可以重新起课。");
}

function populateApiPanel() {
  els.providerSelect.innerHTML = API_PROVIDERS.map(
    (provider) => `<option value="${provider.id}">${escapeHtml(provider.label)}</option>`
  ).join("");

  const saved = loadZhouyiApiConfig();
  const provider = getProvider(saved?.providerId);
  els.providerSelect.value = saved?.providerId || provider.id;
  els.apiModelInput.value = saved?.model || provider.model;
  els.apiEndpointInput.value = saved?.endpoint || provider.endpoint;
  els.apiKeyInput.value = saved?.apiKey || "";
  els.apiEnabledSelect.value = saved?.enabled || "off";
  els.apiPromptInput.value = saved?.systemPrompt || DEFAULT_ZHOUYI_PROMPT;
  els.providerNote.textContent = provider.note;
}

function saveApiPanel() {
  saveZhouyiApiConfig({
    providerId: els.providerSelect.value,
    model: els.apiModelInput.value.trim(),
    endpoint: els.apiEndpointInput.value.trim(),
    apiKey: els.apiKeyInput.value.trim(),
    enabled: els.apiEnabledSelect.value,
    systemPrompt: els.apiPromptInput.value.trim()
  });
  setStatus("补写设置已保存。", "good");
  els.apiDialog.close?.();
}

function bindEvents() {
  els.methodTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-method]");
    if (!button) {
      return;
    }
    state.methodId = button.dataset.method;
    state.reading = null;
    renderMethodTabs();
    renderMethodControls();
    renderStage();
    renderResult();
    setStatus(`已切换到${methodLabel(state.methodId)}。`);
  });

  els.methodControls.addEventListener("click", (event) => {
    const switchButton = event.target.closest("[data-switch]");
    if (switchButton) {
      const key = switchButton.dataset.switch;
      state[key] = switchButton.dataset.value;
      renderMethodControls();
      if (key === "coinMode" && switchButton.dataset.value === "auto") {
        performReading();
        return;
      }
      state.reading = null;
      renderStage();
      renderResult();
      setStatus("输入方式已切换。");
      return;
    }

    const coinButton = event.target.closest("[data-side]");
    if (coinButton) {
      const line = Number(coinButton.dataset.line);
      const coin = Number(coinButton.dataset.coin);
      state.manualCoins[line][coin] = coinButton.dataset.side;
      renderMethodControls();
      setStatus("已记录一枚场外铜钱。");
    }
  });

  els.actionRow.addEventListener("click", (event) => {
    if (event.target.closest("#castButton")) {
      performReading();
      return;
    }
    if (event.target.closest("#clearButton")) {
      resetPage();
    }
  });
  els.copyButton.addEventListener("click", copyResult);
  els.saveButton.addEventListener("click", saveReading);
  els.aiButton.addEventListener("click", enhanceWithAi);
  els.apiOpenButton.addEventListener("click", () => {
    populateApiPanel();
    showDialog(els.apiDialog);
  });
  els.providerSelect.addEventListener("change", () => {
    const provider = getProvider(els.providerSelect.value);
    els.apiModelInput.value = provider.model;
    els.apiEndpointInput.value = provider.endpoint;
    els.providerNote.textContent = provider.note;
  });
  els.saveApiConfig.addEventListener("click", saveApiPanel);
  els.clearApiConfig.addEventListener("click", () => {
    clearZhouyiApiConfig();
    populateApiPanel();
    setStatus("补写设置已清除。");
  });
}

function init() {
  document.documentElement.dataset.zhouyiVersion = VERSION;
  renderMethodTabs();
  renderMethodControls();
  renderStage();
  renderResult();
  populateApiPanel();
  bindEvents();
  setStatus("请选择法门并起课。");
}

init();
