'use client';

interface TranscriptionDisplayProps {
    text: string;
    isProcessing: boolean;
    onSpeak: () => void;
}

export default function TranscriptionDisplay({
    text,
    isProcessing,
    onSpeak
}: TranscriptionDisplayProps) {
    return (
        <div className="h-full flex flex-col">
            {isProcessing ? (
                <div className="flex-grow flex flex-col items-center justify-center space-y-4 animate-pulse">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-2 border-[var(--bg-obsidian)]/10"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent-gold)] animate-spin"></div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold tracking-widest uppercase opacity-40">Analyzing Speech</p>
                    </div>
                </div>
            ) : text ? (
                <div className="flex-grow space-y-4">
                    <p className="text-xl md:text-2xl font-serif leading-relaxed text-[var(--bg-obsidian)]">
                        "{text}"
                    </p>

                    <div className="flex items-center gap-2 pt-4 border-t border-[var(--bg-obsidian)]/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600/60"></div>
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
                            Verified
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 opacity-10">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <div>
                        <p className="text-xs font-bold tracking-widest uppercase">System Ready</p>
                    </div>
                </div>
            )}

        </div>
    );
}
