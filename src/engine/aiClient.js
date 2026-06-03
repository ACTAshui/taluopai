import { DEFAULT_SYSTEM_PROMPT, getProvider } from "../data/apiProviders.js";

export const API_CONFIG_KEY = "astral-veil-api-config";

export function loadApiConfig() {
  try {
    const raw = localStorage.getItem(API_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveApiConfig(config) {
  localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
}

export function clearApiConfig() {
  localStorage.removeItem(API_CONFIG_KEY);
}

function readingPrompt(reading, interpretation) {
  const cards = reading.drawn
    .map((item) => `${item.position.label}: ${item.card.nameCn} ${item.orientation === "upright" ? "正位" : "逆位"}`)
    .join("\n");

  return [
    `主题：${reading.topic.name}`,
    reading.question ? `用户问题：${reading.question}` : "用户没有填写具体问题。",
    `牌阵：${reading.spread.name} / ${reading.spread.subtitle}`,
    "抽到的牌：",
    cards,
    "本地解读摘要：",
    interpretation.oneLine,
    "请补充一段 300 字以内的中文解读，分成：整体提示、需要注意、下一步行动。"
  ].join("\n");
}

function parseOpenAiStyle(data) {
  return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
}

function parseAnthropic(data) {
  return data?.content?.map((item) => item.text).filter(Boolean).join("\n") || "";
}

function parseGemini(data) {
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n") || "";
}

export async function requestAiReading({ config, reading, interpretation }) {
  const provider = getProvider(config.providerId);
  const apiKey = config.apiKey?.trim();

  if (!apiKey) {
    throw new Error("请先在隐藏面板中填写 API key。");
  }

  const systemPrompt = config.systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;
  const userPrompt = readingPrompt(reading, interpretation);
  const model = config.model || provider.model;
  const endpoint = config.endpoint || provider.endpoint;

  if (provider.mode === "anthropic") {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: 700,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "Anthropic 请求失败。");
    }
    return parseAnthropic(data);
  }

  if (provider.mode === "gemini") {
    const url = endpoint.replace("{model}", encodeURIComponent(model));
    const separator = url.includes("?") ? "&" : "?";
    const response = await fetch(`${url}${separator}key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }]
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "Gemini 请求失败。");
    }
    return parseGemini(data);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI 兼容请求失败。");
  }
  return parseOpenAiStyle(data);
}
