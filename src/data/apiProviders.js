export const DEFAULT_SYSTEM_PROMPT =
  "你是一位塔罗牌阵解读助手，语气克制、清晰、尊重现实边界。你只基于用户给出的本地牌阵、牌位、牌面、正逆位、主题和本地解读摘要补充说明。请围绕牌阵结构、每张牌所在位置、正逆位带来的偏向、整盘能量流动和可执行提醒来写，不要使用周易、卦象、动爻、六宫、体用等术语。不要制造绝对预言，不要给医疗、法律、投资等高风险结论。";

export const API_PROVIDERS = [
  {
    id: "openai",
    label: "OpenAI",
    mode: "openai-compatible",
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4.1-mini",
    note: "仅用于本机使用，不会公开。"
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    mode: "openai-compatible",
    endpoint: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
    note: "仅用于本机使用，不会公开。"
  },
  {
    id: "qwen",
    label: "通义千问 DashScope",
    mode: "openai-compatible",
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    model: "qwen-plus",
    note: "仅用于本机使用，不会公开。"
  },
  {
    id: "kimi",
    label: "月之暗面 Kimi",
    mode: "openai-compatible",
    endpoint: "https://api.moonshot.cn/v1/chat/completions",
    model: "moonshot-v1-8k",
    note: "仅用于本机使用，不会公开。"
  },
  {
    id: "zhipu",
    label: "智谱 GLM",
    mode: "openai-compatible",
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    model: "glm-4-flash",
    note: "仅用于本机使用，不会公开。"
  },
  {
    id: "anthropic",
    label: "Anthropic Claude",
    mode: "anthropic",
    endpoint: "https://api.anthropic.com/v1/messages",
    model: "claude-3-5-sonnet-latest",
    note: "仅用于本机使用，不会公开。"
  },
  {
    id: "gemini",
    label: "Google Gemini",
    mode: "gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    model: "gemini-1.5-flash",
    note: "仅用于本机使用，不会公开。"
  },
  {
    id: "custom",
    label: "自定义兼容接口",
    mode: "openai-compatible",
    endpoint: "https://your-proxy.example.com/v1/chat/completions",
    model: "your-model",
    note: "仅用于本机使用，不会公开。"
  }
];

export function getProvider(providerId) {
  return API_PROVIDERS.find((provider) => provider.id === providerId) || API_PROVIDERS[0];
}
