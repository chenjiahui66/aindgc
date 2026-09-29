/**
 * Download helpers — text, JSON, and ZIP.
 * ZIP uses minimal inline implementation (no extra dependency in Phase 4).
 */

export function downloadText(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  trigger(blob, filename)
}

export function downloadJSON(filename: string, data: unknown) {
  const text = JSON.stringify(data, null, 2)
  downloadText(filename, text, 'application/json;charset=utf-8')
}

export function downloadMarkdown(filename: string, content: string) {
  downloadText(filename, content, 'text/markdown;charset=utf-8')
}

function trigger(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // delay revoke to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/* ===== Minimal ZIP writer (store, no compression) =====
 * Enough for the file bundles Phase 4 needs.
 * Format reference: PKWARE APPNOTE 6.3.x
 */
interface ZipEntry {
  name: string
  data: Uint8Array
  crc: number
  size: number
}

export function createZip(entries: { name: string; content: string }[]): Blob {
  const fileEntries: ZipEntry[] = entries.map(e => {
    const data = new TextEncoder().encode(e.content)
    return {
      name: e.name,
      data,
      crc: crc32(data),
      size: data.length
    }
  })

  const now = new Date()
  const dosTime = dosDateTime(now)

  const parts: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0

  for (const entry of fileEntries) {
    const nameBytes = new TextEncoder().encode(entry.name)
    const local = new Uint8Array(30 + nameBytes.length)
    const lv = new DataView(local.buffer)
    lv.setUint32(0, 0x04034b50, true)          // local file header signature
    lv.setUint16(4, 20, true)                  // version needed
    lv.setUint16(6, 0x0800, true)              // general purpose bit flag (UTF-8)
    lv.setUint16(8, 0, true)                   // compression method (stored)
    lv.setUint16(10, dosTime.time, true)
    lv.setUint16(12, dosTime.date, true)
    lv.setUint32(14, entry.crc, true)
    lv.setUint32(18, entry.size, true)         // compressed size
    lv.setUint32(22, entry.size, true)         // uncompressed size
    lv.setUint16(26, nameBytes.length, true)
    lv.setUint16(28, 0, true)                  // extra field length
    local.set(nameBytes, 30)

    parts.push(local, entry.data)

    // central directory
    const c = new Uint8Array(46 + nameBytes.length)
    const cv = new DataView(c.buffer)
    cv.setUint32(0, 0x02014b50, true)          // central dir signature
    cv.setUint16(4, 20, true)                  // version made by
    cv.setUint16(6, 20, true)                  // version needed
    cv.setUint16(8, 0x0800, true)
    cv.setUint16(10, 0, true)
    cv.setUint16(12, dosTime.time, true)
    cv.setUint16(14, dosTime.date, true)
    cv.setUint32(16, entry.crc, true)
    cv.setUint32(20, entry.size, true)
    cv.setUint32(24, entry.size, true)
    cv.setUint16(28, nameBytes.length, true)
    cv.setUint16(30, 0, true)
    cv.setUint16(32, 0, true)
    cv.setUint16(34, 0, true)
    cv.setUint16(36, 0, true)
    cv.setUint32(38, 0, true)
    cv.setUint32(42, offset, true)
    c.set(nameBytes, 46)
    central.push(c)

    offset += local.length + entry.data.length
  }

  const centralStart = offset
  let centralSize = 0
  for (const c of central) {
    parts.push(c)
    centralSize += c.length
  }

  // End of central directory
  const eocd = new Uint8Array(22)
  const ev = new DataView(eocd.buffer)
  ev.setUint32(0, 0x06054b50, true)
  ev.setUint16(4, 0, true)
  ev.setUint16(6, 0, true)
  ev.setUint16(8, fileEntries.length, true)
  ev.setUint16(10, fileEntries.length, true)
  ev.setUint32(12, centralSize, true)
  ev.setUint32(16, centralStart, true)
  ev.setUint16(20, 0, true)

  parts.push(eocd)

  return new Blob(parts as BlobPart[], { type: 'application/zip' })
}

export function downloadZip(filename: string, entries: { name: string; content: string }[]) {
  const blob = createZip(entries)
  trigger(blob, filename)
}

/* ===== helpers ===== */
function dosDateTime(d: Date): { time: number; date: number } {
  const time = ((d.getHours() & 0x1f) << 11) | ((d.getMinutes() & 0x3f) << 5) | ((d.getSeconds() >> 1) & 0x1f)
  const date = (((d.getFullYear() - 1980) & 0x7f) << 9) | (((d.getMonth() + 1) & 0x0f) << 5) | (d.getDate() & 0x1f)
  return { time, date }
}

/* Standard CRC-32 (polynomial 0xEDB88320) */
let crcTable: Uint32Array | null = null
function crc32(data: Uint8Array): number {
  if (!crcTable) {
    crcTable = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
      }
      crcTable[i] = c >>> 0
    }
  }
  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    crc = (crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)) >>> 0
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}
