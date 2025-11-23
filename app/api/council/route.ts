import { CHAIRMAN_MODEL, COUNCIL_MODELS, REVIEWER_MODEL } from "@/lib/models";
import { generateText } from "ai";

interface ModelResponse {
  model: string;
  response: string;
  modelLabel: string;
}

export async function POST(request: Request) {
  const { query } = await request.json();

  if (!query || typeof query !== "string") {
    return Response.json({ error: "Invalid query" }, { status: 400 });
  }

  try {
    const responses: ModelResponse[] = [];

    for (const modelConfig of COUNCIL_MODELS) {
      const { text } = await generateText({
        model: modelConfig.model,
        prompt: query,
      });

      responses.push({
        model: modelConfig.id,
        response: text,
        modelLabel: modelConfig.label,
      });
    }

    const reviewPrompt = buildReviewPrompt(query, responses);

    const { text: reviewText } = await generateText({
      model: REVIEWER_MODEL,
      prompt: reviewPrompt,
    });

    const chairmamPrompt = buildChairmanPrompt(query, responses, reviewText);

    const { text: finalResponse } = await generateText({
      model: CHAIRMAN_MODEL,
      prompt: chairmamPrompt,
    });

    return Response.json({
      query,
      councilResponses: responses,
      review: reviewText,
      finalResponse,
    });
  } catch (error) {
    console.error("Council error:", error);
    return Response.json(
      { error: "Failed to process council" },
      { status: 500 },
    );
  }
}

function buildReviewPrompt(query: string, responses: ModelResponse[]): string {
  const responsesText = responses
    .map((r, i) => `Response ${i + 1} (${r.modelLabel}):\n${r.response}`)
    .join("\n\n---\n\n");

  return `You are reviewing AI model responses. The user asked: "${query}"

Here are responses from different AI models:

${responsesText}

Please:
1. Evaluate the quality and accuracy of each response
2. Identify strengths and weaknesses of each
3. Rank them from best to worst with reasoning
4. Note which response(s) best address the query

Provide your analysis in a structured format.`;
}

function buildChairmanPrompt(
  query: string,
  responses: ModelResponse[],
  review: string,
): string {
  const responsesText = responses
    .map((r, i) => `Response ${i + 1} (${r.modelLabel}):\n${r.response}`)
    .join("\n\n---\n\n");

  return `You are the Chairman LLM tasked with synthesizing a final response based on council member input.

User Query: "${query}"

Council Members' Responses:
${responsesText}

Council Review & Analysis:
${review}

Based on all the above input, provide a comprehensive final response that:
1. Synthesizes the best elements from all council responses
2. Incorporates the insights from the review
3. Is balanced, accurate, and well-reasoned
4. Addresses the user's query directly and completely

Provide only the final synthesized response, no meta-commentary.`;
}
