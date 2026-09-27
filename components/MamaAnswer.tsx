import { MamaAnswerType } from "@/types";

interface MamaAnswerProps {
  answer: MamaAnswerType;
  onReset: () => void;
}

export default function MamaAnswer({ answer, onReset }: MamaAnswerProps) {
  return (
    <div className="w-full flex flex-col gap-12 px-6 mt-6 pb-24 animate-in fade-in duration-1000 max-w-md mx-auto">
      <div className="flex flex-col gap-12">
        {/* ママの一喝 - 最も際立たせるが品良く */}
        <div className="relative py-10 px-4 text-center">
          <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-[var(--color-bar-gold)]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[0.5px] bg-gradient-to-r from-transparent via-[var(--color-bar-gold)]/30 to-transparent" />
          
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.5em] text-[var(--color-bar-amber)]/80 uppercase font-sans">Mama's Shout</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif text-[var(--color-bar-ivory)] leading-relaxed italic drop-shadow-sm">
            「{answer.shout}」
          </p>
        </div>

        {/* ママのひと言 */}
        <div className="px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[0.5px] bg-zinc-700" />
            <span className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase font-sans">Mama's Words</span>
          </div>
          <p className="text-zinc-300 leading-relaxed text-base pl-6 border-l border-zinc-800/50 font-serif">
            {answer.hitokoto}
          </p>
        </div>

        {/* 今日の一歩 */}
        <div className="px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[0.5px] bg-zinc-700" />
            <span className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase font-sans">Today's Step</span>
          </div>
          <p className="text-zinc-300 leading-relaxed text-base pl-6 border-l border-zinc-800/50 font-serif">
            {answer.action}
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onReset}
          className="text-[10px] tracking-[0.5em] text-zinc-600 hover:text-[var(--color-bar-amber)] transition-colors cursor-pointer uppercase border-b border-transparent hover:border-[var(--color-bar-amber)]/20 pb-2 font-sans"
        >
          Talk to mama again
        </button>
      </div>
    </div>
  );
}
