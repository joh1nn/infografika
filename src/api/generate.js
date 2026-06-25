import { SYSTEM_PROMPT, buildUserContent } from './prompts.js'

export async function generateInfographic({
  productImg, referenceImg, formData,
  style, lang, provider, model, apiKey, onStatus,
}) {
  const userContent = buildUserContent({ productImg, referenceImg, formData, style, lang })
  onStatus?.('🤖 AI infografika yaratmoqda...')

  switch (provider) {
    case 'anthropic':  return callAnthropic(userContent, apiKey, model)
    case 'gemini':     return callGemini(userContent, apiKey, model)
    case 'openai':     return callOpenAI(userContent, apiKey, model)
    case 'openrouter': return callOpenRouter(userContent, apiKey, model)
    default: throw new Error("Noma'lum provayder")
  }
}

// ── Anthropic ────────────────────────────────────────────────
async function callAnthropic(userContent, apiKey, model = 'claude-sonnet-4-6') {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `Anthropic xatolik: ${res.status}`) }
  const data = await res.json()
  return cleanHTML(data.content.map(c => c.text || '').join(''))
}

// ── Gemini ───────────────────────────────────────────────────
async function callGemini(userContent, apiKey, model = 'gemini-2.0-flash-lite') {
  const parts = userContent.map(item =>
    item.type === 'image'
      ? { inline_data: { mime_type: item.source.media_type, data: item.source.data } }
      : { text: item.text }
  )
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { maxOutputTokens: 4096, temperature: 0.8 },
      }),
    }
  )
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `Gemini xatolik: ${res.status}`) }
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Gemini javob bermadi. Boshqa model sinab ko\'ring.')
  return cleanHTML(text)
}

// ── OpenAI ───────────────────────────────────────────────────
async function callOpenAI(userContent, apiKey, model = 'gpt-4o') {
  const oaiContent = userContent.map(item =>
    item.type === 'image'
      ? { type: 'image_url', image_url: { url: `data:${item.source.media_type};base64,${item.source.data}` } }
      : item
  )
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model, max_tokens: 4096,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: oaiContent }],
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `OpenAI xatolik: ${res.status}`) }
  const data = await res.json()
  return cleanHTML(data.choices?.[0]?.message?.content || '')
}

// ── OpenRouter ───────────────────────────────────────────────
async function callOpenRouter(userContent, apiKey, model = 'meta-llama/llama-4-maverick:free') {
  const oaiContent = userContent.map(item =>
    item.type === 'image'
      ? { type: 'image_url', image_url: { url: `data:${item.source.media_type};base64,${item.source.data}` } }
      : item
  )
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://infographic-studio.vercel.app',
      'X-Title': 'AI Infografika Studio',
    },
    body: JSON.stringify({
      model, max_tokens: 4096,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: oaiContent }],
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `OpenRouter xatolik: ${res.status}`) }
  const data = await res.json()
  return cleanHTML(data.choices?.[0]?.message?.content || '')
}

function cleanHTML(raw) {
  return raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```\s*$/i, '').trim()
}
