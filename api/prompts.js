export const SYSTEM_PROMPT = `You are a world-class product infographic designer and HTML/CSS developer.
You create stunning, professional product advertisement posters as self-contained HTML files.
These look like professional marketplace product cards (similar to Uzum, Ozon, Wildberries listings).

ABSOLUTE RULES:
1. Output ONLY raw HTML code — no markdown, no backticks, no explanations
2. Single self-contained HTML file with all CSS embedded in <style> tags
3. The poster must be EXACTLY 600px wide and 800px tall
4. Main wrapper: <div style="width:600px;height:800px;overflow:hidden;position:relative;">
5. No JavaScript required
6. Google Fonts allowed — import via @import url() in <style>
7. Make it STUNNING — like a professional designer created it
8. Large dominant product name (60-90px font-size, very bold)
9. Stats as LARGE numbers with small descriptor labels
10. Floating badge/pill elements for features
11. Start directly with <!DOCTYPE html>`

export const STYLE_PROMPTS = {
  'ai-auto': `DESIGN STYLE: Analyze the product and automatically choose the best palette and layout. Electronics=dark+blue, Beauty=dark+pink/red, Food=warm+green/orange, Fashion=bold contrast, Health=clean+blue/green.`,
  'dark-tech': `DESIGN STYLE DARK TECH: Near-black bg (#080810), electric blue/cyan accents, white bold text, neon text-shadow on numbers, glowing border cards, vertical stripe decorations, yellow circular badge for main stat. Google Fonts: Orbitron or Rajdhani.`,
  'warm-luxury': `DESIGN STYLE WARM LUXURY: Dark warm brown bg (#100800), amber/gold accents (#c8860a), large elegant italic name, semi-transparent amber circle decorations, stats as large numbers with thin lines, minimalist feature list. Google Fonts: Playfair Display.`,
  'bold-red': `DESIGN STYLE BOLD RED: Dark red bg (#1a0005), bright red (#ff2040) and white accents, massive bold caps name (80-100px), green arrow indicators before stats, white pill badges. Google Fonts: Bebas Neue.`,
  'clean-white': `DESIGN STYLE CLEAN WHITE: Pure white bg, one accent color fitting product, minimal catalog look, bold dark name, colored pill badges for stats, thin dividing lines. Google Fonts: Inter.`,
  'deep-blue': `DESIGN STYLE DEEP BLUE: Deep royal blue bg (#050a20), white + golden yellow accents, vertical light-ray stripe decorations, large bold white name, yellow circular badge in upper right, white pill badges. Google Fonts: Montserrat.`,
}

export const LANG_INSTRUCTIONS = {
  uz: "Write ALL visible text in Uzbek (Latin script).",
  ru: "Write ALL visible text in Russian.",
  en: "Write ALL visible text in English.",
}

export function buildUserContent({ productImg, referenceImg, formData, style, lang }) {
  const { name, tagline, price, stats, extra } = formData
  const filteredStats = (stats || []).filter(s => s.trim())
  const content = []

  if (referenceImg) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: referenceImg.mime, data: referenceImg.base64 }
    })
    content.push({ type: 'text', text: 'REFERENCE IMAGE: Analyze its visual style — colors, typography, layout, badges. Recreate this aesthetic for the new product.' })
  }

  if (productImg) {
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: productImg.mime, data: productImg.base64 }
    })
    content.push({ type: 'text', text: 'PRODUCT IMAGE: Place this prominently in the poster.' })
  }

  const styleInstr = referenceImg
    ? 'DESIGN STYLE: Follow the reference image style closely — extract its exact colors, typography weight, badge styles, and decorative elements.'
    : (STYLE_PROMPTS[style] || STYLE_PROMPTS['ai-auto'])

  const imgEmbed = productImg
    ? `Use this exact tag for product image: <img src="data:${productImg.mime};base64,${productImg.base64}" style="[size and position]" alt="${name}">`
    : 'No product image — use large typography as hero visual.'

  content.push({
    type: 'text',
    text: `Create a professional product infographic poster HTML.

PRODUCT:
- Name: ${name || 'Product'}
- Tagline: ${tagline || 'Premium quality'}
- Price: ${price || ''}
- Stats/Features: ${filteredStats.length ? filteredStats.join(' | ') : 'High quality, Modern design'}
- Extra: ${extra || ''}

${imgEmbed}

${styleInstr}

LANGUAGE: ${LANG_INSTRUCTIONS[lang] || LANG_INSTRUCTIONS.uz}

OUTPUT: Complete HTML starting with <!DOCTYPE html>`
  })

  return content
}
