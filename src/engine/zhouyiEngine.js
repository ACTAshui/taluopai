import {
  COIN_SIDES,
  EARTHLY_HOURS,
  LINE_POSITIONS,
  TRIGRAMS,
  XIAO_LIU_REN_PALACES,
  getHexagram,
  getTrigramByBits,
  getTrigramByNumber
} from "../data/zhouyi.js";
import { secureRandomInt } from "./random.js";

const GENERATES = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木"
};

const CONTROLS = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木"
};

function normalizeModulo(value, modulo) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    throw new Error("起课数字必须是有效数字。");
  }
  const normalized = Math.trunc(Math.abs(numeric)) % modulo;
  return normalized === 0 ? modulo : normalized;
}

function requireIntegerRange(value, min, max, label) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < min || numeric > max) {
    throw new Error(`${label}必须是 ${min}-${max} 的整数。`);
  }
  return numeric;
}

function randomCoin(rng) {
  return secureRandomInt(2, rng) === 0 ? COIN_SIDES.front.id : COIN_SIDES.back.id;
}

export function castCoinLine(coins) {
  if (!Array.isArray(coins) || coins.length !== 3) {
    throw new Error("每一爻需要三枚铜钱。");
  }

  const normalizedCoins = coins.map((side) => {
    if (!COIN_SIDES[side]) {
      throw new Error("铜钱只能输入正面或反面。");
    }
    return side;
  });
  const total = normalizedCoins.reduce((sum, side) => sum + COIN_SIDES[side].value, 0);
  const yang = total % 2 === 1;
  const moving = total === 6 || total === 9;
  const lineName = total === 6 ? "老阴" : total === 7 ? "少阳" : total === 8 ? "少阴" : "老阳";

  return {
    coins: normalizedCoins,
    total,
    yang,
    moving,
    name: lineName,
    symbol: yang ? "阳" : "阴",
    changedYang: moving ? !yang : yang
  };
}

export function castRandomCoinLine(rng = globalThis.crypto) {
  return castCoinLine([randomCoin(rng), randomCoin(rng), randomCoin(rng)]);
}

function hexagramFromLines(lines) {
  const lower = getTrigramByBits(lines.slice(0, 3).map((line) => (line.yang ? 1 : 0)));
  const upper = getTrigramByBits(lines.slice(3, 6).map((line) => (line.yang ? 1 : 0)));
  return getHexagram(upper.id, lower.id);
}

function changedHexagramFromLines(lines) {
  const changedLines = lines.map((line) => ({ ...line, yang: line.changedYang }));
  return {
    lines: changedLines,
    hexagram: hexagramFromLines(changedLines)
  };
}

function lineTone(line, index) {
  const position = LINE_POSITIONS[index];
  if (!line.moving) {
    return `${position}为${line.name}，气机暂定，可作为本卦结构的一部分来看。`;
  }
  if (line.yang) {
    return `${position}为老阳，阳气已极，提示这一层需要从推进转为收束。`;
  }
  return `${position}为老阴，阴气已极，提示这一层正在由潜伏转向显现。`;
}

function richSection(title, lead, detail, points = []) {
  const pointText = points.length ? ` ${points.join(" ")}` : "";
  return {
    title,
    lead,
    detail,
    points,
    body: `${lead} ${detail}${pointText}`.trim()
  };
}

function positionFocus(index) {
  return [
    "初爻多看事情刚开始的根基、动机和第一步是否站稳。",
    "二爻多看执行位置、协作关系和是否有人愿意实际承接。",
    "三爻多看进退之间的压力，容易出现急躁、越位或试错。",
    "四爻多看外部环境、上层规则和事情能否从内部走向外部。",
    "五爻多看主事者、核心资源和决定权是否清楚。",
    "上爻多看尾声、收束和继续推进是否已经过度。"
  ][index];
}

function movingSummary(lines) {
  const movingLines = lines
    .map((line, index) => ({ line, index }))
    .filter((item) => item.line.moving);

  if (movingLines.length === 0) {
    return {
      label: "无动爻",
      text: "本卦气机较稳，重点不在突发变化，而在把当前结构看清、守住节奏。"
    };
  }

  const labels = movingLines.map((item) => LINE_POSITIONS[item.index]).join("、");
  const details = movingLines.map((item) => lineTone(item.line, item.index)).join("");
  return {
    label: `${labels}动`,
    text: `${labels}为本课转折处。${details}`
  };
}

function coinNarrative({ hexagram, changedHexagram, lines, question }) {
  const moving = movingSummary(lines);
  const movingLines = lines
    .map((line, index) => ({ line, index }))
    .filter((item) => item.line.moving);
  const changeText = changedHexagram
    ? `细看时，之卦为第 ${changedHexagram.number} 卦「${changedHexagram.name}」，它不是另起一件事，而是本卦经过动爻之后可能呈现的落点。${changedHexagram.theme} 因此读后势时，要把它当成“变化后的环境”，不要把它当成已经发生的结果。`
    : "细看时，本课没有动爻，不另取之卦。它更像是在提示当前结构本身已经足够说明问题：先把本卦的边界、资源和节奏看清，再决定是否需要改变做法。";
  const movingDetail = movingLines.length
    ? movingLines
        .map((item) => `${LINE_POSITIONS[item.index]}：${lineTone(item.line, item.index)}${positionFocus(item.index)}`)
        .join("")
    : "本课无动爻，说明变化点不集中在某一个位置。此时不必急着寻找“马上会变”的地方，更应检查当前安排是否稳定、边界是否清楚、节奏是否被外部噪声打乱。";

  return {
    headline: `${hexagram.name}${changedHexagram ? `之${changedHexagram.name}` : ""}`,
    oneLine: `本卦为第 ${hexagram.number} 卦「${hexagram.name}」，${hexagram.upper.name}上${hexagram.lower.name}下。先看这件事的基本结构，再看动爻如何把局面推向下一层。`,
    sections: [
      richSection(
        "本卦气象",
        `先看本卦：「${hexagram.name}」给出这件事的底色，重点是${hexagram.theme}`,
        `细看时，上卦为${hexagram.upper.name}${hexagram.upper.symbol}，象${hexagram.upper.nature}，偏向外部形势、他人回应和事情表层可见的压力；下卦为${hexagram.lower.name}${hexagram.lower.symbol}，象${hexagram.lower.nature}，偏向内在根基、真实动机和已经具备的条件。上卦主${hexagram.upper.tone}，下卦主${hexagram.lower.tone}，两者合在一起看，能分清“外面看起来如何”和“里面真正支撑什么”。`,
        [
          "先不要只问吉凶，先问这件事现在靠什么成立。",
          "若上下卦气质相冲，行动前要把外部期待和内部资源分开。"
        ]
      ),
      richSection(
        "动爻关口",
        `先看变化点：${moving.label}。动爻不是装饰，它标出本课最容易发生转折、消耗或显化的位置。`,
        `细看时，${movingDetail}`,
        [
          "老阳多提示由盛转收，宜防用力过度。",
          "老阴多提示由隐转显，宜防问题拖到表面后才处理。"
        ]
      ),
      richSection(
        "后势取向",
        changedHexagram
          ? `先看后势：之卦为第 ${changedHexagram.number} 卦「${changedHexagram.name}」，说明动爻之后局面可能转入的新结构。`
          : "先看后势：本课没有动爻，所以不另立之卦，后续仍以本卦的结构为主。",
        changeText,
        [
          "之卦看趋势，不等于事情已经定局。",
          "把后势当作提前排查风险和准备承接动作的依据。"
        ]
      ),
      richSection(
        "当下可行",
        question
          ? "先把问题缩成一个能被现实反馈验证的小动作，不要急着把全部资源压上去。"
          : "先把这课当作整理问题的参考：它适合帮助你分辨阻力、节奏和下一步的轻重缓急。",
        question
          ? "细看时，真正有效的下一步应该能在短时间内得到回应，例如一次确认、一份书面记录、一个小范围试做，或一次边界清楚的沟通。等事实回声清楚后，再决定是否扩大投入。"
          : "细看时，可以先观察三件事：阻力来自外部环境还是自身节奏，当前有没有可验证的信息缺口，以及哪一步最小却能改变局面。象意只提供整理视角，不替代现实证据。",
        [
          "先做能验证的事，再做高成本的事。",
          "先守住边界，再讨论推进速度。"
        ]
      )
    ]
  };
}

export function createCoinReading({ question = "", manualLines = null, rng = globalThis.crypto } = {}) {
  const lines = manualLines
    ? manualLines.map((coins) => castCoinLine(coins))
    : Array.from({ length: 6 }, () => castRandomCoinLine(rng));

  if (lines.length !== 6) {
    throw new Error("六爻铜钱法需要自下而上六爻。");
  }

  const hexagram = hexagramFromLines(lines);
  const movingCount = lines.filter((line) => line.moving).length;
  const changed = movingCount > 0 ? changedHexagramFromLines(lines) : null;
  const interpretation = coinNarrative({
    hexagram,
    changedHexagram: changed?.hexagram || null,
    lines,
    question
  });

  return {
    methodId: "liuyao",
    methodName: "六爻铜钱",
    source: manualLines ? "manual-coins" : "web-crypto-coins",
    algorithm: "Web Crypto coin casts",
    question: question.trim(),
    lines,
    hexagram,
    changedHexagram: changed?.hexagram || null,
    changedLines: changed?.lines || null,
    moving: movingSummary(lines),
    interpretation
  };
}

function currentEarthlyHour(date) {
  const hour = date.getHours();
  const index = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  return EARTHLY_HOURS[index];
}

export function createXiaoLiuRenReading({
  question = "",
  lunarMonth,
  lunarDay,
  hourBranch,
  date = new Date()
} = {}) {
  const hasManualTime = Boolean(lunarMonth && lunarDay && hourBranch);
  const currentHour = currentEarthlyHour(date);
  const month = hasManualTime ? requireIntegerRange(Number(lunarMonth), 1, 12, "农历月") : date.getMonth() + 1;
  const day = hasManualTime ? requireIntegerRange(Number(lunarDay), 1, 30, "农历日") : ((date.getDate() - 1) % 30) + 1;
  const hourIndex = hasManualTime
    ? EARTHLY_HOURS.findIndex((hour) => hour.id === hourBranch || hour.branch === hourBranch)
    : EARTHLY_HOURS.findIndex((hour) => hour.id === currentHour.id);

  if (hourIndex < 0) {
    throw new Error("请选择有效时辰。");
  }

  const palaceIndex = (month - 1 + day - 1 + hourIndex) % XIAO_LIU_REN_PALACES.length;
  const palace = XIAO_LIU_REN_PALACES[palaceIndex];
  const hour = EARTHLY_HOURS[hourIndex];

  return {
    methodId: "xiaoliuren",
    methodName: "小六壬",
    source: hasManualTime ? "manual-lunar-time" : "local-date-time",
    algorithm: hasManualTime ? "农历月日时递数落六宫" : "本机日期时辰递数落六宫",
    question: question.trim(),
    month,
    day,
    hour,
    palace,
    formula: `(${month}-1 + ${day}-1 + ${hourIndex + 1}-1) mod 6 = ${palaceIndex + 1}`,
    interpretation: {
      headline: palace.name,
      oneLine: `本课落在「${palace.name}」，气口为「${palace.tone}」。先看当下状态，再看宜避与可做之事。`,
      sections: [
        richSection(
          "六宫判断",
          `先看所落六宫：${palace.name}主${palace.tone}，这代表眼下的气口更接近「${palace.image}」。`,
          `细看时，${palace.reading} 此宫属${palace.element}，可把它理解为当前局面的主要温度：它不直接替你判定成败，而是提示现在更适合稳、等、沟通、避争、取小利，还是先验空处。`,
          [
            "先判断当下气口，再判断要不要推进。",
            "同一宫位在不同问题里含义不同，必须回到所问之事。"
          ]
        ),
        richSection(
          "需要避开",
          `先避开最容易误判的地方：${palace.caution}`,
          "细看时，小六壬的优势是快，但快不等于粗。越想立刻得到答案，越要检查信息是否完整、对方态度是否真实、承诺是否落到行动。若这里有缺口，先补缺口，不要把情绪当证据。",
          [
            "少用猜测替代确认。",
            "少在情绪最重的时候做不可逆决定。"
          ]
        ),
        richSection(
          "当下可行",
          `先做可落地的一步：${palace.action}`,
          "细看时，最好选择能被回应、能被记录、能被检查的动作。比如发出明确问题、确认时间节点、缩小投入范围、保留沟通凭据，或者先完成一件能让局面变清楚的小事。",
          [
            "动作越小，反馈越快。",
            "反馈越清楚，下一步越不容易误判。"
          ]
        ),
        richSection(
          "取数说明",
          hasManualTime
            ? `先说明取数：本课以农历 ${month} 月 ${day} 日 ${hour.branch}时递数，落在第 ${palaceIndex + 1} 宫。`
            : `先说明取数：本课以本机当前日期 ${month} 月 ${day} 日与${hour.branch}时递数，落在第 ${palaceIndex + 1} 宫。`,
          hasManualTime
            ? "细看时，月、日、时只是排宫依据，不是独立结论。真正的判断要把所落宫位、你所问的事情、现实里的信息完整度和当时处境合在一起看。"
            : "细看时，同一日期与同一时辰内结果保持稳定，跨入新时辰后才会改变。这个稳定性是为了避免同一问题反复点击造成结果跳动，也让你能把注意力放回现实判断。",
          [
            "取数说明用于复核，不用于制造神秘感。",
            "同一问题不宜短时间反复起课。"
          ]
        )
      ]
    }
  };
}

function relationBetween(bodyElement, useElement) {
  if (bodyElement === useElement) {
    return {
      label: "比和",
      text: "体用同气，事情内外同频，宜顺势推进，但要防路径单一。"
    };
  }
  if (GENERATES[useElement] === bodyElement) {
    return {
      label: "用生体",
      text: "外部条件回生自身，容易得到助力、消息或资源。"
    };
  }
  if (GENERATES[bodyElement] === useElement) {
    return {
      label: "体生用",
      text: "自己在输出给外部，能成事，但要留意消耗。"
    };
  }
  if (CONTROLS[useElement] === bodyElement) {
    return {
      label: "用克体",
      text: "外部压力较强，宜降低风险敞口，先守后动。"
    };
  }
  if (CONTROLS[bodyElement] === useElement) {
    return {
      label: "体克用",
      text: "自身能制约局面，但用力过猛会让关系变紧。"
    };
  }
  return {
    label: "相参",
    text: "体用关系需要结合具体问题细看，宜以现实反馈为准。"
  };
}

function dateNumberParts(date) {
  const hour = currentEarthlyHour(date);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hourIndex: EARTHLY_HOURS.findIndex((item) => item.id === hour.id) + 1,
    hour
  };
}

export function createMeihuaReading({
  question = "",
  upperNumber,
  lowerNumber,
  movingNumber,
  date = new Date()
} = {}) {
  const timeParts = dateNumberParts(date);
  const isManual = upperNumber != null && lowerNumber != null && movingNumber != null;
  const upperNum = isManual
    ? normalizeModulo(upperNumber, 8)
    : normalizeModulo(timeParts.year + timeParts.month + timeParts.day, 8);
  const lowerNum = isManual
    ? normalizeModulo(lowerNumber, 8)
    : normalizeModulo(timeParts.year + timeParts.month + timeParts.day + timeParts.hourIndex, 8);
  const movingLine = isManual
    ? normalizeModulo(movingNumber, 6)
    : normalizeModulo(timeParts.year + timeParts.month + timeParts.day + timeParts.hourIndex, 6);
  const upper = getTrigramByNumber(upperNum);
  const lower = getTrigramByNumber(lowerNum);
  const hexagram = getHexagram(upper.id, lower.id);
  const lines = [...lower.bits, ...upper.bits].map((bit, index) => ({
    yang: bit === 1,
    moving: index + 1 === movingLine,
    changedYang: index + 1 === movingLine ? bit !== 1 : bit === 1,
    name: bit === 1 ? "阳爻" : "阴爻"
  }));
  const changed = changedHexagramFromLines(lines);
  const body = movingLine <= 3 ? upper : lower;
  const use = movingLine <= 3 ? lower : upper;
  const relation = relationBetween(body.element, use.element);

  return {
    methodId: "meihua",
    methodName: "梅花易数",
    source: isManual ? "manual-numbers" : "local-time",
    algorithm: isManual ? "三数取卦" : "年月日时取卦",
    question: question.trim(),
    numbers: {
      upper: upperNum,
      lower: lowerNum,
      moving: movingLine,
      timeParts
    },
    body,
    use,
    relation,
    lines,
    hexagram,
    changedHexagram: changed.hexagram,
    changedLines: changed.lines,
    moving: {
      label: `${LINE_POSITIONS[movingLine - 1]}动`,
      text: `${LINE_POSITIONS[movingLine - 1]}为动爻，动处为用，静处为体。`
    },
    interpretation: {
      headline: `${hexagram.name}之${changed.hexagram.name}`,
      oneLine: `本卦为第 ${hexagram.number} 卦「${hexagram.name}」，动${LINE_POSITIONS[movingLine - 1]}，体用为${relation.label}。先看内外关系，再看动处如何引发变化。`,
      sections: [
        richSection(
          "本卦与变卦",
          `先看卦象组合：${upper.name}上${lower.name}下为「${hexagram.name}」，动后之卦为「${changed.hexagram.name}」。`,
          `细看时，本卦说明当下结构，变卦说明动爻之后可能显出的新局面。${hexagram.theme}${changed.hexagram.theme} 读梅花时不要只看卦名好坏，更要看变化从哪里发动、最后落到哪一种关系里。`,
          [
            "本卦看现在，变卦看变化后的承接。",
            "卦意要和问题场景合读，不能脱离现实。"
          ]
        ),
        richSection(
          "体用关系",
          `先看体用：本课为${relation.label}，这是判断内外关系的核心。`,
          `细看时，体卦为${body.name}${body.symbol}，属${body.element}，更像自身立场、根基和可控部分；用卦为${use.name}${use.symbol}，属${use.element}，更像外部对象、环境压力和回应方式。${relation.text}`,
          [
            "体弱时先补自身条件，不急着求外部配合。",
            "用强时先降低风险敞口，再谈推进。"
          ]
        ),
        richSection(
          "动爻提示",
          `先看动处：${LINE_POSITIONS[movingLine - 1]}动，动处代表这件事最先出现松动或压力的位置。`,
          `细看时，变化更可能先从${movingLine <= 3 ? "内在根基、执行细节或自身状态" : "外部环境、他人回应或显性结果"}发生。${positionFocus(movingLine - 1)} 这并不是说其他层面不重要，而是提醒你先把最容易变动的层面盯住。`,
          [
            "动处适合优先检查。",
            "静处适合保留稳定，不必无端折腾。"
          ]
        ),
        richSection(
          "当下可行",
          "先做一个低成本、可回收的试探，让外部反馈来校准判断。",
          "细看时，梅花易数适合帮助你整理“我与事、内与外、动与静”的关系。它不能替代现实信息，所以最好的用法是把象意转成一个可以验证的问题：谁在推动，谁在承受，哪里先变，下一步用多大成本去试。",
          [
            "先问清楚关系，再决定动作。",
            "先用小反馈校准，再做大判断。"
          ]
        )
      ]
    }
  };
}

export function toZhouyiRecord(reading) {
  if (!reading) {
    return null;
  }
  return {
    method: reading.methodName,
    source: reading.source,
    algorithm: reading.algorithm,
    question: reading.question || "",
    primaryHexagram: reading.hexagram
      ? `${reading.hexagram.number} ${reading.hexagram.name} (${reading.hexagram.upper.name}上${reading.hexagram.lower.name}下)`
      : null,
    changedHexagram: reading.changedHexagram
      ? `${reading.changedHexagram.number} ${reading.changedHexagram.name}`
      : null,
    moving: reading.moving?.label || null,
    xiaoLiuRen: reading.palace ? `${reading.palace.name} ${reading.palace.tone}` : null,
    createdAt: new Date().toISOString()
  };
}

export function formatZhouyiForShare(reading) {
  if (!reading) {
    return "";
  }
  const sections = reading.interpretation.sections
    .map((section) => {
      const lines = [`【${section.title}】`, section.lead || section.body];
      if (section.detail) {
        lines.push(section.detail);
      }
      if (section.points?.length) {
        lines.push(section.points.map((point) => `- ${point}`).join("\n"));
      }
      return lines.join("\n");
    })
    .join("\n\n");
  return [
    `玄衡易台 / ${reading.methodName}`,
    reading.question ? `所问：${reading.question}` : "所问：未填写",
    reading.interpretation.oneLine,
    sections
  ].join("\n\n");
}

export function trigramLinesForDisplay(trigramId) {
  return TRIGRAMS.find((trigram) => trigram.id === trigramId)?.bits || TRIGRAMS[0].bits;
}
