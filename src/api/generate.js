import { SYSTEM_PROMPT, buildUserContent } from './prompts.js'

export async function generateInfographic({
  productImg, referenceImg, formData,
  style, lang, provider, model, apiKey, onStatus,
}) {
  const userContent = buildUserContent({ productImg, referenceImg, formData, style, lang })
  onStatus?.('🤖 AI infografika yaratmoqda...')

  // Vercel serverless proxy orqali yuborish
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider,
      model,
      apiKey,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  const data = await res.json()

  if (!res.ok || data.error) {
    throw new Error(data.error || `Server xatolik: ${res.status}`)
  }

  return data.html
}
