/**
 * Public site configuration.
 *
 * Backed by GET /api/site/config/public, which returns only the rows flagged
 * is_public = 1. Keys are flat strings, e.g. `site.icp`, `contact.email`.
 *
 * Every value is editable at runtime from Admin → Settings, so the footer
 * must read from here rather than hardcoding — otherwise changing the ICP
 * number would require a rebuild and redeploy.
 */
import { get } from './request'

export type PublicSiteConfig = Record<string, string>

export function fetchPublicSiteConfig() {
  return get<PublicSiteConfig>('/site/config/public')
}