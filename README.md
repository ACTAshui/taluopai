# 星幕塔罗 Astral Veil Tarot

一个可以直接部署到 GitHub Pages 的静态塔罗占卜网页。

## 特点

- 默认不需要后端和外部 API。
- 洗牌、抽牌和正逆位判断使用 `crypto.getRandomValues()`。
- 使用无偏 `secureRandomInt()` 和 Fisher-Yates 洗牌算法。
- 本地 78 张标准塔罗牌数据、正逆位解释、四种牌阵和中文模板式解读。
- 隐藏式 AI 接口设置面板，只保存供应商模板和本机密钥，不把真实密钥写入仓库。

## 本地运行

```powershell
npm test
python -m http.server 4173
```

然后访问 `http://localhost:4173/`。

## GitHub Pages 部署

这是纯静态站点。把仓库推到 GitHub 后，在仓库 Settings -> Pages 中选择分支和根目录即可。

## 隐藏 API 设置入口

默认整站不会调用任何 AI API。需要时可以：

- 连续点击页眉的星盘图标 5 次。
- 或按 `Ctrl + Alt + I`。

面板内只包含各厂商接口模板。API key 仅可选择保存到当前浏览器 `localStorage`，不要把真实 key 写入公开仓库。
