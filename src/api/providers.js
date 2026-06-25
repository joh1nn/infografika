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
      { id: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite (bepul) ⭐' },
      { id: 'gemini-2.0-flash',      label: 'Gemini 2.0 Flash (bepul)' },
      { id: 'gemini-1.5-flash-8b',   label: 'Gemini 1.5 Flash-8B Nano (bepul)' },
      { id: 'gemini-1.5-flash',      label: 'Gemini 1.5 Flash (bepul)' },
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
    model: 'deepseek/deepseek-r1-0528:free',
    models: [
      { id: 'deepseek/deepseek-r1-0528:free',          label: 'DeepSeek R1 (bepul) ⭐' },
      { id: 'deepseek/deepseek-v3-0324:free',          label: 'DeepSeek V3 (bepul)' },
      { id: 'google/gemini-2.0-flash-thinking-exp:free', label: 'Gemini 2.0 Flash Thinking (bepul)' },
      { id: 'microsoft/phi-4-reasoning:free',          label: 'Microsoft Phi-4 (bepul)' },
      { id: 'qwen/qwen3-235b-a22b:free',               label: 'Qwen3 235B (bepul)' },
    ],
  },
]

export function getProvider(id) {
  return PROVIDERS.find(p => p.id === id) || PROVIDERS[0]
}
