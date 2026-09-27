import { NextRequest, NextResponse } from "next/server";
import { openai, OPENAI_MODEL } from "@/lib/openai";
import { MAMA_SYSTEM_PROMPT } from "@/lib/mamaPrompt";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const MamaAnswerSchema = z.object({
  shout: z.string(),
  hitokoto: z.string(),
  action: z.string(),
  safety: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // バリデーション
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "相談内容を入力してください。" }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json({ error: "相談内容は500文字以内で入力してください。" }, { status: 400 });
    }

    // 簡易的な深刻度チェック
    const criticalKeywords = ["死にたい", "殺す", "自殺", "消えたい", "虐待", "DV", "暴力"];
    const isCritical = criticalKeywords.some(keyword => message.includes(keyword));

    // Responses API の構造化出力 (公式推奨形)
    const client = openai as any;
    const response = await client.responses.parse({
      model: OPENAI_MODEL,
      instructions: MAMA_SYSTEM_PROMPT,
      input: message,
      text: {
        format: zodTextFormat(MamaAnswerSchema, "mama_answer")
      }
    });

    const answer = response.output_parsed;

    if (!answer) {
      throw new Error("ママの回答を読み取れなかったわ。");
    }

    // サーバーサイドでの安全性上書き
    if (isCritical) {
      answer.safety = true;
    }

    return NextResponse.json(answer);
  } catch (error: any) {
    console.error("Mama API Error:", error);
    
    let errorMessage = "ごめんなさいね、今ちょっとママの頭が回ってないみたい。もう一度聞いてちょうだい。";
    
    if (error?.message?.includes("apiKey") || error?.message?.includes("API_KEY")) {
      errorMessage = "APIキーが設定されていないわよ。管理者に言いなさい。";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
