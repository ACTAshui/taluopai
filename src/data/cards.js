const topicText = {
  daily: "今天先把注意力放在一个可执行的小动作上，不需要急着得到完整答案。",
  love: "关系里的重点不是猜测对方，而是看见互动模式、真实需求和边界。",
  career: "工作层面的提示更偏向职责、协作、机会成本和下一步验证。",
  money: "资源问题需要同时看见安全感、实际预算和长期稳定，而不是只看一时冲动。",
  self: "这张牌更像是在提醒你观察自己的旧模式，并给出温和但清晰的修正。",
  choice: "面对选择时，先看清动机、代价和盲点，再做低风险试探。"
};

const majorCards = [
  ["major_00_fool", "愚者", "The Fool", "新开始", ["开始", "自由", "未知", "冒险", "轻装"], "踏出小而真实的一步，但别把没有计划误认为直觉。"],
  ["major_01_magician", "魔术师", "The Magician", "主动创造", ["资源", "表达", "行动", "专注", "显化"], "你手里已经有可用资源，关键是把想法转成具体动作。"],
  ["major_02_high_priestess", "女祭司", "The High Priestess", "内在直觉", ["直觉", "沉默", "观察", "秘密", "等待"], "先观察而不是立刻表态，答案可能藏在尚未说出口的部分。"],
  ["major_03_empress", "女皇", "The Empress", "滋养丰盛", ["滋养", "创造", "身体", "丰盛", "接纳"], "让事情有生长空间，同时照顾现实中的身体和情绪。"],
  ["major_04_emperor", "皇帝", "The Emperor", "结构边界", ["秩序", "责任", "边界", "稳定", "掌控"], "建立规则和边界会让局面更稳，但不要用控制替代理解。"],
  ["major_05_hierophant", "教皇", "The Hierophant", "传统与学习", ["规则", "信念", "学习", "传承", "社群"], "回到可信的经验、制度或导师，但也要分辨哪些规则已经不再适合你。"],
  ["major_06_lovers", "恋人", "The Lovers", "选择与联结", ["吸引", "选择", "价值观", "承诺", "关系"], "真正的选择来自价值观的一致，而不只是眼前的吸引。"],
  ["major_07_chariot", "战车", "The Chariot", "意志推进", ["推进", "纪律", "目标", "胜利", "整合"], "把分散的力量拉回同一个方向，行动会比犹豫更有答案。"],
  ["major_08_strength", "力量", "Strength", "温柔的力量", ["勇气", "耐心", "温柔", "自控", "修复"], "真正的力量不是压制，而是能稳定地面对自己的冲动和恐惧。"],
  ["major_09_hermit", "隐士", "The Hermit", "独处探寻", ["独处", "反省", "智慧", "寻找", "沉淀"], "暂时退后一步，会比继续卷入他人的声音更清楚。"],
  ["major_10_wheel_of_fortune", "命运之轮", "Wheel of Fortune", "周期转折", ["变化", "周期", "机会", "转折", "流动"], "局面正在转动，能做的是识别时机，而不是执着于旧节奏。"],
  ["major_11_justice", "正义", "Justice", "公平与因果", ["事实", "责任", "平衡", "判断", "契约"], "把事实、感受和责任分开看，结论会更清晰。"],
  ["major_12_hanged_man", "倒吊人", "The Hanged Man", "暂停换角度", ["暂停", "牺牲", "视角", "等待", "放下"], "暂停不是失败，而是在为新的理解腾出位置。"],
  ["major_13_death", "死神", "Death", "结束与更新", ["结束", "转化", "告别", "清理", "重生"], "有些阶段需要真正结束，新的空间才会出现。"],
  ["major_14_temperance", "节制", "Temperance", "调和与修复", ["调和", "耐心", "整合", "疗愈", "中道"], "不要极端推进，先找到能长期维持的节奏。"],
  ["major_15_devil", "恶魔", "The Devil", "执念与束缚", ["执念", "诱惑", "依赖", "恐惧", "欲望"], "看见自己被什么绑住，是恢复自由的第一步。"],
  ["major_16_tower", "高塔", "The Tower", "结构崩塌", ["震动", "揭露", "破局", "清醒", "重建"], "不稳的结构正在暴露问题，真正要做的是重建，而不是粉饰。"],
  ["major_17_star", "星星", "The Star", "希望与疗愈", ["希望", "疗愈", "信任", "清澈", "愿景"], "慢慢恢复信任，把目光放回长期愿景。"],
  ["major_18_moon", "月亮", "The Moon", "迷雾与潜意识", ["迷雾", "梦境", "不安", "直觉", "投射"], "不要急着给模糊的事下结论，先确认哪些是事实，哪些是想象。"],
  ["major_19_sun", "太阳", "The Sun", "清晰与生命力", ["清晰", "快乐", "公开", "活力", "成功"], "事情需要被照亮，坦诚和可见度会带来更多能量。"],
  ["major_20_judgement", "审判", "Judgement", "召唤与复盘", ["觉醒", "复盘", "召唤", "决定", "更新"], "一个旧阶段正在要求你做出更成熟的回应。"],
  ["major_21_world", "世界", "The World", "完成与整合", ["完成", "整合", "圆满", "旅行", "阶段"], "你正在接近一个阶段性完成，把经验整理出来会很重要。"]
];

const suits = [
  {
    id: "wands",
    nameCn: "权杖",
    nameEn: "Wands",
    element: "fire",
    symbol: "✦",
    theme: "行动、热情、创造力和推进力",
    gift: "把想法变成行动",
    warning: "冲得太快或只靠热情支撑"
  },
  {
    id: "cups",
    nameCn: "圣杯",
    nameEn: "Cups",
    element: "water",
    symbol: "☾",
    theme: "情感、关系、直觉和接纳",
    gift: "诚实面对感受",
    warning: "陷入想象或情绪回避"
  },
  {
    id: "swords",
    nameCn: "宝剑",
    nameEn: "Swords",
    element: "air",
    symbol: "◇",
    theme: "思考、沟通、判断和边界",
    gift: "把混乱说清楚",
    warning: "过度分析或语言伤人"
  },
  {
    id: "pentacles",
    nameCn: "星币",
    nameEn: "Pentacles",
    element: "earth",
    symbol: "◎",
    theme: "资源、身体、工作和长期稳定",
    gift: "落实到现实条件",
    warning: "过分保守或只看物质安全"
  }
];

const ranks = [
  ["01_ace", "一", "Ace", "新的种子", ["开端", "潜力", "机会", "萌芽", "邀请"], "有新的可能出现，值得先做小规模尝试。", "机会还没落地，可能需要确认动机和基本条件。"],
  ["02_two", "二", "Two", "选择与平衡", ["选择", "权衡", "平衡", "关系", "分配"], "你正在两个方向之间寻找平衡，先承认两边都有代价。", "犹豫拖延可能让问题变得更沉重。"],
  ["03_three", "三", "Three", "协作与扩展", ["协作", "成长", "扩展", "看见", "连接"], "事情需要外部协作或更宽的视野。", "合作中的期待不清会消耗能量。"],
  ["04_four", "四", "Four", "稳定与边界", ["稳定", "休整", "边界", "结构", "保护"], "建立稳定结构会让你更安心。", "过度防守可能让流动停下来。"],
  ["05_five", "五", "Five", "冲突与失衡", ["冲突", "损失", "摩擦", "竞争", "修正"], "冲突正在暴露真实问题，可以用它来修正方向。", "若只看输赢，可能错过问题背后的需求。"],
  ["06_six", "六", "Six", "支持与过渡", ["支持", "过渡", "回馈", "修复", "善意"], "来自他人或过去经验的支持可以帮助你过渡。", "不要因为依赖熟悉感而停在旧阶段。"],
  ["07_seven", "七", "Seven", "考验与策略", ["考验", "策略", "防守", "坚持", "辨别"], "你需要更有策略地保护重要目标。", "防御过强会让你听不见有价值的反馈。"],
  ["08_eight", "八", "Eight", "速度与纪律", ["速度", "训练", "推进", "重复", "效率"], "持续推进和重复练习会带来结果。", "忙碌不等于进展，先确认方向。"],
  ["09_nine", "九", "Nine", "临界与韧性", ["韧性", "临界", "疲惫", "收获", "坚持"], "你已经走到临界点，韧性和休息同样重要。", "过度紧绷会让你看不见其实可以求助。"],
  ["10_ten", "十", "Ten", "完成与负担", ["完成", "负担", "责任", "终点", "释放"], "一个阶段接近完成，适合整理责任和成果。", "如果所有责任都压在你身上，需要重新分配。"],
  ["11_page", "侍从", "Page", "学习与好奇", ["学习", "消息", "好奇", "起步", "试探"], "保持学习姿态，先允许自己不熟练。", "经验不足时，不要急着证明自己。"],
  ["12_knight", "骑士", "Knight", "行动与追求", ["行动", "追求", "速度", "方向", "冲劲"], "行动力正在聚集，关键是确认它服务于什么目标。", "急切会放大偏差，先给行动加上边界。"],
  ["13_queen", "王后", "Queen", "成熟与滋养", ["成熟", "接纳", "照顾", "掌握", "内在"], "用更成熟的方式照顾自己和局面。", "不要把照顾别人变成忽略自己。"],
  ["14_king", "国王", "King", "领导与掌控", ["领导", "掌控", "承担", "秩序", "远见"], "你需要承担主导权，并用规则让事情稳定。", "权威感若缺少倾听，会变成僵硬控制。"]
];

function buildMeaning({ summary, keywords, sentence, reversedSentence, cardName, theme, gift, warning }) {
  return {
    upright: {
      summary,
      keywords,
      general: sentence,
      love: `在关系中，${cardName}提醒你看见${theme}如何影响双方互动。它更支持${gift}，而不是把感受压下去。`,
      career: `在事业上，${cardName}强调${theme}。把它落实成一个可检查的下一步，会比停在想法里更有效。`,
      money: `在金钱和资源上，${cardName}提示你把${theme}放进现实条件里评估，先看预算、时间和安全边界。`,
      self: `在自我成长上，${cardName}邀请你练习${gift}，同时温和承认自己还没准备好的部分。`,
      choice: `面对选择时，${cardName}建议你用${theme}来检验两个方向：哪个更能支持真实而长期的你。`,
      advice: `先做一个小而可验证的行动，让局面给你反馈。`,
      warning,
      reflectionQuestions: ["我现在最想抓住的是什么？", "如果只做一步，哪一步最真实也最安全？"]
    },
    reversed: {
      summary: `受阻的${summary}`,
      keywords: keywords.map((keyword) => `${keyword}受阻`).slice(0, 3).concat(["延迟", "校准"]),
      general: reversedSentence,
      love: `在关系中，逆位的${cardName}说明${warning}可能正在影响沟通。先降低猜测，回到可说清的事实。`,
      career: `在事业上，逆位的${cardName}提示方向、节奏或边界需要校准。不要用忙碌掩盖真正的问题。`,
      money: `在资源问题上，逆位的${cardName}提醒你检查冲动、安全感和实际承受能力。`,
      self: `在自我成长上，逆位的${cardName}不是否定你，而是指出需要慢下来修正的地方。`,
      choice: `面对选择时，逆位的${cardName}建议先暂停承诺，补足信息，再看哪个方向更稳。`,
      advice: `把问题拆成事实、感受和假设三部分，先处理最能验证的一部分。`,
      warning,
      reflectionQuestions: ["我是不是把焦虑当成了直觉？", "哪一个条件没有确认前，不适合继续推进？"]
    }
  };
}

function makeMajorCard(item, index) {
  const [id, nameCn, nameEn, summary, keywords, sentence] = item;
  const meanings = buildMeaning({
    summary,
    keywords,
    sentence,
    reversedSentence: `${nameCn}逆位时，${summary}的能量可能被延迟、误用或卡住。先承认阻力，再调整节奏。`,
    cardName: nameCn,
    theme: summary,
    gift: keywords[0],
    warning: `留意${keywords[keywords.length - 1]}是否变成逃避现实的理由。`
  });
  return {
    id,
    nameCn,
    nameEn,
    aliases: [nameCn, nameEn],
    arcana: "major",
    number: index,
    element: "spirit",
    symbol: "✧",
    image: null,
    ...meanings
  };
}

function makeMinorCard(suit, rank, rankIndex) {
  const [rankId, rankCn, rankEn, summary, keywords, uprightSentence, reversedSentence] = rank;
  const id = `${suit.id}_${rankId}`;
  const nameCn = `${suit.nameCn}${rankCn}`;
  const nameEn = `${rankEn} of ${suit.nameEn}`;
  const meanings = buildMeaning({
    summary: `${summary}中的${suit.theme}`,
    keywords,
    sentence: `${nameCn}把${summary}放进${suit.theme}之中。它提醒你：${uprightSentence}`,
    reversedSentence: `${nameCn}逆位时，${suit.warning}可能让${summary}失去平衡。${reversedSentence}`,
    cardName: nameCn,
    theme: suit.theme,
    gift: suit.gift,
    warning: suit.warning
  });
  return {
    id,
    nameCn,
    nameEn,
    aliases: [nameCn, nameEn],
    arcana: "minor",
    suit: suit.id,
    number: rankIndex + 1,
    element: suit.element,
    symbol: suit.symbol,
    image: null,
    ...meanings
  };
}

export const TAROT_CARDS = [
  ...majorCards.map(makeMajorCard),
  ...suits.flatMap((suit) => ranks.map((rank, rankIndex) => makeMinorCard(suit, rank, rankIndex)))
];

export function getCard(cardId) {
  return TAROT_CARDS.find((card) => card.id === cardId);
}

export function topicMeaning(meaning, topicId) {
  return meaning[topicId] || meaning.general || topicText[topicId] || topicText.daily;
}
