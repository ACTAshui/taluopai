import { topicMeaning } from "../data/cards.js";

const actionPool = [
  "把问题拆成事实、感受和假设三部分，先处理最能验证的一部分。",
  "不要急着做最终决定，先做一次低风险的小测试。",
  "和相关的人进行一次具体沟通，避免只在心里推演。",
  "给自己设定一个观察期限，而不是无限期等待。",
  "把你真正害怕失去的东西写下来，它可能比问题本身更关键。",
  "把能立刻做的下一步缩小到十五分钟内可以完成的动作。"
];

function orientationLabel(orientation) {
  return orientation === "upright" ? "正位" : "逆位";
}

function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function leadingEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
}

function elementName(element) {
  return {
    fire: "火元素行动",
    water: "水元素情感",
    air: "风元素思考",
    earth: "土元素现实",
    spirit: "大阿卡那主题"
  }[element] || "复合主题";
}

export function interpretCard(item, topic) {
  const meaning = item.card[item.orientation];
  const topicLine = topicMeaning(meaning, topic.id);
  const keywords = meaning.keywords.slice(0, 5);

  return {
    positionLabel: item.position.label,
    cardName: item.card.nameCn,
    cardNameEn: item.card.nameEn,
    orientation: item.orientation,
    orientationLabel: orientationLabel(item.orientation),
    keywords,
    text: `在「${item.position.label}」位置，${item.card.nameCn}${orientationLabel(item.orientation)}指向「${keywords.join("、")}」。${item.position.prompt} 结合「${topic.name}」来看，${topicLine}`,
    advice: meaning.advice,
    warning: meaning.warning,
    reflectionQuestions: meaning.reflectionQuestions
  };
}

export function interpretReading(reading) {
  const cardInterpretations = reading.drawn.map((item) => interpretCard(item, reading.topic));
  const majorCount = reading.drawn.filter((item) => item.card.arcana === "major").length;
  const reversedCount = reading.drawn.filter((item) => item.orientation === "reversed").length;
  const elementCounts = countBy(reading.drawn, (item) => item.card.element || "spirit");
  const [mainElement, mainElementCount] = leadingEntry(elementCounts) || ["spirit", 0];
  const firstAdvice = cardInterpretations[0]?.advice || actionPool[0];
  const lastAdvice = cardInterpretations.at(-1)?.advice || actionPool[1];

  const mainTheme =
    majorCount >= Math.ceil(reading.drawn.length / 2)
      ? "这次牌阵的大阿卡那比例较高，问题更像是一个阶段性主题，而不只是某个小事件。"
      : `这次牌阵以${elementName(mainElement)}为主，说明当前问题更需要从这个层面切入。`;

  const reversedTheme =
    reversedCount === 0
      ? "全部正位说明能量相对顺畅，但仍需要把提示落实到行动。"
      : reversedCount >= Math.ceil(reading.drawn.length / 2)
        ? "逆位较多说明局面并非不能前进，而是需要先处理阻力、误解或节奏失衡。"
        : "少量逆位提示局面中存在需要校准的部分。";

  const narrative = `${mainTheme} ${reversedTheme} 从牌阵结构看，重点不是得到一个绝对答案，而是看见你可以如何把问题拆小、看清并行动。`;

  const actions = [
    firstAdvice,
    actionPool[(reading.drawn.length + reversedCount) % actionPool.length],
    lastAdvice
  ].filter((item, index, array) => array.indexOf(item) === index);

  const questions = cardInterpretations
    .flatMap((item) => item.reflectionQuestions)
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 4);

  return {
    headline: `${reading.spread.name} · ${reading.topic.shortName}`,
    oneLine: narrative,
    cardInterpretations,
    synthesis: `如果把这些牌连成一条线，它们更像是在说：先承认${elementName(mainElement)}正在占主导，再用具体行动检验你的理解。${mainElementCount > 1 ? "重复出现的元素说明这个主题不是偶然，而是当前最值得处理的层面。" : "即使只有一张牌，它也足够成为今天的观察入口。"}`,
    actions,
    questions
  };
}

export function formatReadingForShare(reading, interpretation, includeQuestion = false) {
  const lines = [
    `我的塔罗牌阵：${reading.spread.name} · ${reading.spread.subtitle}`,
    `主题：${reading.topic.name}`
  ];

  if (includeQuestion && reading.question) {
    lines.push(`问题：${reading.question}`);
  }

  lines.push("");
  reading.drawn.forEach((item) => {
    lines.push(`${item.position.label}：${item.card.nameCn} · ${orientationLabel(item.orientation)}`);
  });
  lines.push("", "整盘主题：", interpretation.oneLine, "", "行动建议：");
  interpretation.actions.forEach((action, index) => lines.push(`${index + 1}. ${action}`));
  lines.push("", "星幕塔罗 · Web Crypto 本地洗牌");
  return lines.join("\n");
}
