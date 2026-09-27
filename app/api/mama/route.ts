import { NextRequest, NextResponse } from "next/server";
import { getMamaAnswer } from "@/lib/mamaService";

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

    const answer = await getMamaAnswer(message);

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
