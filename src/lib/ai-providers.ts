// ============================================================================
// AI Provider Configuration — Multi-provider abstraction
// z.ai is one option among others. New providers can be added here.
// ============================================================================

export type ProviderId = 'z-ai' | 'openai' | 'anthropic'

export interface AIProviderConfig {
  id: ProviderId
  name: string
  description: string
  enabled: boolean
  /** Priority: lower = tried first */
  priority: number
  /** Max tokens for response */
  maxTokens?: number
  /** Temperature (0 = deterministic, 1 = creative) */
  temperature?: number
}

export const AI_PROVIDERS: Record<ProviderId, AIProviderConfig> = {
  'z-ai': {
    id: 'z-ai',
    name: 'Z.ai Web Dev SDK',
    description: 'Built-in AI provider via z-ai-web-dev-sdk. Default provider.',
    enabled: true,
    priority: 1,
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI GPT models. Requires OPENAI_API_KEY environment variable.',
    enabled: !!process.env.OPENAI_API_KEY,
    priority: 2,
    maxTokens: 4096,
    temperature: 0.7,
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Anthropic Claude models. Requires ANTHROPIC_API_KEY environment variable.',
    enabled: !!process.env.ANTHROPIC_API_KEY,
    priority: 3,
    maxTokens: 4096,
    temperature: 0.7,
  },
}

/**
 * Get the active provider based on priority and availability.
 * Returns the first enabled provider with the lowest priority number.
 */
export function getActiveProvider(): AIProviderConfig {
  const enabled = Object.values(AI_PROVIDERS)
    .filter((p) => p.enabled)
    .sort((a, b) => a.priority - b.priority)

  return enabled[0] || AI_PROVIDERS['z-ai']
}

/**
 * Get all enabled providers sorted by priority.
 */
export function getEnabledProviders(): AIProviderConfig[] {
  return Object.values(AI_PROVIDERS)
    .filter((p) => p.enabled)
    .sort((a, b) => a.priority - b.priority)
}

/**
 * Check if a specific provider is available.
 */
export function isProviderAvailable(id: ProviderId): boolean {
  return AI_PROVIDERS[id]?.enabled ?? false
}
