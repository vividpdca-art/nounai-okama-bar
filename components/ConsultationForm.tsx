"use client";

import { useState } from "react";

interface ConsultationFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function ConsultationForm({ onSubmit, isLoading }: ConsultationFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 px-6 max-w-[720px] mx-auto font-sans">
      <div className="flex flex-col gap-3">
        <label htmlFor="consultation" className="sr-only">今日モヤモヤしていることを書いてみなさい</label>
        <textarea
          id="consultation"
          rows={6}
          maxLength={500}
          className="w-full p-6 bg-[var(--color-bar-input)] border border-zinc-700/50 focus:border-[var(--color-bar-amber)]/60 focus:ring-1 focus:ring-[var(--color-bar-amber)]/20 focus:outline-none text-[var(--color-bar-ivory)] placeholder:text-zinc-300/80 transition-all resize-none text-base leading-relaxed rounded-sm shadow-inner font-sans font-medium"
          placeholder="今日モヤモヤしていることを書いてみなさい"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <div className="text-right text-[10px] text-zinc-500 tracking-[0.2em] font-sans">
          {text.length} / 500
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="w-full py-6 font-sans font-bold tracking-[0.5em] transition-all rounded-sm text-base uppercase shadow-lg
          disabled:bg-[#0f0908] disabled:border-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed
          enabled:bg-[#4a2e25] enabled:border-[var(--color-bar-amber)]/60 enabled:text-[var(--color-bar-ivory)] enabled:cursor-pointer enabled:hover:bg-[#5a3e35] enabled:hover:border-[var(--color-bar-amber)] enabled:active:scale-[0.98] enabled:shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-pulse text-zinc-400 text-sm">ママ、考え中…</span>
            </span>
          ) : (
            "ママに聞く"
          )}
        </button>
      </div>
    </form>
  );
}
