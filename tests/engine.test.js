import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ANIMAL_GALLERY } from "../src/data/animals.js";
import { TAROT_CARDS } from "../src/data/cards.js";
import { SPREADS } from "../src/data/spreads.js";
import { secureRandomInt, shuffleDeck } from "../src/engine/random.js";
import { interpretReading } from "../src/engine/interpret.js";
import { createReading, toPublicRecord } from "../src/engine/tarotEngine.js";

function fakeRng(sequence) {
  let index = 0;
  return {
    getRandomValues(array) {
      array[0] = sequence[index % sequence.length] >>> 0;
      index += 1;
      return array;
    }
  };
}

function listFiles(root) {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function test(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

test("tarot deck has 78 unique cards", () => {
  assert.equal(TAROT_CARDS.length, 78);
  assert.equal(new Set(TAROT_CARDS.map((card) => card.id)).size, 78);
});

test("each card has upright and reversed local meanings", () => {
  for (const card of TAROT_CARDS) {
    assert.ok(card.nameCn, card.id);
    assert.ok(card.nameEn, card.id);
    for (const orientation of ["upright", "reversed"]) {
      assert.ok(card[orientation].summary, `${card.id} ${orientation} summary`);
      assert.ok(card[orientation].general, `${card.id} ${orientation} general`);
      assert.ok(card[orientation].love, `${card.id} ${orientation} love`);
      assert.ok(card[orientation].career, `${card.id} ${orientation} career`);
      assert.ok(card[orientation].money, `${card.id} ${orientation} money`);
      assert.ok(card[orientation].self, `${card.id} ${orientation} self`);
      assert.ok(card[orientation].choice, `${card.id} ${orientation} choice`);
      assert.ok(card[orientation].advice, `${card.id} ${orientation} advice`);
      assert.ok(Array.isArray(card[orientation].keywords), `${card.id} ${orientation} keywords`);
      assert.ok(card[orientation].keywords.length >= 3, `${card.id} ${orientation} keyword count`);
    }
  }
});

test("spreads have expected position counts", () => {
  const counts = Object.fromEntries(SPREADS.map((spread) => [spread.id, spread.positions.length]));
  assert.deepEqual(counts, {
    single: 1,
    three: 3,
    choice: 4,
    relationship: 5
  });
});

test("secureRandomInt rejects modulo bias values", () => {
  const rng = fakeRng([0xffffffff, 7]);
  assert.equal(secureRandomInt(10, rng), 7);
});

test("shuffleDeck returns same card set without mutating input", () => {
  const input = TAROT_CARDS.slice(0, 12);
  const originalIds = input.map((card) => card.id);
  const shuffled = shuffleDeck(input, fakeRng(Array.from({ length: 64 }, (_, index) => index + 3)));
  assert.equal(shuffled.length, input.length);
  assert.deepEqual(input.map((card) => card.id), originalIds);
  assert.deepEqual(new Set(shuffled.map((card) => card.id)), new Set(originalIds));
});

test("createReading draws the selected spread count without duplicates", () => {
  const reading = createReading({
    topicId: "career",
    spreadId: "relationship",
    question: "下一步如何推进？",
    rng: fakeRng(Array.from({ length: 160 }, (_, index) => index * 17 + 11))
  });
  assert.equal(reading.drawn.length, 5);
  assert.equal(new Set(reading.drawn.map((item) => item.card.id)).size, 5);
  assert.ok(reading.drawn.every((item) => ["upright", "reversed"].includes(item.orientation)));
  const record = toPublicRecord(reading);
  assert.equal(record.algorithm, "Fisher-Yates");
});

test("interpretReading returns layered local result", () => {
  const reading = createReading({
    topicId: "love",
    spreadId: "three",
    rng: fakeRng(Array.from({ length: 140 }, (_, index) => index * 29 + 5))
  });
  const interpretation = interpretReading(reading);
  assert.ok(interpretation.oneLine.length > 30);
  assert.equal(interpretation.cardInterpretations.length, 3);
  assert.ok(interpretation.actions.length >= 2);
  assert.ok(interpretation.questions.length >= 2);
});

test("source code does not use Math.random", () => {
  const files = listFiles(join(process.cwd(), "src")).filter((file) => file.endsWith(".js"));
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.equal(source.includes("Math.random"), false, file);
  }
});

test("public UI omits helper prompt copy called out in review", () => {
  const index = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const spreads = readFileSync(join(process.cwd(), "src", "data", "spreads.js"), "utf8");
  const styles = readFileSync(join(process.cwd(), "styles.css"), "utf8");

  assert.equal(index.includes("你的问题，可不填"), false);
  assert.equal(index.includes("你的问题不会被上传"), false);
  assert.equal(spreads.includes("定向不是绝对预言"), false);
  assert.equal(styles.includes("resize: none"), true);
});

test("API panel copy is local-only without public-key warning language", () => {
  const index = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const providers = readFileSync(join(process.cwd(), "src", "data", "apiProviders.js"), "utf8");

  assert.equal(index.includes("仅用于本机使用，不会公开"), true);
  assert.equal(index.includes("公开网页中直接使用 API key 有暴露风险"), false);
  assert.equal(index.includes("后端代理"), false);
  assert.equal((providers.match(/note: "仅用于本机使用，不会公开。"/g) || []).length, 8);
  assert.equal(providers.includes("公开部署"), false);
  assert.equal(providers.includes("公开仓库"), false);
  assert.equal(providers.includes("公开网页"), false);
  assert.equal(providers.includes("后端代理"), false);
});

test("shuffle animation and button flow only run one ritual at a time", () => {
  const index = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");
  const styles = readFileSync(join(process.cwd(), "styles.css"), "utf8");
  const performShuffle = app.match(/function performShuffle\(\) \{[\s\S]*?\n\}/)?.[0] || "";

  const ritualActions = index.match(/<div class="ritual-actions">[\s\S]*?<\/div>/)?.[0] || "";
  assert.equal(index.includes('class="deck-control"'), true);
  assert.equal(index.includes('class="primary-button deck-shuffle-button" id="shuffleButton"'), true);
  assert.equal(ritualActions.includes('id="shuffleButton"'), false);
  assert.equal(app.includes('const INITIAL_STAGE_STATUS = "请先进行洗牌";'), true);
  assert.equal(index.includes('id="stageStatus">请先进行洗牌</div>'), true);
  assert.equal(app.includes("正在洗牌："), true);
  assert.equal(app.includes("牌面与正逆位将由 Web Crypto 独立生成"), false);
  assert.equal(styles.includes(".deck-control"), true);
  assert.equal(index.includes('class="shuffle-ritual"'), true);
  assert.equal(styles.includes(".deck-stack.is-shuffling ~ .shuffle-ritual"), true);
  assert.equal(styles.includes("@keyframes shuffleCardFan"), true);
  assert.equal(styles.includes("@keyframes shuffleRunePulse"), true);
  assert.equal(/animation:\s*shuffle(?:Pulse|Top|Middle|Bottom)[^;]*\s2\s*;/.test(styles), false);
  assert.equal(/function performShuffle\(\) \{\s*if \(state\.dealing\)/.test(app), true);
  assert.equal(performShuffle.includes("finally"), false);
});

test("completed reading shows a mystical downward result cue once", () => {
  const index = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");
  const styles = readFileSync(join(process.cwd(), "styles.css"), "utf8");

  assert.equal(index.includes('id="resultCue"'), true);
  assert.equal(app.includes("els.resultCue"), true);
  assert.equal(app.includes("state.interpretation"), true);
  assert.equal(styles.includes(".result-cue.is-visible"), true);
  assert.equal(styles.includes("@keyframes resultCueDrift"), true);
}
);

test("topic choice drives page atmosphere and ritual copy", () => {
  const index = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");
  const styles = readFileSync(join(process.cwd(), "styles.css"), "utf8");

  assert.equal(index.includes('id="topicOracle"'), true);
  assert.equal(app.includes("TOPIC_THEMES"), true);
  assert.equal(app.includes("function applyTopicTheme"), true);
  assert.equal(app.includes("document.body.dataset.topic = state.topicId"), true);
  assert.equal(styles.includes('body[data-topic="love"]'), true);
  assert.equal(styles.includes('body[data-topic="money"]'), true);
  assert.equal(styles.includes(".table-stage::before"), true);
});

test("dealing and flipping use slower staged ritual motion", () => {
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");
  const styles = readFileSync(join(process.cwd(), "styles.css"), "utf8");

  assert.equal(app.includes("const SHUFFLE_DURATION_MS = 1500"), true);
  assert.equal(app.includes("const DEAL_STAGGER_MS = 260"), true);
  assert.equal(app.includes("const FLIP_RESULT_DELAY_MS = 1180"), true);
  assert.equal(app.includes('button.classList.add("is-revealing")'), true);
  assert.equal(styles.includes("animation: dealFromDeck 920ms"), true);
  assert.equal(styles.includes("animation-delay: calc(var(--deal-index) * 260ms)"), true);
  assert.equal(styles.includes(".card-button.is-revealing .card-shell"), true);
  assert.equal(styles.includes("@keyframes flipSigilBloom"), true);
  assert.equal(styles.includes(".reading-item.orientation-reversed"), true);
});

test("flip interface has a richer ritual layer", () => {
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");
  const styles = readFileSync(join(process.cwd(), "styles.css"), "utf8");

  assert.equal(app.includes('class="flip-ritual-layer"'), true);
  assert.equal(app.includes('class="flip-rune rune-north"'), true);
  assert.equal(app.includes('drawCard?.classList.add("is-revealing-card")'), true);
  assert.equal(styles.includes(".flip-ritual-layer"), true);
  assert.equal(styles.includes(".draw-card.is-revealing-card::before"), true);
  assert.equal(styles.includes(".card-button.is-revealing .flip-ritual-layer"), true);
  assert.equal(styles.includes("@keyframes flipRuneOrbit"), true);
  assert.equal(styles.includes("@keyframes flipVeilOpen"), true);
  assert.equal(styles.includes(".card-button.orientation-reversed.is-revealing .flip-rune"), true);
});

test("Pipi greeting is temporary and does not reveal hidden-easter-egg copy", () => {
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");

  assert.equal(app.includes("const PIPI_GREETING_MS = 5000"), true);
  assert.equal(app.includes('"皮皮向你问好"'), true);
  assert.equal(app.includes("隐藏彩蛋：皮皮出来绕场一圈。"), false);
  assert.equal(app.includes("皮皮跑完一圈，渡鸦回来了。"), false);
});

test("local-only result has enough depth without API", () => {
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");
  const reading = createReading({
    topicId: "self",
    spreadId: "relationship",
    rng: fakeRng(Array.from({ length: 180 }, (_, index) => index * 31 + 9))
  });
  const interpretation = interpretReading(reading);

  assert.ok(interpretation.depthNote.length > 40);
  assert.ok(interpretation.orientationPattern.length > 40);
  assert.ok(interpretation.elementFocus.length > 40);
  assert.ok(interpretation.cardInterpretations.every((item) => item.warning));
  assert.ok(interpretation.cardInterpretations.every((item) => item.reflectionQuestions.length >= 2));
  assert.equal(app.includes("本地解读说明"), true);
  assert.equal(app.includes("card-warning"), true);
  assert.equal(app.includes("reflection-list"), true);
});

test("result depth fields are cache-busted and cannot render undefined text", () => {
  const index = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");

  assert.equal(index.includes("20260603-ritual2"), true);
  assert.equal(app.includes('../engine/interpret.js?v=20260603-ritual2'), true);
  assert.equal(app.includes('from "../engine/interpret.js";'), false);
  assert.equal(app.includes("function depthParagraphHtml"), true);
  assert.equal(app.includes("${escapeHtml(interpretation.elementFocus)}</p>"), false);
  assert.equal(app.includes("${escapeHtml(interpretation.orientationPattern)}</p>"), false);
  assert.equal(app.includes("${escapeHtml(interpretation.depthNote)}</p>"), false);
});

test("raven easter egg stays undisclosed until animal appears", () => {
  const index = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const app = readFileSync(join(process.cwd(), "src", "ui", "app.js"), "utf8");

  assert.equal(index.includes('title="渡鸦彩蛋"'), false);
  assert.equal(app.includes('setAttribute("title", "渡鸦彩蛋")'), false);
  assert.ok(app.includes("contextmenu"));
});

test("raven easter egg has 100 generated animal PNG assets", () => {
  assert.equal(ANIMAL_GALLERY.length, 100);
  assert.equal(new Set(ANIMAL_GALLERY.map((animal) => animal.slug)).size, 100);

  for (const animal of ANIMAL_GALLERY) {
    const imagePath = join(process.cwd(), "assets", "animals", "generated", `${animal.slug}.png`);
    assert.equal(statSync(imagePath).isFile(), true, animal.slug);
    assert.deepEqual([...readFileSync(imagePath).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], animal.slug);
  }
});

test("personal Pipi easter egg asset exists", () => {
  const imagePath = join(process.cwd(), "assets", "animals", "pipi-codex-dog.png");
  assert.equal(statSync(imagePath).isFile(), true);
  assert.deepEqual([...readFileSync(imagePath).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});

console.log("All engine checks passed.");
