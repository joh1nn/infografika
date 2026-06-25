import UploadZone from './UploadZone.jsx'
import './Sidebar.css'

const STYLES = [
  { id: 'ai-auto',      label: '🤖 AI Auto',       desc: 'AI o\'zi tanlaydi' },
  { id: 'dark-tech',    label: '⚡ Dark Tech',      desc: 'Ko\'k, futuristik' },
  { id: 'warm-luxury',  label: '✨ Warm Luxury',    desc: 'Amber, premium' },
  { id: 'bold-red',     label: '🔥 Bold Red',       desc: 'Qizil, energetik' },
  { id: 'clean-white',  label: '🤍 Clean White',    desc: 'Minimal, oq' },
  { id: 'deep-blue',    label: '💙 Deep Blue',      desc: 'To\'q ko\'k' },
]

const LANGS = [
  { id: 'uz', label: "O'zbek" },
  { id: 'ru', label: 'Русский' },
  { id: 'en', label: 'English' },
]

export default function Sidebar({
  productImg, setProductImg,
  referenceImg, setReferenceImg,
  formData, setFormData,
  style, setStyle,
  lang, setLang,
  loading, onGenerate
}) {
  const setField = (key, val) => setFormData(p => ({ ...p, [key]: val }))

  const setStat = (i, val) => {
    const stats = [...formData.stats]
    stats[i] = val
    setFormData(p => ({ ...p, stats }))
  }

  const addStat = () => setFormData(p => ({ ...p, stats: [...p.stats, ''] }))
  const remStat = (i) => {
    if (formData.stats.length <= 1) return
    setFormData(p => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }))
  }

  return (
    <aside className="sidebar">
      <UploadZone
        label="Mahsulot rasmi"
        icon="📦"
        image={productImg}
        onImage={setProductImg}
        onClear={() => setProductImg(null)}
      />

      <UploadZone
        label="Referens rasm"
        badge="dizayn uslubi"
        icon="🎨"
        image={referenceImg}
        onImage={setReferenceImg}
        onClear={() => setReferenceImg(null)}
      />

      <div className="divider" />

      <div className="section-label">Ma'lumotlar</div>

      <div className="field">
        <label>Mahsulot nomi *</label>
        <input
          type="text"
          placeholder="Naushnik Pro Max"
          value={formData.name}
          onChange={e => setField('name', e.target.value)}
        />
      </div>

      <div className="field">
        <label>Tagline / kategoriya</label>
        <input
          type="text"
          placeholder="Simsiz, bass kuchaytiruvchi"
          value={formData.tagline}
          onChange={e => setField('tagline', e.target.value)}
        />
      </div>

      <div className="field">
        <label>Narx</label>
        <input
          type="text"
          placeholder="299 000 so'm"
          value={formData.price}
          onChange={e => setField('price', e.target.value)}
        />
      </div>

      <div className="field">
        <label>Asosiy ko'rsatkichlar</label>
        {formData.stats.map((s, i) => (
          <div key={i} className="stat-row">
            <input
              type="text"
              placeholder={`Ko'rsatkich ${i + 1} (masalan: 400 soat)`}
              value={s}
              onChange={e => setStat(i, e.target.value)}
            />
            <button className="stat-del" onClick={() => remStat(i)}>×</button>
          </div>
        ))}
        <button className="add-stat" onClick={addStat}>+ qo'shish</button>
      </div>

      <div className="field">
        <label>Qo'shimcha ma'lumot</label>
        <textarea
          placeholder="Kafolat, material, texnik xususiyatlar..."
          value={formData.extra}
          onChange={e => setField('extra', e.target.value)}
        />
      </div>

      <div className="divider" />
      <div className="section-label">Dizayn uslubi {referenceImg ? <span className="badge-override">referens ustunlik qiladi</span> : ''}</div>

      <div className="style-grid">
        {STYLES.map(s => (
          <button
            key={s.id}
            className={`style-btn ${style === s.id ? 'active' : ''}`}
            onClick={() => setStyle(s.id)}
          >
            <span className="style-label">{s.label}</span>
            <span className="style-desc">{s.desc}</span>
          </button>
        ))}
      </div>

      <div className="divider" />
      <div className="section-label">Til</div>

      <div className="lang-row">
        {LANGS.map(l => (
          <button
            key={l.id}
            className={`lang-btn ${lang === l.id ? 'active' : ''}`}
            onClick={() => setLang(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <button
        className="gen-btn"
        onClick={onGenerate}
        disabled={loading}
      >
        {loading ? '⏳ Yaratilmoqda...' : '✦ AI bilan yaratish'}
      </button>
    </aside>
  )
}
