import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message?.model || !message?.text) {
      return NextResponse.json(
        { error: "Missing model or message" },
        { status: 400 }
      );
    }

    const selectedModel = message.model;
    const senderStringMessage = message.text;

    if (selectedModel.startsWith("gemini")) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: "Gemini API key not configured" },
          { status: 500 }
        );
      }

      // Initialize the client with your API key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: selectedModel });

      const prompt = senderStringMessage;

      const result = await model.generateContent(prompt);

      const botText = result.response.text() || "No response";
      const botMessage = { text: botText, sender: "TruSeek" };
      return NextResponse.json(botMessage, { status: 200 });
    } else if (selectedModel.startsWith("gpt")) {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      try{
        const completion = await openai.chat.completions.create({
        model: selectedModel,
        messages: [{ role: "user", content: senderStringMessage }],
      })
      const botText =
        completion.choices?.[0]?.message?.content || "No response";
      const botMessage = { text: botText, sender: "TruSeek" };
      return NextResponse.json(botMessage, { status: 200 });;
      }
      catch(e){
        return NextResponse.json({ text: "You do not have an active plan.", sender: "TruSeek" });
      }
    }

    return NextResponse.json({ error: "Unsupported model" }, { status: 400 });
  } catch (e) {
    console.error("Error in POST /api/chat:", e);
    return NextResponse.json({ error: `Error: ${e.message}` }, { status: 500 });
  }
}
