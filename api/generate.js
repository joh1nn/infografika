export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { provider, model, apiKey, messages, system } = req.body

  if (!apiKey) return res.status(400).json({ error: 'API kalit kiritilmagan' })
  if (!messages) return res.status(400).json({ error: 'Messages kiritilmagan' })

  try {
    let result

    switch (provider) {
      case 'anthropic':
        result = await callAnthropic({ model, apiKey, messages, system })
        break
      case 'gemini':
        result = await callGemini({ model, apiKey, messages, system })
        break
      case 'openai':
        result = await callOpenAI({ model, apiKey, messages, system })
        break
      case 'openrouter':
        result = await callOpenRouter({ model, apiKey, messages, system })
        break
      default:
        return res.status(400).json({ error: "Noma'lum provayder: " + provider })
    }

    return res.status(200).json({ html: result })

  } catch (err) {
    console.error('Generate error:', err)
    return res.status(500).json({ error: err.message || 'Serverda xatolik' })
  }
}

// ── Anthropic ────────────────────────────────────────────────
async function callAnthropic({ model = 'claude-sonnet-4-6', apiKey, messages, system }) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: 4096, system, messages }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error?.message || `Anthropic: ${r.status}`)
  return cleanHTML(data.content.map(c => c.text || '').join(''))
}

// ── Gemini ───────────────────────────────────────────────────
async function callGemini({ model = 'gemini-2.0-flash-lite', apiKey, messages, system }) {
  // Convert messages to Gemini parts
  const parts = []
  for (const msg of messages) {
    if (Array.isArray(msg.content)) {
      for (const item of msg.content) {
        if (item.type === 'image') {
          parts.push({ inline_data: { mime_type: item.source.media_type, data: item.source.data } })
        } else if (item.type === 'text') {
          parts.push({ text: item.text })
        }
      }
    } else {
      parts.push({ text: msg.content })
    }
  }

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { maxOutputTokens: 4096, temperature: 0.8 },
      }),
    }
  )
  const data = await r.json()
  if (!r.ok) throw new Error(data.error?.message || `Gemini: ${r.status}`)
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Gemini javob bermadi')
  return cleanHTML(text)
}

// ── OpenAI ───────────────────────────────────────────────────
async function callOpenAI({ model = 'gpt-4o', apiKey, messages, system }) {
  const oaiMessages = [
    { role: 'system', content: system },
    ...messages.map(m => ({
      role: m.role,
      content: Array.isArray(m.content)
        ? m.content.map(item =>
            item.type === 'image'
              ? { type: 'image_url', image_url: { url: `data:${item.source.media_type};base64,${item.source.data}` } }
              : item
          )
        : m.content,
    })),
  ]

  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, max_tokens: 4096, messages: oaiMessages }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error?.message || `OpenAI: ${r.status}`)
  return cleanHTML(data.choices?.[0]?.message?.content || '')
}

// ── OpenRouter ───────────────────────────────────────────────
async function callOpenRouter({ model, apiKey, messages, system }) {
  const oaiMessages = [
    { role: 'system', content: system },
    ...messages.map(m => ({
      role: m.role,
      content: Array.isArray(m.content)
        ? m.content.map(item =>
            item.type === 'image'
              ? { type: 'image_url', image_url: { url: `data:${item.source.media_type};base64,${item.source.data}` } }
              : item
          )
        : m.content,
    })),
  ]

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://infographic-studio.vercel.app',
      'X-Title': 'AI Infografika Studio',
    },
    body: JSON.stringify({ model, max_tokens: 4096, messages: oaiMessages }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error?.message || `OpenRouter: ${r.status}`)
  return cleanHTML(data.choices?.[0]?.message?.content || '')
}

function cleanHTML(raw) {
  return raw.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```\s*$/i, '').trim()
}
