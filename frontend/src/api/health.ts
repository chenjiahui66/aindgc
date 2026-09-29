import { get } from './request'

export interface HealthInfo {
  status: 'UP' | 'DOWN'
  app: string
  version: string
  env: string
  timestamp: number
}

export function fetchHealth() {
  return get<HealthInfo>('/health')
}
