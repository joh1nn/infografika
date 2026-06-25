import { useState } from 'react'
import { PROVIDERS } from '../api/providers.js'
import './SettingsModal.css'

export default function SettingsModal({ keys, activeProvider, onSave, onClose }) {
  const [localKeys, setLocalKeys] = useState(keys)
  const [localProvider, setLocalProvider] = useState(activeProvider)
  const [visible, setVisible] = useState({})

  const setKey = (id, val) => setLocalKeys(p => ({ ...p, [id]: val }))
  const toggleVisible = (id) => setVisible(p => ({ ...p, [id]: !p[id] }))

  const handleSave = () => {
    onSave(localKeys, localProvider)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">⚙️ API Sozlamalari</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <p className="modal-desc">
          Qaysi AI provayderdan foydalanishni tanlang va API kalitini kiriting.
          Kalitlar faqat sizning brauzeringizda saqlanadi.
        </p>

        <div className="providers-list">
          {PROVIDERS.map(p => (
            <div
              key={p.id}
              className={`provider-card ${localProvider === p.id ? 'active' : ''}`}
              onClick={() => setLocalProvider(p.id)}
            >
              <div className="provider-top">
                <div className="provider-left">
                  <span className="provider-radio">
                    {localProvider === p.id ? '●' : '○'}
                  </span>
                  <span className="provider-icon">{p.icon}</span>
                  <span className="provider-name">{p.name}</span>
                </div>
                <span className="provider-free">{p.freeInfo}</span>
              </div>

              <div className="provider-key-row">
                <input
                  type={visible[p.id] ? 'text' : 'password'}
                  placeholder={p.keyPlaceholder}
                  value={localKeys[p.id] || ''}
                  onChange={e => setKey(p.id, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  className="provider-key-input"
                />
                <button
                  className="toggle-vis"
                  onClick={e => { e.stopPropagation(); toggleVisible(p.id) }}
                >
                  {visible[p.id] ? '🙈' : '👁'}
                </button>
                <a
                  href={p.keyHelp}
                  target="_blank"
                  rel="noreferrer"
                  className="get-key-link"
                  onClick={e => e.stopPropagation()}
                >
                  Kalit olish →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Bekor qilish</button>
          <button className="btn-save" onClick={handleSave}>✓ Saqlash</button>
        </div>
      </div>
    </div>
  )
}
