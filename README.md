# 會議記錄產生器

貼上會議逐字稿或上傳錄音檔，AI 自動產生結構化會議記錄。

## 功能

- **語音轉錄** — 上傳錄音檔（支援 mp3 / wav / m4a 等），透過 Groq Whisper 自動轉文字
- **逐字稿輸入** — 直接貼上會議逐字稿
- **AI 分析** — 呼叫 Claude Haiku 4.5 產出結構化 JSON
- **結構化輸出** — 標題、日期、與會者、摘要、討論重點、決議、待辦事項、風險、下次會議
- **待辦事項表格** — 含負責人、截止日、優先級（高/中/低）
- **紅色風險卡** — 風險依等級（高/中/低）顯示不同色調的紅色卡片
- **一鍵複製** — 將完整會議記錄以 Markdown 格式複製到剪貼簿

## 技術棧

| 項目 | 說明 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 建構工具 | Vite |
| 樣式 | Tailwind CSS v4 |
| LLM | Claude Haiku 4.5 (Anthropic API) |
| 語音轉錄 | Whisper large-v3 (Groq API) |

## 快速開始

```bash
# 安裝依賴
npm install

# 設定 API keys
cp .env.example .env
# 編輯 .env，填入：
#   VITE_ANTHROPIC_API_KEY=你的 Anthropic key
#   VITE_GROQ_API_KEY=你的 Groq key（選填，需語音轉錄才要）

# 啟動開發伺服器
npm run dev
```

## 環境變數

| 變數 | 說明 | 必填 |
|------|------|------|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API Key | 是 |
| `VITE_GROQ_API_KEY` | Groq API Key（語音轉錄用） | 否 |

## 專案結構

```
src/
  services/
    claude.ts          # Claude API 呼叫
    groq.ts            # Groq Whisper 語音轉錄
  components/
    TranscriptInput.tsx # 逐字稿輸入區
    AudioUpload.tsx     # 錄音上傳
    MeetingResult.tsx   # 會議記錄主區塊
    ActionItemsTable.tsx # 待辦事項表格
    RisksCard.tsx       # 風險卡片
    CopyButton.tsx      # 一鍵複製
  types.ts             # TypeScript 型別定義
  App.tsx              # 主元件
```

## 部署

```bash
npm run build
# 將 dist/ 目錄部署到任意靜態主機（Nginx、GitHub Pages、Vercel 等）
```
