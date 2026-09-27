import Image from "next/image";

interface MamaCharacterProps {
  message: string;
}

export default function MamaCharacter({ message }: MamaCharacterProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. メインビジュアル: 画像全体を表示し、PCでは最大幅を制限 */}
      <div className="w-full max-w-[1000px] mx-auto border-y border-zinc-900/50 bg-zinc-950 relative">
        <Image 
          src="/images/mama-bar.png" 
          alt="静かなバーのママと相談者" 
          width={1536} 
          height={864}
          className="w-full h-auto object-contain block"
          priority
        />
        {/* 照明の温かみを強調する薄いオーバーレイ（画像の上に重ねる） */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a100d] via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* 2. ママのセリフ: 画像直下の感情的な「声」 */}
      <div className="w-full max-w-[1000px] px-6 pt-4 pb-2 flex justify-center">
        <div className="relative">
          {/* 静かな語りかけを演出する意匠 */}
          <div className="absolute -left-6 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-bar-gold)]/30 to-transparent" />
          
          <div className="pl-6 py-1">
            <p className="text-2xl sm:text-[1.75rem] tracking-[0.02em] text-white italic leading-relaxed font-serif drop-shadow-sm whitespace-nowrap">
              「{message}」
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
