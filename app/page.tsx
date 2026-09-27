"use client";

import { useState, useRef } from "react";
import MamaCharacter from "@/components/MamaCharacter";
import ConsultationForm from "@/components/ConsultationForm";
import MamaAnswer from "@/components/MamaAnswer";
import { MamaAnswerType } from "@/types";

export default function Home() {
  const [status, setStatus] = useState<"initial" | "loading" | "answered">("initial");
  const [answer, setAnswer] = useState<MamaAnswerType | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const fixedAnswer: MamaAnswerType = {
    shout: "あんた、それ本当に悩まなきゃいけないこと？",
    hitokoto: "頭の中だけで考えてると、悩みって勝手に大きくなるのよ。",
    action: "今日は5分だけ、気になっていることに手をつけてみなさい。",
  };

  const handleConsult = async (text: string) => {
    setStatus("loading");
    
    setTimeout(() => {
      setAnswer(fixedAnswer);
      setStatus("answered");
      
      setTimeout(() => {
        const answerElement = document.getElementById("answer-area");
        answerElement?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1500);
  };

  const handleReset = () => {
    setStatus("initial");
    setAnswer(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#1a100d] relative overflow-x-hidden pb-12">
      <div ref={topRef} />
      
      {/* 1. タイトル & 2. サブコピー */}
      <header className="w-full pt-20 pb-10 text-center z-10">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-[0.25em] text-[var(--color-bar-ivory)] mb-4 px-4 drop-shadow-2xl">
          脳内オカマバー
        </h1>
        <div className="flex items-center justify-center gap-4 px-6">
          <div className="w-8 h-[0.5px] bg-[var(--color-bar-gold)] opacity-20" />
          <p className="text-xs sm:text-sm tracking-[0.1em] text-[var(--color-bar-beige)] font-serif font-medium">
            悩んだら、ママに聞きなさい。
          </p>
          <div className="w-8 h-[0.5px] bg-[var(--color-bar-gold)] opacity-20" />
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col items-center z-10">
        {/* 3. メインビジュアル & 4. ママのセリフ */}
        <MamaCharacter 
          message={status === "answered" ? "少しは心が軽くなったかしら？" : "で、今日はどうしたの？"} 
        />

        {/* 5, 6. 相談フォーム & ボタン */}
        {status !== "answered" && (
          <div className="w-full pb-16 mt-0">
            <ConsultationForm 
              onSubmit={handleConsult} 
              isLoading={status === "loading"} 
            />
          </div>
        )}

        {/* 7. 回答表示 */}
        {status === "answered" && answer && (
          <div id="answer-area" className="w-full">
            <MamaAnswer 
              answer={answer} 
              onReset={handleReset} 
            />
          </div>
        )}
      </main>

      {/* 装飾的フッター */}
      <footer className="w-full py-16 flex flex-col items-center opacity-10 border-t border-zinc-900/20 mt-10">
        <span className="text-[9px] tracking-[1em] text-[var(--color-bar-gold)] uppercase mb-2 font-sans">Nounai Okama Bar</span>
        <span className="text-[7px] tracking-[0.3em] text-zinc-500 font-sans">EST. 2026</span>
      </footer>
    </div>
  );
}
