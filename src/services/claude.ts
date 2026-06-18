import type { MeetingResult } from '../types';

const API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `你是一個專業的會議記錄產生器。請分析會議逐字稿，輸出一份合法的 JSON 物件。所有文字內容必須使用繁體中文。只回傳 JSON 物件，不要 markdown 程式碼區塊，不要任何額外文字。

如果提供了【參考文件】，請務必使用該文件中的專業術語、慣用詞彙和表達方式。模仿其用字遣詞的風格，讓產出的會議記錄看起來像是同一個單位或專案的正式文件。

{
  "project_name": "115年簽證系統優化專案管理委外服務案",
  "meeting_type": "第X次專案會議",
  "date": "YYYY年MM月DD日 HH:MM",
  "location": "會議地點",
  "host": "主持人姓名",
  "attendees": ["單位1: 人員1、人員2", "單位2: 人員3"],
  "discussion": [
    {
      "topic": "討論主題",
      "content": "討論內容摘要",
      "resolution": "決議內容"
    }
  ],
  "action_items": [
    {
      "unit": "負責單位",
      "task": "待辦事項描述",
      "deadline": "YYYY-MM-DD"
    }
  ],
  "follow_up": "後續安排內容"
}

欄位說明：
- project_name: 專案名稱，預設為「115年簽證系統優化專案管理委外服務案」
- meeting_type: 會議類型，如「第1次專案會議」、「期中報告會議」等
- date: 開會時間，格式為「YYYY年MM月DD日 HH:MM」
- location: 開會地點
- host: 主持人姓名
- attendees: 出席單位及人員，每個元素為「單位: 人員1、人員2」格式
- discussion: 討論事項陣列，每個元素包含 topic（主題）、content（內容）、resolution（決議）
- action_items: 待辦事項陣列，每個元素包含 unit（負責單位）、task（任務）、deadline（期限）
- follow_up: 後續安排`;

export async function analyzeTranscript(
  transcript: string,
  referenceText?: string,
): Promise<MeetingResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'API key not set. Add VITE_ANTHROPIC_API_KEY to your .env file',
    );
  }

  console.log('=== REFERENCE TEXT ===', referenceText?.slice(0, 200) || 'NONE');

  const userContent = referenceText
    ? [
        '【參考文件】以下是相關的參考資料，請使用其中的專業術語和表達方式：\n',
        referenceText,
        '\n\n---\n',
        '請分析以下會議逐字稿，以繁體中文輸出結果：\n',
        transcript,
      ].join('')
    : `請分析以下會議逐字稿，以繁體中文輸出結果：\n${transcript}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Claude API error: ${response.status}`,
    );
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('No response from Claude');
  }

  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  return JSON.parse(cleaned) as MeetingResult;
}
