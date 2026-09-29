/**
 * Share helpers — encode payload to URL fragment and decode back.
 * Used for "Share result" on tool pages and ROI/Checkup.
 */

export function encodeShare<T>(payload: T): string {
  try {
    const json = JSON.stringify(payload)
    // base64url encode UTF-8 bytes
    const bytes = new TextEncoder().encode(json)
    let bin = ''
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  } catch {
    return ''
  }
}

export function decodeShare<T>(token: string): T | null {
  try {
    let s = token.replace(/-/g, '+').replace(/_/g, '/')
    while (s.length % 4) s += '='
    const bin = atob(s)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

export async function copyShareLink(token: string, basePath = location.pathname): Promise<boolean> {
  const url = `${location.origin}${basePath}#share=${token}`
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    /* ignore */
    return false
  }
}
