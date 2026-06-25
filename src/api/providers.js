export const PROVIDERS = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '⚡',
    keyPlaceholder: 'sk-ant-api03-...',
    keyHelp: 'https://console.anthropic.com/settings/keys',
    freeInfo: '$5 bepul kredit (karta kerak)',
    model: 'claude-sonnet-4-6',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '🌟',
    keyPlaceholder: 'AIzaSy...',
    keyHelp: 'https://aistudio.google.com/apikey',
    freeInfo: "To'liq bepul, karta kerak emas",
    models: [
      { id: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite (bepul, eng tez) ⭐' },
      { id: 'gemini-2.0-flash',      label: 'Gemini 2.0 Flash (bepul)' },
      { id: 'gemini-1.5-flash-8b',   label: 'Gemini 1.5 Flash-8B / Nano (bepul, eng arzon)' },
      { id: 'gemini-1.5-flash',      label: 'Gemini 1.5 Flash (bepul)' },
      { id: 'gemini-1.5-pro',        label: 'Gemini 1.5 Pro (bepul limit)' },
    ],
    model: 'gemini-2.0-flash-lite',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-4o',
    icon: '🤖',
    keyPlaceholder: 'sk-proj-...',
    keyHelp: 'https://platform.openai.com/api-keys',
    freeInfo: '$5 bepul kredit (karta kerak)',
    model: 'gpt-4o',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: '🔀',
    keyPlaceholder: 'sk-or-v1-...',
    keyHelp: 'https://openrouter.ai/keys',
    freeInfo: "Bepul modellar mavjud, karta kerak emas",
    model: 'meta-llama/llama-4-maverick:free',
    models: [
      { id: 'meta-llama/llama-4-maverick:free',       label: 'Llama 4 Maverick (bepul) ⭐' },
      { id: 'meta-llama/llama-4-scout:free',          label: 'Llama 4 Scout (bepul)' },
      { id: 'google/gemini-2.5-pro-exp-03-25:free',   label: 'Gemini 2.5 Pro (bepul)' },
      { id: 'deepseek/deepseek-r1:free',              label: 'DeepSeek R1 (bepul)' },
      { id: 'microsoft/phi-4-reasoning:free',         label: 'Microsoft Phi-4 (bepul)' },
    ],
  },
]

export function getProvider(id) {
  return PROVIDERS.find(p => p.id === id) || PROVIDERS[0]
}
