export const TOPICS = [
  {
    id: "daily",
    name: "今日指引",
    shortName: "今日",
    tone: "把重点放在今天可观察、可尝试的小行动。",
    prompt: "今天最值得看见的提醒是什么？"
  },
  {
    id: "love",
    name: "感情关系",
    shortName: "感情",
    tone: "把重点放在真实感受、边界、沟通和关系中的互动模式。",
    prompt: "这段关系接下来要注意什么？"
  },
  {
    id: "career",
    name: "事业工作",
    shortName: "事业",
    tone: "把重点放在职责、机会、风险、协作和下一步行动。",
    prompt: "我在工作或事业上需要看见什么？"
  },
  {
    id: "money",
    name: "金钱资源",
    shortName: "金钱",
    tone: "把重点放在资源配置、消费动机、安全感和长期稳定。",
    prompt: "我该如何看待眼前的资源问题？"
  },
  {
    id: "self",
    name: "自我成长",
    shortName: "自我",
    tone: "把重点放在内在模式、学习、修复和个人选择。",
    prompt: "我现在最需要成长的部分是什么？"
  },
  {
    id: "choice",
    name: "重大选择",
    shortName: "选择",
    tone: "把重点放在选项背后的代价、动机、盲点和低风险试探。",
    prompt: "面对这个选择，我需要先看清什么？"
  }
];

export function getTopic(topicId) {
  return TOPICS.find((topic) => topic.id === topicId) || TOPICS[0];
}
