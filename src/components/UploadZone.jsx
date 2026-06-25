import './UploadZone.css'

export default function UploadZone({ label, badge, icon, image, onImage, onClear }) {
  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onImage({ base64: ev.target.result.split(',')[1], mime: file.type, dataUrl: ev.target.result })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="upload-zone-wrap">
      <div className="upload-zone-label">
        {label}
        {badge && <span className="upload-badge">{badge}</span>}
      </div>

      {image ? (
        <div className="upload-preview">
          <img src={image.dataUrl} alt="preview" />
          <button className="upload-clear" onClick={onClear}>× Olib tashlash</button>
        </div>
      ) : (
        <label className="upload-zone">
          <input type="file" accept="image/*" onChange={handleFile} />
          <span className="upload-icon">{icon}</span>
          <span className="upload-hint">Bosing yoki tashlang</span>
          <span className="upload-hint2">PNG, JPG, WEBP</span>
        </label>
      )}
    </div>
  )
}
