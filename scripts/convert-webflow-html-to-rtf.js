#!/usr/bin/env node

/**
 * Normalize Webflow CMS rich text content by decoding double-encoded HTML,
 * promoting headings in property feature fields, and transforming map data
 * into embeddable HTML snippets.
 */

const path = require('path')
const fs = require('fs')

const dotenvPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(dotenvPath)) {
  require('dotenv').config({ path: dotenvPath })
}

const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN
const COLLECTION_ID = process.env.WEBFLOW_APP_PROPERTIES_COLLECTION_ID || '648b412e0dd822359604117b'

if (!WEBFLOW_API_TOKEN) {
  console.error('Missing WEBFLOW_API_TOKEN environment variable')
  process.exit(1)
}

const API_BASE = 'https://api.webflow.com/v2'
const DEFAULT_HEADERS = {
  Authorization: `Bearer ${WEBFLOW_API_TOKEN}`,
  'accept-version': '1.0.0'
}

function decodeMarkup(value) {
  if (typeof value !== 'string') {
    return value
  }

  let result = value

  // First collapse double-encoded entities such as &amp;lt; or &amp;#123;
  result = result.replace(/&amp;([a-zA-Z]+;)/g, '&$1')
  result = result.replace(/&amp;#/gi, '&#')

  // Decode named entities that represent markup
  const namedReplacements = [
    [/&lt;/gi, '<'],
    [/&gt;/gi, '>'],
    [/&quot;/gi, '"'],
    [/&apos;/gi, "'"],
    [/&#39;/gi, "'"],
    [/&nbsp;/gi, '\u00A0'],
    [/&bull;/gi, '•'],
    [/&ndash;/gi, '–'],
    [/&mdash;/gi, '—'],
    [/&lsquo;/gi, '‘'],
    [/&rsquo;/gi, '’'],
    [/&ldquo;/gi, '“'],
    [/&rdquo;/gi, '”']
  ]
  namedReplacements.forEach(([pattern, replacement]) => {
    result = result.replace(pattern, replacement)
  })

  // Decode numeric entities
  result = result.replace(/&#x([0-9a-f]+);/gi, (_match, hex) => String.fromCodePoint(parseInt(hex, 16)))
  result = result.replace(/&#(\d+);/g, (_match, num) => String.fromCodePoint(parseInt(num, 10)))

  return result
}

function needsMarkupDecode(value) {
  return typeof value === 'string' && /&(?:lt;|gt;|amp;lt;|amp;gt;|amp;#)/i.test(value)
}

function normalizeBodyDescription(raw) {
  if (!needsMarkupDecode(raw)) {
    return { changed: false, value: raw }
  }

  const decoded = decodeMarkup(raw)
  return { changed: decoded !== raw, value: decoded }
}

function normalizePropertyFeature(raw) {
  if (typeof raw !== 'string') {
    return { changed: false, value: raw }
  }

  const shouldDecode = needsMarkupDecode(raw) || raw.includes('&')
  let decoded = shouldDecode ? decodeMarkup(raw) : raw
  let changed = decoded !== raw

  if (!decoded.trim()) {
    return { changed, value: decoded }
  }

  const leadingWhitespaceMatch = decoded.match(/^\s*/)
  const leadingWhitespace = leadingWhitespaceMatch ? leadingWhitespaceMatch[0] : ''
  let remainder = decoded.slice(leadingWhitespace.length)

  const additionalWhitespaceMatch = remainder.match(/^\s*/)
  const additionalWhitespace = additionalWhitespaceMatch ? additionalWhitespaceMatch[0] : ''
  remainder = remainder.slice(additionalWhitespace.length)

  const prefix = leadingWhitespace + additionalWhitespace

  if (!/^<h[1-6]\b/i.test(remainder)) {
    const paragraphMatch = remainder.match(/^<p(\s[^>]*)?>([\s\S]*?)<\/p>/i)
    if (paragraphMatch) {
      const [fullMatch, attrs = '', inner] = paragraphMatch
      remainder = `<h4${attrs}>${inner}</h4>` + remainder.slice(fullMatch.length)
      changed = true
    } else if (remainder.length > 0 && !remainder.startsWith('<')) {
      remainder = `<h4>${remainder}</h4>`
      changed = true
    }
  }

  let output = prefix + remainder

  const cleaned = output
    .replace(/<h4>\s*(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>)\s*<\/h4>/gi, '$1')
    .replace(/<p>\s*(<ul\b[^>]*>)/gi, '$1')
    .replace(/<ul\b([^>]*)>\s*<\/p>/gi, '<ul$1>')
    .replace(/<\/p>\s*(<li\b[^>]*>)/gi, '$1')
    .replace(/<p>\s*(<li\b[^>]*>)/gi, '$1')
    .replace(/<\/li>\s*<\/p>/gi, '</li>')
    .replace(/<p>\s*<\/ul>/gi, '</ul>')
    .replace(/<\/ul>\s*<\/p>/gi, '</ul>')
    .replace(/<p>\s*<\/p>/gi, '')

  if (cleaned !== output) {
    output = cleaned
    changed = true
  }

  return { changed, value: output }
}

function escapeHtml(value) {
  if (typeof value !== 'string') {
    return ''
  }
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return value.replace(/[&<>"']/g, (char) => map[char])
}

function convertMapField(raw) {
  if (typeof raw !== 'string') {
    return { changed: false, value: raw }
  }

  const trimmed = raw.trim()
  if (!trimmed) {
    return { changed: false, value: raw }
  }

  if (trimmed.startsWith('<')) {
    const srcMatch = trimmed.match(/src="([^"]+)"/i)
    if (srcMatch) {
      try {
        const url = new URL(srcMatch[1], 'https://www.google.com')
        const q = url.searchParams.get('q')
        if (q) {
          const [latPart, lngPart] = q.split(',')
          const lat = Number(latPart)
          const lng = Number(lngPart)
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            const zoomParam = Number(url.searchParams.get('z'))
            const zoom = Number.isFinite(zoomParam) ? zoomParam : 13
            const latString = lat.toFixed(6)
            const lngString = lng.toFixed(6)
            const iframeSrc = `https://www.google.com/maps?q=${latString},${lngString}&z=${zoom}&output=embed&iwloc=0`
            const html = `<div class="property-map" style="width:100%;height:100%;"><iframe src="${iframeSrc}" loading="lazy" style="border:0;width:100%;height:100%;" allowfullscreen></iframe></div>`
            if (html !== trimmed) {
              return { changed: true, value: html }
            }
            return { changed: false, value: raw }
          }
        }
      } catch (_error) {
        // fall through to conservative cleanup
      }
    }

    let updated = trimmed

    updated = updated.replace(/<div class="property-map"([^>]*)>/, (match, attrs = '') => {
      let newAttrs
      if (/\sstyle=/.test(attrs)) {
        newAttrs = attrs.replace(/\sstyle="[^"]*"/, ' style="width:100%;height:100%;"')
      } else {
        newAttrs = `${attrs} style="width:100%;height:100%;"`
      }
      return `<div class="property-map"${newAttrs}>`
    })

    updated = updated.replace(/<iframe([^>]*)>/, (match, attrs = '') => {
      let newAttrs
      if (/\sstyle=/.test(attrs)) {
        newAttrs = attrs.replace(/\sstyle="[^"]*"/, ' style="border:0;width:100%;height:100%;"')
      } else {
        newAttrs = `${attrs} style="border:0;width:100%;height:100%;"`
      }
      return `<iframe${newAttrs}>`
    })

    updated = updated.replace(/<p class="property-map__address">[\s\S]*?<\/p>/gi, '')
    updated = updated.replace(/src="([^"]+)"/, (match, url) => {
      let next = url
      if (!/iwloc=/.test(next)) {
        next = `${next}${next.includes('?') ? '&' : '?'}iwloc=0`
      }
      if (!/output=embed/.test(next)) {
        next = `${next}${next.includes('?') ? '&' : '?'}output=embed`
      }
      return `src="${next}"`
    })

    if (updated !== trimmed) {
      return { changed: true, value: updated }
    }

    return { changed: false, value: raw }
  }

  const jsonCandidate = trimmed.includes('&') ? decodeMarkup(trimmed) : trimmed

  try {
    const mapData = JSON.parse(jsonCandidate)
    if (!mapData || typeof mapData !== 'object') {
      return { changed: false, value: raw }
    }

    const location = mapData.location || {}
    const latitude = Number(location.latitude)
    const longitude = Number(location.longitude)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return { changed: false, value: raw }
    }

    const zoom = Number.isFinite(mapData.zoom) ? mapData.zoom : 13

    const latString = latitude.toFixed(6)
    const lngString = longitude.toFixed(6)
    const iframeSrc = `https://www.google.com/maps?q=${latString},${lngString}&z=${zoom}&output=embed&iwloc=0`

    const html = `<div class="property-map" style="width:100%;height:100%;"><iframe src="${iframeSrc}" loading="lazy" style="border:0;width:100%;height:100%;" allowfullscreen></iframe></div>`
    return { changed: html !== raw, value: html }
  } catch (_error) {
    return { changed: false, value: raw }
  }
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Request failed ${res.status}: ${body}`)
  }
  return res.json()
}

async function fetchAllItems() {
  const items = []
  let offset = 0
  const limit = 100

  while (true) {
    const params = new URLSearchParams({ offset: String(offset), limit: String(limit) })
    const data = await fetchJson(`${API_BASE}/collections/${COLLECTION_ID}/items?${params.toString()}`, {
      headers: DEFAULT_HEADERS
    })

    items.push(...data.items)

    const total = data?.pagination?.total ?? items.length
    if (items.length >= total || data.items.length === 0) {
      break
    }

    offset += data.items.length
  }

  return items
}

async function updateItem(itemId, fieldDataPatch) {
  const payload = {
    fieldData: fieldDataPatch
  }

  await fetchJson(`${API_BASE}/collections/${COLLECTION_ID}/items/${itemId}`, {
    method: 'PATCH',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
}

async function main() {
  console.log('🚀 Normalizing Webflow CMS content...')
  console.log(`   Collection ID: ${COLLECTION_ID}`)

  const items = await fetchAllItems()
  console.log(`📦 Retrieved ${items.length} items`)

  let updatedCount = 0
  let bodyUpdates = 0
  let featureUpdates = 0
  let mapUpdates = 0

  for (const item of items) {
    const fieldData = item.fieldData || {}
    const patch = {
      name: fieldData.name,
      slug: fieldData.slug
    }

    let itemChanged = false

    const { changed: bodyChanged, value: normalizedBody } = normalizeBodyDescription(fieldData['body-description'])
    if (bodyChanged) {
      patch['body-description'] = normalizedBody
      itemChanged = true
      bodyUpdates += 1
    }

    for (let i = 1; i <= 10; i += 1) {
      const key = `property-feature-${i}`
      if (!(key in fieldData)) continue
      const { changed, value } = normalizePropertyFeature(fieldData[key])
      if (changed) {
        patch[key] = value
        itemChanged = true
        featureUpdates += 1
      }
    }

    const { changed: mapChanged, value: mapHtml } = convertMapField(fieldData.map)
    if (mapChanged) {
      patch.map = mapHtml
      itemChanged = true
      mapUpdates += 1
    }

    if (itemChanged) {
      await updateItem(item.id, patch)
      updatedCount += 1
      console.log(`   ✅ Updated item ${item.id}`)
    }
  }

  console.log('\n📊 Update Summary')
  console.log(`   Items processed: ${items.length}`)
  console.log(`   Items updated: ${updatedCount}`)
  console.log(`   Body descriptions decoded: ${bodyUpdates}`)
  console.log(`   Property features normalized: ${featureUpdates}`)
  console.log(`   Map embeds generated: ${mapUpdates}`)
}

main().catch((error) => {
  console.error('❌ Script failed:', error.message)
  process.exit(1)
})
