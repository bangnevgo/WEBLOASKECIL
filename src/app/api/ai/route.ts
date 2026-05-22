import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import {
  MANIFESTATION_PROMPT,
  LIMITING_BELIEF_PROMPT,
  SHADOW_PROMPT,
  PRIVATE_SESSION_PROMPT,
} from '@/lib/ai-prompts'

// Singleton ZAI instance — reuse across requests
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  import ZAI from 'z-ai-web-dev-sdk'

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

type Feature = 'manifestation' | 'limiting-belief' | 'shadow' | 'private-session'

const SYSTEM_PROMPTS: Record<Feature, string> = {
  'manifestation': MANIFESTATION_PROMPT,
  'limiting-belief': LIMITING_BELIEF_PROMPT,
  'shadow': SHADOW_PROMPT,
  'private-session': PRIVATE_SESSION_PROMPT,
}

function buildMessages(feature: Feature, payload: Record<string, unknown>) {
  const systemPrompt = SYSTEM_PROMPTS[feature]

  switch (feature) {
    case 'manifestation': {
      const { manifestation, category } = payload
      return [
        { role: 'system' as const, content: systemPrompt },
        {
          role: 'user' as const,
          content: `Saya ingin memanifestasikan: ${manifestation}\n\nKategori: ${category}\n\nMohon analisa dan berikan hasil dalam format JSON sesuai instruksi.`,
        },
      ]
    }
    case 'limiting-belief': {
      const { answers } = payload
      const formattedAnswers = Object.entries(answers as Record<string, string | number>)
        .map(([id, answer]) => `Pertanyaan ${id}: ${answer}`)
        .join('\n')
      return [
        { role: 'system' as const, content: systemPrompt },
        {
          role: 'user' as const,
          content: `Berikut jawaban kuesioner saya:\n\n${formattedAnswers}\n\nMohon analisa dan berikan hasil dalam format JSON sesuai instruksi.`,
        },
      ]
    }
    case 'shadow': {
      const { answers } = payload
      const formattedAnswers = Object.entries(answers as Record<string, string | number>)
        .map(([id, answer]) => `Pertanyaan ${id}: ${answer}`)
        .join('\n')
      return [
        { role: 'system' as const, content: systemPrompt },
        {
          role: 'user' as const,
          content: `Berikut jawaban kuesioner saya:\n\n${formattedAnswers}\n\nMohon analisa dan berikan hasil dalam format JSON sesuai instruksi.`,
        },
      ]
    }
    case 'private-session': {
      const { messages } = payload
      const userMessages = (messages as Array<{ role: string; content: string }>).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))
      return [
        { role: 'system' as const, content: systemPrompt },
        ...userMessages,
      ]
    }
    default:
      return []
  }
}

function parseAIResponse(text: string, feature: Feature) {
  if (feature === 'private-session') {
    return { message: text }
  }

  // Try to extract JSON from the response
  try {
    // Try direct JSON parse first
    return JSON.parse(text)
  } catch {
    // Try extracting from markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim())
      } catch {
        // Fall through
      }
    }
    // Try finding JSON object in text
    const objectMatch = text.match(/\{[\s\S]*\}/)
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0])
      } catch {
        // Fall through
      }
    }
    // Return raw text as fallback
    return { raw: text }
  }
}

async function callWithRetry(messages: Array<{ role: 'system' | 'assistant' | 'user'; content: string }>, retries = 3) {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const zai = await getZAI()
      const completion = await zai.chat.completions.create({
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages,
        thinking: { type: 'disabled' },
      })

      const response = completion.choices[0]?.message?.content

      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from AI')
      }

      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.error(`AI attempt ${attempt} failed:`, lastError.message)

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  throw lastError || new Error('AI request failed')
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    features: ['manifestation', 'limiting-belief', 'shadow', 'private-session'],
    provider: 'z-ai-web-dev-sdk',
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { feature, payload } = body as { feature: Feature; payload: Record<string, unknown> }

    // Validate feature
    if (!feature || !SYSTEM_PROMPTS[feature]) {
      return NextResponse.json(
        { success: false, error: 'Invalid feature. Must be one of: manifestation, limiting-belief, shadow, private-session' },
        { status: 400 }
      )
    }

    // Validate payload
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Payload is required' },
        { status: 400 }
      )
    }

    // Feature-specific validation
    if (feature === 'manifestation' && (!payload.manifestation || !payload.category)) {
      return NextResponse.json(
        { success: false, error: 'manifestation and category are required' },
        { status: 400 }
      )
    }
    if ((feature === 'limiting-belief' || feature === 'shadow') && !payload.answers) {
      return NextResponse.json(
        { success: false, error: 'answers are required' },
        { status: 400 }
      )
    }
    if (feature === 'private-session' && (!payload.messages || !Array.isArray(payload.messages))) {
      return NextResponse.json(
        { success: false, error: 'messages array is required' },
        { status: 400 }
      )
    }

    // Build messages
    const messages = buildMessages(feature, payload)

    // Call AI with retry
    const aiResponse = await callWithRetry(messages)

    // Parse response
    const data = parseAIResponse(aiResponse, feature)

    return NextResponse.json({
      success: true,
      feature,
      data,
    })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
