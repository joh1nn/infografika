// Barcha AI provayderlar konfiguratsiyasi

export const PROVIDERS = [
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '⚡',
    keyPrefix: 'sk-ant-',
    keyPlaceholder: 'sk-ant-api03-...',
    keyHelp: 'https://console.anthropic.com/settings/keys',
    freeInfo: '$5 bepul kredit (karta kerak)',
    model: 'claude-sonnet-4-6',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '🌟',
    keyPrefix: 'AIza',
    keyPlaceholder: 'AIzaSy...',
    keyHelp: 'https://aistudio.google.com/apikey',
    freeInfo: 'To\'liq bepul, karta kerak emas',
    model: 'gemini-2.0-flash',
  },
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    icon: '🤖',
    keyPrefix: 'sk-',
    keyPlaceholder: 'sk-proj-...',
    keyHelp: 'https://platform.openai.com/api-keys',
    freeInfo: '$5 bepul kredit (karta kerak)',
    model: 'gpt-4o',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: '🔀',
    keyPrefix: 'sk-or-',
    keyPlaceholder: 'sk-or-v1-...',
    keyHelp: 'https://openrouter.ai/keys',
    freeInfo: 'Ko\'p bepul modellar mavjud',
    model: 'google/gemini-2.0-flash-exp:free',
  },
]

export function getProvider(id) {
  return PROVIDERS.find(p => p.id === id) || PROVIDERS[0]
}
