import { NextRequest, NextResponse } from "next/server";
import { getMamaAnswer } from "@/lib/mamaService";
import { ratelimit } from "@/lib/ratelimit";
import { ipAddress } from "@vercel/functions";

export async function POST(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";

  // 診断ログ 1: 環境とIPの確認
  const currentIp = ipAddress(req);
  console.log("[Mama Diagnostics: Env & IP]", {
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
    HAS_KV_URL: Boolean(process.env.KV_REST_API_URL),
    HAS_KV_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
    detectedIp: currentIp,
  });

  try {
    // 1. IP取得
    const ip = currentIp;
    
    // IPが取得できない場合のフォールバック: 
    // "anonymous" という固定識別子を使用する。
    const identifier = ip ?? "anonymous";

    // 2. レートリミットの適用
    if (ratelimit) {
      try {
        // 診断ログ 2: Ratelimit開始
        console.log("[Mama Diagnostics: Ratelimit Start]", { identifier });
        
        const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
        
        // 診断ログ 3: Ratelimit結果
        console.log("[Mama Diagnostics: Ratelimit Result]", { success, remaining, reset });

        if (!success) {
          return NextResponse.json(
            { error: "ちょっと、立て続けに話しすぎよ。1分間に5回までにしてちょうだい。" },
            { 
              status: 429,
              headers: {
                "X-RateLimit-Limit": limit.toString(),
                "X-RateLimit-Remaining": remaining.toString(),
                "X-RateLimit-Reset": reset.toString(),
              }
            }
          );
        }
      } catch (error) {
        console.error("Ratelimit Error:", error);
        // Upstash障害時の挙動: 本番環境では fail-closed (課金事故防止)
        if (isProduction) {
          return NextResponse.json(
            { error: "ごめんなさいね、お店の整理券システムが故障中なの。少し時間を置いてみて。" },
            { status: 503 }
          );
        }
      }
    } else {
      // Upstash未設定時の挙動: 本番環境では fail-closed
      if (isProduction) {
        console.error("Upstash Redis is not configured in production.");
        return NextResponse.json(
          { error: "お店の準備が整ってないみたい。管理者に言いなさい。" },
          { status: 503 }
        );
      }
    }

    // 3. サーバー側入力バリデーション
    const body = await req.json().catch(() => ({}));
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "相談内容が送られてきてないわよ。" }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json({ error: "黙ってないで、何か言いなさいよ。" }, { status: 400 });
    }
    if (trimmedMessage.length < 2) {
      return NextResponse.json({ error: "それだけじゃ分からないわ。もう少し詳しく話しなさい。" }, { status: 400 });
    }
    if (trimmedMessage.length > 500) {
      return NextResponse.json({ error: "相談内容は500文字以内で入力してちょうだい。" }, { status: 400 });
    }

    // 4. OpenAI API 呼び出し (1リクエスト1回のみ)
    const answer = await getMamaAnswer(trimmedMessage);

    return NextResponse.json(answer);
  } catch (error: any) {
    console.error("Mama API Error:", error);
    
    let errorMessage = "ごめんなさいね、今ちょっとママの頭が回ってないみたい。もう一度聞いてちょうだい。";
    
    if (error?.message?.includes("apiKey") || error?.message?.includes("API_KEY")) {
      errorMessage = "APIキーが設定されていないわよ。管理者に言いなさい。";
    }
    
    if (error?.status === 429) {
      errorMessage = "OpenAI側の制限にかかっちゃったみたい。少し時間を置いてからまた来て。";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error?.status || 500 }
    );
  }
}
