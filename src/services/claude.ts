import type { MeetingResult } from '../types';

const API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `你是一個專業的會議記錄產生器。請分析以下會議逐字稿，輸出一份合法的 JSON 物件。所有文字內容必須使用繁體中文。只回傳 JSON 物件，不要 markdown 程式碼區塊，不要任何額外文字。

{
  "title": "會議標題",
  "date": "YYYY-MM-DD 格式",
  "attendees": ["與會者姓名1", "與會者姓名2"],
  "summary": "會議簡明摘要",
  "discussion_points": ["討論重點1", "討論重點2"],
  "decisions": ["決議1", "決議2"],
  "action_items": [
    {
      "owner": "負責人姓名",
      "deadline": "YYYY-MM-DD 格式",
      "priority": "高 / 中 / 低",
      "task": "待辦事項描述"
    }
  ],
  "risks": [
    {
      "description": "風險描述",
      "level": "高 / 中 / 低",
      "mitigation": "因應對策"
    }
  ],
  "next_meeting": "YYYY-MM-DD HH:MM 格式，或待定"
}`;

export async function analyzeTranscript(
  transcript: string,
): Promise<MeetingResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'your_anthropic_key_here') {
    throw new Error(
      'API key not set. Add VITE_ANTHROPIC_API_KEY to your .env file',
    );
  }

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
      messages: [
        {
          role: 'user',
          content: `以下會議逐字稿，請以繁體中文輸出結果：\n${transcript}`,
        },
      ],
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