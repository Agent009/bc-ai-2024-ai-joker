import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, generateText } from "ai";
import { NextResponse } from "next/server";
import { constants } from "@lib/index";

// Limit streaming responses by x seconds
export const maxDuration = 90;
export const runtime = "edge";

const openai = createOpenAI({
  apiKey: constants.openAI.apiKey,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export async function POST(req: Request) {
  try {
    const { joke } = await req.json();

    // Call OpenAI API to evaluate the joke
    const { text } = await generateText({
      model: openai(constants.openAI.models.chat),
      messages: convertToCoreMessages([
        {
          role: "system",
          content: `Evaluate the following joke and classify it as "funny", "appropriate", or "offensive":\n\n${joke}\n\nEvaluation:`,
        },
      ]),
    });
    console.log("api -> evaluate -> route -> POST -> text", text);

    return Response.json({ text });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      { status: 500 },
    );
  }
}
