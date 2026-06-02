import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import {
  PROMPT_MAP,
  PROMPT_MAP_EN,
  AIFeature
} from '@/lib/ai-prompts'

import fs from 'fs/promises'
import path from 'path'

// Singleton ZAI instance — reuse across requests
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    const configPath = path.join(process.cwd(), '.z-ai-config')
    try {
      await fs.access(configPath)
    } catch {
      // If config doesn't exist, write it dynamically from environment variables
      const baseUrl = process.env.ZAI_BASE_URL || process.env.NEXT_PUBLIC_ZAI_BASE_URL
      const apiKey = process.env.ZAI_API_KEY || process.env.NEXT_PUBLIC_ZAI_API_KEY
      if (baseUrl && apiKey) {
        try {
          await fs.writeFile(configPath, JSON.stringify({ baseUrl, apiKey }, null, 2))
          console.log('Runtime ZAI configuration initialized successfully.')
        } catch (e) {
          console.error('Failed to write runtime ZAI config:', e)
        }
      }
    }
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

type Feature = AIFeature

function buildMessages(feature: Feature, payload: Record<string, unknown>, language?: string) {
  const systemPrompt = language === 'en' ? PROMPT_MAP_EN[feature] : PROMPT_MAP[feature]

  switch (feature) {
    case 'manifestation': {
      const { manifestation, category } = payload
      const content = language === 'en'
        ? `I want to manifest: ${manifestation}\n\nCategory: ${category}\n\nPlease analyze and return the result in JSON format according to the instructions.`
        : `Saya ingin memanifestasikan: ${manifestation}\n\nKategori: ${category}\n\nMohon analisa dan berikan hasil dalam format JSON sesuai instruksi.`
      return [
        { role: 'system' as const, content: systemPrompt },
        {
          role: 'user' as const,
          content,
        },
      ]
    }
    case 'limiting-belief': {
      const { answers } = payload
      const formattedAnswers = Object.entries(answers as Record<string, string | number>)
        .map(([id, answer]) => language === 'en' ? `Question ${id}: ${answer}` : `Pertanyaan ${id}: ${answer}`)
        .join('\n')
      const content = language === 'en'
        ? `Here are my questionnaire answers:\n\n${formattedAnswers}\n\nPlease analyze and return the result in JSON format according to the instructions.`
        : `Berikut jawaban kuesioner saya:\n\n${formattedAnswers}\n\nMohon analisa dan berikan hasil dalam format JSON sesuai instruksi.`
      return [
        { role: 'system' as const, content: systemPrompt },
        {
          role: 'user' as const,
          content,
        },
      ]
    }
    case 'shadow': {
      const { answers } = payload
      const formattedAnswers = Object.entries(answers as Record<string, string | number>)
        .map(([id, answer]) => language === 'en' ? `Question ${id}: ${answer}` : `Pertanyaan ${id}: ${answer}`)
        .join('\n')
      const content = language === 'en'
        ? `Here are my questionnaire answers:\n\n${formattedAnswers}\n\nPlease analyze and return the result in JSON format according to the instructions.`
        : `Berikut jawaban kuesioner saya:\n\n${formattedAnswers}\n\nMohon analisa dan berikan hasil dalam format JSON sesuai instruksi.`
      return [
        { role: 'system' as const, content: systemPrompt },
        {
          role: 'user' as const,
          content,
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

async function callOpenRouter(messages: Array<{ role: 'system' | 'assistant' | 'user'; content: string }>) {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL || 'openrouter/owl-alpha'
  const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'

  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured in environment variables.')
  }

  console.log(`Initiating OpenRouter fallback request with model: ${model}`)
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
    })
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`OpenRouter request failed: ${errText}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('OpenRouter returned an empty response')
  }
  return content
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
      console.error(`Z.ai attempt ${attempt} failed:`, lastError.message)

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  // Fallback to OpenRouter if Z.ai failed
  console.warn('All Z.ai attempts failed or configuration was missing. Falling back to OpenRouter...')
  try {
    const response = await callOpenRouter(messages)
    return response
  } catch (orError: any) {
    console.error('OpenRouter fallback also failed:', orError.message)
    throw lastError || orError
  }
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
    const { feature, payload, language } = body as { feature: Feature; payload: Record<string, unknown>; language?: string }

    // Validate feature
    if (!feature || (!PROMPT_MAP[feature] && !PROMPT_MAP_EN[feature])) {
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
    const messages = buildMessages(feature, payload, language)

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
