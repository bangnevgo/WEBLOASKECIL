# Task 12 — backend-developer

## Task: Create AI backend — ai-prompts.ts and API route

## Summary
Created two backend files for the AI feature on the Neville Goddard teaching website:

### File 1: `/home/z/my-project/src/lib/ai-prompts.ts`
- **MANIFESTATION_PROMPT** (FREE): Detailed system prompt for manifestation analysis — returns 3 handicaps, 5 affirmations, duration/frequency, daily ritual in structured JSON
- **LIMITING_BELIEF_PROMPT** (PAID): Detailed system prompt for limiting belief analysis — returns 3 beliefs, root fears, reprogramming techniques, affirmations, timeline in structured JSON
- **SHADOW_PROMPT** (PAID): Detailed system prompt for shadow work — returns shadow pattern, manifestation block, integration steps, daily practice, warnings in structured JSON
- **PRIVATE_SESSION_PROMPT** (PAID): Detailed system prompt for multi-turn chat — acts as Neville Goddard practitioner with diagnostic questions and personalized action plans (free-form text, no JSON)
- **MANIFESTATION_CATEGORIES**: `['Kesehatan', 'Karir & Keuangan', 'Hubungan', 'Spiritual', 'Kreativitas', 'Lainnya']`
- **LIMITING_BELIEF_QUESTIONS**: 8 questions with `text` and `scale` types
- **SHADOW_QUESTIONS**: 8 questions with `text` and `scale` types
- **PROMPT_MAP**: Record<AIFeature, string> for easy lookup
- All prompts are in Bahasa Indonesia, use Neville Goddard terminology (asumsi, perasaan, kesadaran, SATS, I AM, revisi, etc.)

### File 2: `/home/z/my-project/src/app/api/ai/route.ts`
- Singleton ZAI instance (reused across requests via `getZAI()`)
- POST handler accepting `{ feature, payload }` body
- Feature-specific payload validation (manifestation needs manifestation+category, limiting-belief/shadow need answers, private-session needs messages array)
- `buildMessages()` constructs appropriate message arrays for each feature type
- `parseAIResponse()` extracts JSON from AI response (supports markdown code blocks, raw JSON, and fallback)
- `callWithRetry()` with exponential backoff (3 attempts, 1s → 2s → 4s delays)
- Uses `role: 'assistant'` for system prompts per SDK spec
- `thinking: { type: 'disabled' }`
- Error handling: 400 for invalid input, 500 for AI errors
- Returns `{ success: true, feature, data }` or `{ success: false, error }`

## Verification
- `bun run lint` passes with no errors
- Dev server compiles successfully
