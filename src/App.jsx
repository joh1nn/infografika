import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Preview from './components/Preview.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import { generateInfographic } from './api/generate.js'
import { PROVIDERS, getProvider } from './api/providers.js'
import './App.css'

function loadKeys() {
  try { return JSON.parse(localStorage.getItem('ai_keys') || '{}') } catch { return {} }
}

export default function App() {
  const [productImg, setProductImg]   = useState(null)
  const [referenceImg, setReferenceImg] = useState(null)
  const [formData, setFormData]       = useState({ name: '', tagline: '', price: '', stats: ['', '', ''], extra: '' })
  const [style, setStyle]             = useState('ai-auto')
  const [lang, setLang]               = useState('uz')
  const [loading, setLoading]         = useState(false)
  const [status, setStatus]           = useState('')
  const [resultHTML, setResultHTML]   = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [apiKeys, setApiKeys]         = useState(loadKeys)
  const [activeProvider, setActiveProvider] = useState(localStorage.getItem('active_provider') || 'anthropic')

  const currentProvider = getProvider(activeProvider)
  const currentKey = apiKeys[activeProvider] || ''

  const handleSaveSettings = (keys, provider) => {
    setApiKeys(keys)
    setActiveProvider(provider)
    localStorage.setItem('ai_keys', JSON.stringify(keys))
    localStorage.setItem('active_provider', provider)
  }

  const handleGenerate = async () => {
    if (!currentKey) {
      setShowSettings(true)
      return
    }
    setLoading(true)
    setStatus('🤖 AI infografika yaratmoqda...')
    try {
      const html = await generateInfographic({
        productImg, referenceImg, formData,
        style, lang,
        provider: activeProvider,
        apiKey: currentKey,
        onStatus: setStatus,
      })
      setResultHTML(html)
      setStatus('✅ Tayyor! HTML yuklab oling yoki print qiling.')
    } catch (err) {
      setStatus('❌ Xatolik: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-left">
          <span className="logo">✦ AI Infografika Studio</span>
          <span className="logo-sub">Professional poster yaratuvchi</span>
        </div>
        <div className="topbar-right">
          <div className="provider-badge" onClick={() => setShowSettings(true)}>
            <span>{currentProvider.icon}</span>
            <span className="provider-badge-name">{currentProvider.name}</span>
            <span className={`provider-badge-dot ${currentKey ? 'active' : 'inactive'}`} />
            <span className="provider-badge-status">{currentKey ? 'Ulangan' : 'Kalit kerak'}</span>
          </div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            ⚙️ Sozlamalar
          </button>
        </div>
      </header>

      <div className="main-area">
        <Sidebar
          productImg={productImg}       setProductImg={setProductImg}
          referenceImg={referenceImg}   setReferenceImg={setReferenceImg}
          formData={formData}           setFormData={setFormData}
          style={style}                 setStyle={setStyle}
          lang={lang}                   setLang={setLang}
          loading={loading}
          onGenerate={handleGenerate}
        />
        <Preview
          resultHTML={resultHTML}
          status={status}
          loading={loading}
          formData={formData}
          onRegenerate={handleGenerate}
        />
      </div>

      {showSettings && (
        <SettingsModal
          keys={apiKeys}
          activeProvider={activeProvider}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
