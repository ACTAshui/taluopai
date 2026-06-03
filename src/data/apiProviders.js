export const DEFAULT_SYSTEM_PROMPT =
  "你是一位克制、清晰、尊重现实边界的塔罗解读助手。基于用户给出的本地牌阵结果，补充更自然的人话解读。不要制造绝对预言，不要给医疗、法律、投资等高风险结论。";

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
