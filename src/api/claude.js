const STYLE_PROMPTS = {
  'dark-tech': `
DESIGN STYLE - DARK TECH:
- Background: deep near-black (#080810 to #0a0a18)
- Accent: electric blue (#00b4ff) or cyan (#00f0c8)
- Large bold white product name (font-size 70-90px, font-weight 900)
- Neon-glow effect on key numbers using text-shadow
- Stats displayed in dark cards with glowing blue borders
- Vertical blue stripe decorations on edges
- Yellow circular badge in corner for main stat
- Modern futuristic fonts (use Google Fonts: Orbitron or Rajdhani for headings)
- Small icon markers [●] before feature text`,

  'warm-luxury': `
DESIGN STYLE - WARM LUXURY:
- Background: very dark warm brown (#100800 or #0f0a00)
- Accent: amber/gold (#c8860a, #e8a020)
- Large elegant italic product name
- Soft warm circle decorations (large, semi-transparent amber circles)
- Stats as large numbers with thin horizontal lines above/below
- Minimalist checkmark (✓) or arrow (→) feature list
- Google Fonts: Playfair Display for headings, Lato for body
- Premium feel, generous whitespace`,

  'bold-red': `
DESIGN STYLE - BOLD RED:
- Background: dark red/maroon gradient (#1a0005 → #0d0003)
- Accent: bright red (#ff2040) and white
- Product name in massive bold caps (font-size 80-100px)
- Green arrow indicators (▲) before key stats
- White stats in floating pill/badge boxes with subtle borders
- Energy and urgency feel
- German flag or quality badges as small decorative elements
- Google Fonts: Bebas Neue or Black Han Sans for headings`,

  'clean-white': `
DESIGN STYLE - CLEAN WHITE:
- Background: pure white (#ffffff)
- Choose ONE accent color that fits the product category
- Clean minimal catalog/marketplace look
- Product name in bold dark text
- Stats in colored pill badges (accent color background)
- Thin dividing lines between sections
- Professional product catalog aesthetic
- Google Fonts: Inter or Plus Jakarta Sans`,

  'deep-blue': `
DESIGN STYLE - DEEP BLUE:
- Background: deep royal blue (#050a20 or #040b1e)
- Accent: white + golden yellow (#ffd700)
- Vertical light-ray stripe decorations (semi-transparent blue lines)
- Product name large and bold in white
- Yellow circular badge (like a gold medal) in upper right with main stat
- Small pill/capsule badges in white for feature labels
- Modern tech marketplace feel
- Google Fonts: Montserrat or Nunito`,

  'ai-auto': `
DESIGN STYLE - AUTO (analyze product and choose):
- Look at the product name, category, and any provided image
- Choose the most fitting color palette for the product type
- Electronics/tech: dark backgrounds with colored accents
- Beauty/cosmetics: dark elegant with pink/red accents  
- Food/kitchen: warm tones with green/orange
- Fashion/accessories: bold contrasting colors
- Health/medical: clean with blue/green accents
- Make it look like a professional marketplace poster`,
}

const LANG_INSTRUCTIONS = {
  uz: "Write ALL visible text in Uzbek (Latin script). Labels, stats, features — everything in Uzbek.",
  ru: "Write ALL visible text in Russian language.",
  en: "Write ALL visible text in English language.",
}

export async function generateInfographic({
  productImg,
  referenceImg,
  formData,
  style,
  lang,
  apiKey,
  onStatus,
}) {
  const { name, tagline, price, stats, extra } = formData

  const filteredStats = stats.filter(s => s.trim())

  let styleInstruction = STYLE_PROMPTS[style] || STYLE_PROMPTS['ai-auto']

  if (referenceImg) {
    styleInstruction = `
DESIGN STYLE - ANALYZE THE REFERENCE IMAGE PROVIDED:
- Carefully analyze the reference image's color palette, typography style, layout structure, and visual elements
- Extract: background colors, accent colors, font weights and sizes used, badge/pill styles, decorative elements
- Recreate a SIMILAR visual style for this new product
- Do NOT copy the content — only use the visual style as inspiration
- The reference shows the aesthetic direction to follow`
  }

  const systemPrompt = `You are a world-class product infographic designer and HTML/CSS developer.
You create stunning, professional product advertisement posters as self-contained HTML files.
These look like professional marketplace product cards (similar to Uzum, Ozon, Wildberries listings).

ABSOLUTE RULES:
1. Output ONLY raw HTML code — no markdown, no backticks, no explanations, no comments
2. Single self-contained HTML file with all CSS embedded in <style> tags
3. The poster must be EXACTLY 600px wide and 800px tall
4. Main wrapper: <div style="width:600px;height:800px;overflow:hidden;position:relative;font-family:...">
5. No JavaScript required
6. Google Fonts allowed — import via @import in <style>
7. Product image if provided: use <img src="data:[mime];base64,[base64data]" ...>
8. Make it STUNNING — like a professional designer created it
9. Large dominant product name (huge font, 60-90px)
10. Stats displayed as LARGE numbers with small descriptor labels below
11. Floating badge/pill elements for features
12. The design should be visually impressive and ready to use`

  const userContent = []

  if (referenceImg) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: referenceImg.mime,
        data: referenceImg.base64,
      }
    })
    userContent.push({
      type: 'text',
      text: 'This is the REFERENCE IMAGE. Analyze its visual style carefully — colors, typography, layout, badges, decorative elements. Recreate this aesthetic for the new product below.'
    })
  }

  if (productImg) {
    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: productImg.mime,
        data: productImg.base64,
      }
    })
    userContent.push({
      type: 'text',
      text: 'This is the PRODUCT IMAGE. Place it prominently in the poster design.'
    })
  }

  const productImgInstruction = productImg
    ? `PRODUCT IMAGE: Provided above. Embed it using: <img src="data:${productImg.mime};base64,${productImg.base64}" style="[appropriate sizing and positioning]" alt="${name}">`
    : 'PRODUCT IMAGE: Not provided. Use large typography as the hero visual element instead.'

  userContent.push({
    type: 'text',
    text: `Create a professional product infographic poster as HTML.

PRODUCT DETAILS:
- Name: ${name || 'Product Name'}
- Tagline/Category: ${tagline || 'Premium quality'}
- Price: ${price || ''}
- Key stats/features: ${filteredStats.length > 0 ? filteredStats.join(' | ') : 'High quality, Modern design, Best price'}
- Additional info: ${extra || ''}

${productImgInstruction}

${styleInstruction}

LANGUAGE: ${LANG_INSTRUCTIONS[lang]}

LAYOUT REQUIREMENTS:
- Product name: DOMINANT, largest element (60-90px font-size, very bold)
- Main stat or tagline: second largest element  
- 2-4 key numbers/stats displayed as large figures with small labels
- Feature pills/badges floating around the design
- Price if provided: displayed prominently in a badge
- Professional, ready-to-publish quality

Generate the complete HTML poster now. Start directly with <!DOCTYPE html>`
  })

  if (onStatus) onStatus('🤖 Claude AI posteringizni yaratmoqda...')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || `API xatolik: ${response.status}`)
  }

  const data = await response.json()
  let html = data.content.map(c => c.text || '').join('')

  html = html
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()

  return html
}
