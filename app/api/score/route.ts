import { generateText, Output } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const { statement } = await req.json()

    if (!statement || typeof statement !== "string" || statement.length > 500) {
      return Response.json({ error: "Invalid statement" }, { status: 400 })
    }

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({
        schema: z.object({
          score: z
            .number()
            .describe(
              "Bearishness score from 0-100. 0 is not bearish at all, 100 is the most apocalyptically bearish statement imaginable. Consider factors like: specificity of doom predictions, use of dramatic language, scope of market destruction predicted, originality of the bearish thesis, and conviction level."
            ),
          rank: z.enum([
            "Baby Bear",
            "Grizzly",
            "Polar Bear",
            "Kodiak",
            "Apocalypse Bear",
          ]).describe(
            "Rank based on score: 0-30 = Baby Bear, 31-50 = Grizzly, 51-70 = Polar Bear, 71-89 = Kodiak, 90-100 = Apocalypse Bear"
          ),
          reasoning: z
            .string()
            .describe(
              "A short, witty 1-2 sentence analysis of why this statement earned its bearishness score. Be entertaining and play into the bear market theme."
            ),
        }),
      }),
      prompt: `You are the official judge at the Bear Capital Market Forum, the most bearish financial forum on the internet. Your job is to score how BEARISH a financial market statement is on a scale of 0-100.

Scoring Guide:
- 0-30 (Baby Bear): Mild concerns, generic worry, not very specific
- 31-50 (Grizzly): Solid bearish thesis but lacking conviction or specificity
- 51-70 (Polar Bear): Strong bearish argument with good reasoning and specifics
- 71-89 (Kodiak): Extremely bearish with detailed doom scenarios and strong conviction
- 90-100 (Apocalypse Bear): Reserved for the most catastrophically bearish, apocalyptically doom-laden statements that predict total financial annihilation

Rate this statement: "${statement}"`,
    })

    if (!output) {
      return Response.json(
        { error: "Failed to generate score" },
        { status: 500 }
      )
    }

    return Response.json(output)
  } catch {
    return Response.json(
      { error: "Failed to score statement" },
      { status: 500 }
    )
  }
}
