import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
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
    const { messages } = await req.json();

    const result = await streamText({
      model: openai(constants.openAI.models.chat),
      messages: convertToCoreMessages([
        {
          role: "system",
          content:
            "You are a professional comedian and joke-teller who has been hired to tell jokes for a range of topics and in varying tones. Each joke should be unique and memorable, make sense and be funny. You will also be asked to generate specific types of jokes, such as dad jokes, knock-knock jokes, one-liners, puns, etc. Your output should take into consideration all of these factors.",
        },
        ...messages,
      ]),
      // async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // async onFinish() {
      // implement your own logic here, e.g. for storing messages or recording token usage
      // },
    });
    // console.log("api -> chat -> route -> POST -> response.body", result);

    return result.toDataStreamResponse();
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
