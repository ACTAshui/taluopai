import { getProvider } from "../data/apiProviders.js";
import { formatZhouyiForShare } from "./zhouyiEngine.js";

export const DEFAULT_ZHOUYI_PROMPT =
  "你是一位克制、清晰、尊重现实边界的周易解读助手。基于用户给出的本地起课结果补充中文解读。不要制造绝对预言，不要给医疗、法律、投资等高风险结论；要把象意转成可验证、可执行的提醒。";

function parseOpenAiStyle(data) {
  return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
}

function parseAnthropic(data) {
  return data?.content?.map((item) => item.text).filter(Boolean).join("\n") || "";
}

function parseGemini(data) {
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n") || "";
}

function buildPrompt(reading) {
  return [
    formatZhouyiForShare(reading),
    "",
    "请补充一段 300 字以内的中文解读，分成：局势、提醒、下一步。语气要清醒、温和、具体。"
  ].join("\n");
}

export async function requestZhouyiAiReading({ config, reading }) {
  const provider = getProvider(config.providerId);
  const apiKey = config.apiKey?.trim();

  if (!apiKey) {
    throw new Error("请先在隐藏面板中填写 API key。");
  }

  const systemPrompt = config.systemPrompt?.trim() || DEFAULT_ZHOUYI_PROMPT;
  const userPrompt = buildPrompt(reading);
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
      temperature: 0.65,
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
