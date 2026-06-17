const API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export async function transcribeAudio(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_key_here') {
    throw new Error(
      'Groq API key not set. Add VITE_GROQ_API_KEY to your .env file',
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-large-v3');
  formData.append('response_format', 'json');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Groq API error: ${response.status}`,
    );
  }

  const data = await response.json();
  return data.text as string;
}
