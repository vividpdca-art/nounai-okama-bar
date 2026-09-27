import { openai, OPENAI_MODEL } from "./openai";
import { MAMA_SYSTEM_PROMPT } from "./mamaPrompt";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { MamaAnswerType } from "@/types";

export const MamaAnswerSchema = z.object({
  shout: z.string(),
  hitokoto: z.string(),
  action: z.string(),
  safety: z.boolean(),
});

export async function getMamaAnswer(message: string): Promise<MamaAnswerType> {
  // 深刻な相談のキーワード判定（安全側に倒すための強化版）
  const criticalKeywords = [
    "死にたい", "死のう", "自殺", 
    "消えたい", "消えてしまいたい", "消えてしまいたい",
    "いなくなりたい", "いなくなれたら",
    "生きていたくない", "生きてる意味がない", "生きる意味がない",
    "自分を傷つけ", "リスカ", "自傷", "ＯＤ",
    "終わりにしたい", "虐待", "DV", "暴力", "助けて"
  ];
  
  // 文章全体からキーワードを探す
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

  const answer = response.output_parsed as MamaAnswerType;

  if (!answer) {
    throw new Error("ママの回答を読み取れなかったわ。");
  }

  // 安全判定の統合 (安全側に倒す)
  // キーワードに該当する、またはLLMが深刻だと判断した場合、どちらか一方でも true なら最終的に true とする
  if (isCritical || answer.safety === true) {
    answer.safety = true;
  }
  
  // 重要: LLMが true と判断したものをキーワードがない理由で false に戻す処理は行わない

  return answer;
}
