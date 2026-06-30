export const METHOD_DEFS = [
  {
    id: "liuyao",
    name: "六爻铜钱",
    shortName: "六爻",
    subtitle: "三钱成爻，六爻成卦",
    description: "适合看一件事的结构、转折和后续趋势。",
    accent: "bronze"
  },
  {
    id: "xiaoliuren",
    name: "小六壬",
    shortName: "六壬",
    subtitle: "月日时递数，落六宫",
    description: "适合快速判断当下气口、阻滞和可试探的方向。",
    accent: "cinnabar"
  },
  {
    id: "meihua",
    name: "梅花易数",
    shortName: "梅花",
    subtitle: "以数起卦，体用观变",
    description: "适合用时间或心念数字看事物的内外关系。",
    accent: "jade"
  }
];

export const TRIGRAMS = [
  {
    id: "qian",
    number: 1,
    name: "乾",
    symbol: "☰",
    nature: "天",
    image: "健",
    element: "金",
    direction: "西北",
    bits: [1, 1, 1],
    tone: "刚健、主动、向上展开",
    counsel: "宜正面推进，但要给节奏留出回旋。"
  },
  {
    id: "dui",
    number: 2,
    name: "兑",
    symbol: "☱",
    nature: "泽",
    image: "悦",
    element: "金",
    direction: "西方",
    bits: [1, 1, 0],
    tone: "沟通、交换、轻盈开口",
    counsel: "宜先把话说清，把利害和感受分开放。"
  },
  {
    id: "li",
    number: 3,
    name: "离",
    symbol: "☲",
    nature: "火",
    image: "丽",
    element: "火",
    direction: "南方",
    bits: [1, 0, 1],
    tone: "照见、辨明、依附成形",
    counsel: "宜看清事实与证据，不急着被情绪带走。"
  },
  {
    id: "zhen",
    number: 4,
    name: "震",
    symbol: "☳",
    nature: "雷",
    image: "动",
    element: "木",
    direction: "东方",
    bits: [1, 0, 0],
    tone: "启动、惊醒、破局而出",
    counsel: "宜小步先动，动后再校准方向。"
  },
  {
    id: "xun",
    number: 5,
    name: "巽",
    symbol: "☴",
    nature: "风",
    image: "入",
    element: "木",
    direction: "东南",
    bits: [0, 1, 1],
    tone: "渗透、协商、渐入其内",
    counsel: "宜柔性进入，靠持续影响胜过一次用力。"
  },
  {
    id: "kan",
    number: 6,
    name: "坎",
    symbol: "☵",
    nature: "水",
    image: "陷",
    element: "水",
    direction: "北方",
    bits: [0, 1, 0],
    tone: "险中求通、隐情、反复试探",
    counsel: "宜先保安全边界，再寻找可通之处。"
  },
  {
    id: "gen",
    number: 7,
    name: "艮",
    symbol: "☶",
    nature: "山",
    image: "止",
    element: "土",
    direction: "东北",
    bits: [0, 0, 1],
    tone: "止定、边界、收束形势",
    counsel: "宜停一停，把不可越界处先标出来。"
  },
  {
    id: "kun",
    number: 8,
    name: "坤",
    symbol: "☷",
    nature: "地",
    image: "顺",
    element: "土",
    direction: "西南",
    bits: [0, 0, 0],
    tone: "承载、配合、厚积而成",
    counsel: "宜顺势承接，先把基础铺稳。"
  }
];

export const EARTHLY_HOURS = [
  { id: "zi", branch: "子", label: "子时 23:00-00:59" },
  { id: "chou", branch: "丑", label: "丑时 01:00-02:59" },
  { id: "yin", branch: "寅", label: "寅时 03:00-04:59" },
  { id: "mao", branch: "卯", label: "卯时 05:00-06:59" },
  { id: "chen", branch: "辰", label: "辰时 07:00-08:59" },
  { id: "si", branch: "巳", label: "巳时 09:00-10:59" },
  { id: "wu", branch: "午", label: "午时 11:00-12:59" },
  { id: "wei", branch: "未", label: "未时 13:00-14:59" },
  { id: "shen", branch: "申", label: "申时 15:00-16:59" },
  { id: "you", branch: "酉", label: "酉时 17:00-18:59" },
  { id: "xu", branch: "戌", label: "戌时 19:00-20:59" },
  { id: "hai", branch: "亥", label: "亥时 21:00-22:59" }
];

export const XIAO_LIU_REN_PALACES = [
  {
    id: "daan",
    name: "大安",
    element: "木",
    tone: "稳",
    image: "门庭安定，事有根基",
    reading: "大安主平稳。问事多有可守之处，先稳住基本盘，再谈推进。",
    caution: "怕急躁求变，也怕把稳定误看成停滞。",
    action: "先确认资源、时间和边界，再做一步确定动作。"
  },
  {
    id: "liulian",
    name: "留连",
    element: "土",
    tone: "滞",
    image: "水绕旧岸，话未说尽",
    reading: "留连主迟滞与牵连。事情不是不能动，而是仍被旧线索、旧情绪或未结事项拖住。",
    caution: "不要在信息不完整时强行定论。",
    action: "补一轮确认，把未回复、未交代、未完成的环节先清掉。"
  },
  {
    id: "suxi",
    name: "速喜",
    element: "火",
    tone: "喜",
    image: "灯火忽明，消息将至",
    reading: "速喜主消息、回应和短期顺风。适合主动沟通、递交、确认和争取窗口。",
    caution: "喜信来得快，也容易浅，别把一时顺利当作全局落定。",
    action: "趁窗口期发出清晰请求，并准备下一步承接。"
  },
  {
    id: "chikou",
    name: "赤口",
    element: "金",
    tone: "争",
    image: "口舌带锋，火星落刃",
    reading: "赤口主口舌、冲突、误会和锋利判断。此时要少说重话，多留证据。",
    caution: "最忌情绪化表达和未经核实的转述。",
    action: "把沟通改成书面要点，先降温，再处理实质问题。"
  },
  {
    id: "xiaoji",
    name: "小吉",
    element: "水",
    tone: "吉",
    image: "清泉入渠，小利可成",
    reading: "小吉主小成、小助力和渐进改善。大事未必立刻翻盘，小处却能见到可用的帮助。",
    caution: "不要贪大求全，宜从最轻的阻力处打开。",
    action: "选择一件能在短时间完成的小事，让局面先变得可控。"
  },
  {
    id: "kongwang",
    name: "空亡",
    element: "土",
    tone: "空",
    image: "堂前有影，手中未实",
    reading: "空亡主虚、散、未成形。眼下的想法或承诺可能还缺真实支撑。",
    caution: "不宜把愿望当结果，也不宜押上过高成本。",
    action: "先做验证，缩小投入，等证据落地后再扩大。"
  }
];

const hex = (number, name, theme) => ({ number, name, theme });

export const HEXAGRAM_MATRIX = {
  qian: {
    qian: hex(1, "乾", "刚健自强，宜以正道统领行动。"),
    dui: hex(10, "履", "履险如礼，越接近锋芒越要守分寸。"),
    li: hex(13, "同人", "同心于外，先明共同原则再共事。"),
    zhen: hex(25, "无妄", "不妄动，不妄求，顺真实而行。"),
    xun: hex(44, "姤", "意外相遇，先辨来意再决定靠近。"),
    kan: hex(6, "讼", "争端已起，宜留证据并求公正。"),
    gen: hex(33, "遯", "退不是败，是保全主动权。"),
    kun: hex(12, "否", "天地不交，先止损后求通。")
  },
  dui: {
    qian: hex(43, "夬", "决断在前，话要明，手要稳。"),
    dui: hex(58, "兑", "以悦相通，但不可只取表面和气。"),
    li: hex(49, "革", "旧局已熟，改变需有名分与时机。"),
    zhen: hex(17, "随", "顺势而随，随人亦要守住自心。"),
    xun: hex(28, "大过", "梁木承重，压力已过常度。"),
    kan: hex(47, "困", "困中守正，少消耗，多保存。"),
    gen: hex(31, "咸", "感而相应，先看真实触动。"),
    kun: hex(45, "萃", "人事聚集，宜定秩序与中心。")
  },
  li: {
    qian: hex(14, "大有", "光明在上，资源可用但忌骄满。"),
    dui: hex(38, "睽", "同处而异心，先承认差异。"),
    li: hex(30, "离", "明而又明，依附于正则成。"),
    zhen: hex(21, "噬嗑", "有梗须咬开，规则要落到实处。"),
    xun: hex(50, "鼎", "鼎新成器，适合重组方法与位置。"),
    kan: hex(64, "未济", "事将成而未成，最后一步更要谨慎。"),
    gen: hex(56, "旅", "人在途中，宜轻装、守礼、暂安。"),
    kun: hex(35, "晋", "光从地上升，宜循序见进。")
  },
  zhen: {
    qian: hex(34, "大壮", "势大而动，壮不可恃强。"),
    dui: hex(54, "归妹", "位置未正，关系或安排需校准。"),
    li: hex(55, "丰", "光盛事繁，盛时更要防遮蔽。"),
    zhen: hex(51, "震", "惊动之后，定神即是转机。"),
    xun: hex(32, "恒", "贵在持久，不贵一时用力。"),
    kan: hex(40, "解", "结可解，先松最紧的一处。"),
    gen: hex(62, "小过", "小事可过，大事宜守。"),
    kun: hex(16, "豫", "和乐能动众，但要防懈怠。")
  },
  xun: {
    qian: hex(9, "小畜", "小有积蓄，未到大放之时。"),
    dui: hex(61, "中孚", "内有诚信，外可相感。"),
    li: hex(37, "家人", "各安其位，内序清则外事顺。"),
    zhen: hex(42, "益", "有益可增，增在正处才长久。"),
    xun: hex(57, "巽", "柔入而行，持续渗透胜过强攻。"),
    kan: hex(59, "涣", "散局可化，先把人心聚回来。"),
    gen: hex(53, "渐", "鸿渐于陆，宜有次第。"),
    kun: hex(20, "观", "先观其象，再定其行。")
  },
  kan: {
    qian: hex(5, "需", "有所等待，养其力而候时。"),
    dui: hex(60, "节", "节制成形，边界即保护。"),
    li: hex(63, "既济", "已成之局，最怕成后松散。"),
    zhen: hex(3, "屯", "初生多难，先立根再求快。"),
    xun: hex(48, "井", "井养不穷，宜修复长期供给。"),
    kan: hex(29, "坎", "险中有险，诚实面对风险。"),
    gen: hex(39, "蹇", "行路受阻，换路胜过硬闯。"),
    kun: hex(8, "比", "亲比相依，先辨可依之人。")
  },
  gen: {
    qian: hex(26, "大畜", "大蓄其德，先藏器后出手。"),
    dui: hex(41, "损", "有所减损，反得其要。"),
    li: hex(22, "贲", "文饰可美，本质更要真。"),
    zhen: hex(27, "颐", "所养为何，决定后续气力。"),
    xun: hex(18, "蛊", "积弊待治，先找根源。"),
    kan: hex(4, "蒙", "蒙昧初开，宜求教与立规。"),
    gen: hex(52, "艮", "止于其所，止得其时即安。"),
    kun: hex(23, "剥", "剥落已见，宜守核心。")
  },
  kun: {
    qian: hex(11, "泰", "天地交泰，通达中仍需守正。"),
    dui: hex(19, "临", "临近其事，宜宽严并用。"),
    li: hex(36, "明夷", "明入地中，藏光以避伤。"),
    zhen: hex(24, "复", "一阳来复，转机从小处回返。"),
    xun: hex(46, "升", "顺势上升，贵在积累。"),
    kan: hex(7, "师", "众事需纪律，先定号令。"),
    gen: hex(15, "谦", "谦能载物，低处反有余地。"),
    kun: hex(2, "坤", "厚德载物，顺承而成。")
  }
};

export const LINE_POSITIONS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
export const COIN_SIDES = {
  front: { id: "front", label: "正", fullLabel: "正面", value: 2, yinYang: "阴值" },
  back: { id: "back", label: "反", fullLabel: "反面", value: 3, yinYang: "阳值" }
};

export function getMethod(methodId) {
  return METHOD_DEFS.find((method) => method.id === methodId) || METHOD_DEFS[0];
}

export function getTrigramById(id) {
  return TRIGRAMS.find((trigram) => trigram.id === id) || TRIGRAMS[0];
}

export function getTrigramByNumber(number) {
  return TRIGRAMS.find((trigram) => trigram.number === number) || TRIGRAMS[0];
}

export function getTrigramByBits(bits) {
  const key = bits.join("");
  return TRIGRAMS.find((trigram) => trigram.bits.join("") === key) || TRIGRAMS[0];
}

export function getHexagram(upperId, lowerId) {
  const upper = getTrigramById(upperId);
  const lower = getTrigramById(lowerId);
  const hexagram = HEXAGRAM_MATRIX[upper.id]?.[lower.id] || HEXAGRAM_MATRIX.qian.qian;
  return { ...hexagram, upper, lower };
}
