'use client';

interface QuickPhrase {
    id: string;
    text: string;
    icon: string;
}

const DEFAULT_PHRASES: QuickPhrase[] = [
    { id: '1', text: 'Thank you', icon: '🙏' },
    { id: '2', text: 'Can you help me?', icon: '🤝' },
    { id: '3', text: 'I need assistance', icon: '💡' },
    { id: '4', text: 'Please wait', icon: '⏱️' },
    { id: '5', text: 'Yes', icon: '✅' },
    { id: '6', text: 'No', icon: '❌' },
    { id: '7', text: 'Hello', icon: '👋' },
    { id: '8', text: 'Goodbye', icon: '👋' },
];

interface QuickPhrasesProps {
    onPhraseSelect: (phrase: string) => void;
}

export default function QuickPhrases({ onPhraseSelect }: QuickPhrasesProps) {
    return (
        <div className="space-y-2">
            {DEFAULT_PHRASES.map((phrase, index) => (
                <button
                    key={phrase.id}
                    onClick={() => onPhraseSelect(phrase.text)}
                    className="
                        w-full flex items-center gap-3 p-3
                        bg-white/5 hover:bg-white/10
                        border border-white/5 hover:border-[var(--accent-gold)]/20
                        rounded-xl transition-all duration-400
                        group relative overflow-hidden
                    "
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-obsidian)] flex items-center justify-center text-base group-hover:scale-110 transition-transform duration-400">
                        {phrase.icon}
                    </div>

                    <span className="text-white font-medium text-sm flex-1 text-left tracking-tight">
                        {phrase.text}
                    </span>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </button>
            ))}
        </div>

    );
}
