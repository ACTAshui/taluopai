import { getProvider } from "../data/apiProviders.js";
import { formatZhouyiForShare } from "./zhouyiEngine.js";

export const DEFAULT_ZHOUYI_PROMPT =
  "你是一位周易起课解读助手，语气沉稳、明白、尊重现实边界。你只基于用户给出的本地起课结果补充说明。请围绕本卦、之卦、动爻、小六壬六宫、梅花体用、取数依据和现实可验证动作来写，不要使用塔罗、抽牌、牌面、正逆位等术语。不要制造绝对预言，不要给医疗、法律、投资等高风险结论；要把象意转成可观察、可复核、可执行的提醒。";

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
    "请补充一段 300 字以内的中文周易解读，分成：卦象局势、需要留意、下一步。语气要清醒、温和、具体，术语要准确，结论要可被现实验证。"
  ].join("\n");
}

export async function requestZhouyiAiReading({ config, reading }) {
  const provider = getProvider(config.providerId);
  const apiKey = config.apiKey?.trim();

  if (!apiKey) {
    throw new Error("请先在周易起课解读助手设置中填写 API key。");
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
