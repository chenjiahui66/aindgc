/**
 * Markdown rendering for tool preview.
 * Phase 4 keeps it simple — just escape + line breaks + basic headings.
 * Phase 8 will introduce Shiki for code highlighting.
 */

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderMarkdownLite(md: string): string {
  // very lightweight: code fences, headers, bold, italic, lists
  const escaped = escapeHtml(md)
  return escaped
    .replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="md-code"><code class="lang-${lang || 'text'}">${code}</code></pre>`
    })
    .replace(/^#{1,6}\s+(.*)$/gm, (_, text) => {
      const level = _.match(/^#+/)[0].length
      return `<h${level} class="md-h md-h${level}">${text}</h${level}>`
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>')
    .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul class="md-ul">${m}</ul>`)
    .replace(/\n\n+/g, '</p><p class="md-p">')
    .replace(/^/, '<p class="md-p">')
    .replace(/$/, '</p>')
}
