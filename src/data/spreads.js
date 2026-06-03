export const SPREADS = [
  {
    id: "single",
    name: "一张牌",
    subtitle: "今日指引",
    description: "快速获得一个主题、一句建议，适合第一次使用。",
    positions: [
      {
        id: "message",
        label: "今日提醒",
        role: "把注意力放回当下最重要的一件事",
        prompt: "这张牌像一个入口，提示你今天可以先看见什么。"
      }
    ]
  },
  {
    id: "three",
    name: "三张牌",
    subtitle: "过去 / 现在 / 建议",
    description: "最通用的牌阵，适合感情、事业和自我问题。",
    positions: [
      {
        id: "past",
        label: "过去",
        role: "影响当前问题的背景",
        prompt: "它说明眼前的问题并不是孤立出现的。"
      },
      {
        id: "present",
        label: "现在",
        role: "你正在面对的核心",
        prompt: "它把当前最需要处理的能量摆到桌面上。"
      },
      {
        id: "advice",
        label: "建议",
        role: "接下来可以采取的态度或行动",
        prompt: "它不替你做决定，而是给出可观察的行动线索。"
      }
    ]
  },
  {
    id: "choice",
    name: "选择牌阵",
    subtitle: "A / B / 隐藏因素 / 建议",
    description: "适合“我该不该做某事”或两个方向之间的比较。",
    positions: [
      {
        id: "optionA",
        label: "选项 A",
        role: "第一个方向的能量和代价",
        prompt: "它显示这个方向会激活怎样的状态。"
      },
      {
        id: "optionB",
        label: "选项 B",
        role: "第二个方向的能量和代价",
        prompt: "它显示另一种选择背后的吸引力和限制。"
      },
      {
        id: "hidden",
        label: "隐藏因素",
        role: "你还没有充分看见的条件",
        prompt: "它提醒你先补足信息，而不是只凭焦虑推进。"
      },
      {
        id: "advice",
        label: "建议",
        role: "做选择前最值得采取的态度",
        prompt: "它帮助你把决定拆成更小、更清晰的步骤。"
      }
    ]
  },
  {
    id: "relationship",
    name: "关系牌阵",
    subtitle: "我 / 对方 / 关系 / 阻碍 / 走向",
    description: "适合感情、合作和重要人际关系。",
    positions: [
      {
        id: "self",
        label: "我的状态",
        role: "你在关系中的真实感受和需求",
        prompt: "它帮助你先看清自己，而不是只猜对方。"
      },
      {
        id: "other",
        label: "对方状态",
        role: "对方可能呈现出的态度或能量",
        prompt: "它不是读心，而是提示你观察对方行为中的模式。"
      },
      {
        id: "bond",
        label: "关系核心",
        role: "这段关系正在围绕什么主题运转",
        prompt: "它揭示双方互动中反复出现的核心议题。"
      },
      {
        id: "block",
        label: "当前阻碍",
        role: "阻碍关系流动的限制",
        prompt: "它指出需要被命名、沟通或调整的卡点。"
      },
      {
        id: "trend",
        label: "可能走向",
        role: "若当前模式持续，关系可能呈现出的倾向",
        prompt: "它描述趋势，不把未来写成不可改变的结论。"
      }
    ]
  }
];

export function getSpread(spreadId) {
  return SPREADS.find((spread) => spread.id === spreadId) || SPREADS[1];
}
