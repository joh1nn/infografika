import { useRef } from 'react'
import './Preview.css'

export default function Preview({ resultHTML, status, loading, formData, onRegenerate }) {
  const iframeRef = useRef(null)

  const downloadHTML = () => {
    if (!resultHTML) return
    const blob = new Blob([resultHTML], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${formData.name || 'infografika'}.html`
    a.click()
  }

  const openInNewTab = () => {
    if (!resultHTML) return
    const blob = new Blob([resultHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  const printPNG = () => {
    if (!resultHTML) return
    const win = window.open('', '_blank')
    win.document.write(resultHTML)
    win.document.close()
    setTimeout(() => {
      win.print()
    }, 800)
  }

  return (
    <div className="preview-panel">
      <div className="preview-topbar">
        <div className="status-msg">
          {loading && <span className="spinner" />}
          {status}
        </div>
        <div className="action-row">
          <button className="act-btn" disabled={!resultHTML} onClick={onRegenerate}>
            ↺ Qayta
          </button>
          <button className="act-btn" disabled={!resultHTML} onClick={openInNewTab}>
            ⬡ Yangi tabda
          </button>
          <button className="act-btn" disabled={!resultHTML} onClick={printPNG}>
            🖨 Print / PNG
          </button>
          <button className="act-btn primary" disabled={!resultHTML} onClick={downloadHTML}>
            ↓ HTML yuklab olish
          </button>
        </div>
      </div>

      <div className="canvas-area">
        {!resultHTML && !loading && (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <p className="empty-title">Infografika bu yerda chiqadi</p>
            <p className="empty-sub">
              Chapdan ma'lumotlarni kiriting,<br />
              mahsulot va referens rasmini yuklang,<br />
              so'ng <strong>AI bilan yaratish</strong> tugmasini bosing
            </p>
            <div className="empty-tips">
              <div className="tip">📦 Mahsulot rasmi — infografikaga joylashadi</div>
              <div className="tip">🎨 Referens rasm — AI shu uslubni tahlil qiladi</div>
              <div className="tip">⚡ Natija — professional poster HTML sifatida</div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-pulse">✦</div>
            <p>AI professional infografika yaratmoqda...</p>
            <p className="loading-sub">Bu 10–20 soniya davom etadi</p>
          </div>
        )}

        {resultHTML && !loading && (
          <iframe
            ref={iframeRef}
            srcDoc={resultHTML}
            title="Infografika natijasi"
            className="result-iframe"
            sandbox="allow-same-origin"
          />
        )}
      </div>
    </div>
  )
}
