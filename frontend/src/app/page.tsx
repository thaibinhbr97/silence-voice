'use client';

import CameraFeed from '@/components/CameraFeed';
import QuickPhrases from '@/components/QuickPhrases';
import TranscriptionDisplay from '@/components/TranscriptionDisplay';
import { useCallback, useState } from 'react';

export default function Home() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState(true);

    const playTTS = async (text: string) => {
        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('TTS API Error Details:', errorData);
                throw new Error(errorData.error || 'TTS request failed');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error('Error playing TTS:', error);
            // Fallback to browser TTS if API fails
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleVideoReady = useCallback(async (videoBlob: Blob) => {
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('video', videoBlob, 'recording.webm');

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/process-video`, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Failed to process video');
            }

            const data = await response.json();
            setTranscription(data.corrected_text);

            if (isAutoSpeakEnabled && data.corrected_text) {
                await playTTS(data.corrected_text);
            }
        } catch (error) {
            console.error('Error processing video:', error);
            setTranscription('Error: Unable to process video. Make sure the backend is running.');
        } finally {
            setIsProcessing(false);
        }
    }, [isAutoSpeakEnabled]);

    const handleSpeak = useCallback(() => {
        if (!transcription) return;
        playTTS(transcription);
    }, [transcription]);

    const handlePhraseSelect = useCallback((phrase: string) => {
        setTranscription(phrase);
        playTTS(phrase);
    }, []);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    return (
        <main className="min-h-screen p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[var(--accent-gold-muted)] flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-[var(--bg-obsidian)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold blue-text tracking-tight">
                            SilenceVoice
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm font-light">
                        Visual Speech Recognition • AI Vision
                    </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`}></div>
                        <span>Live</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-[var(--accent-gold)] animate-pulse' : 'bg-white/10'}`}></div>
                        <span>Processing</span>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
                {/* Left Column - Camera & Controls */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="solaris-card overflow-hidden relative aspect-video group shadow-2xl">
                        <CameraFeed isRecording={isRecording} onVideoReady={handleVideoReady} />

                        {/* Overlay Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                            <button
                                onClick={toggleRecording}
                                disabled={isProcessing}
                                className={`
                                    solaris-button-primary flex items-center gap-2 min-w-[180px] justify-center
                                    ${isRecording ? 'from-red-500 to-red-600 text-white' : ''}
                                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {isRecording ? (
                                    <>
                                        <div className="w-2 h-2 bg-white rounded-sm animate-pulse"></div>
                                        <span>End Session</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                        </svg>
                                        <span>Start Recognition</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Transcription Area */}
                    <div className="notepad-area min-h-[200px] flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xs font-bold opacity-30 uppercase tracking-[0.2em]">Transcription</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsAutoSpeakEnabled(!isAutoSpeakEnabled)}
                                    className={`
                                        flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
                                        ${isAutoSpeakEnabled
                                            ? 'bg-[var(--accent-gold)] text-[var(--bg-obsidian)] shadow-lg'
                                            : 'bg-[var(--bg-obsidian)]/5 text-[var(--text-secondary)] hover:bg-[var(--bg-obsidian)]/10'}
                                    `}
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                    <span>{isAutoSpeakEnabled ? 'Text-To-Speech On' : 'Text-To-Speech Off'}</span>
                                </button>
                                {transcription && (
                                    <button
                                        onClick={handleSpeak}
                                        className="w-8 h-8 rounded-full bg-[var(--bg-obsidian)]/10 text-[var(--bg-obsidian)] flex items-center justify-center hover:scale-110 transition-transform"
                                        title="Speak Text"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex-grow">
                            <TranscriptionDisplay
                                text={transcription}
                                isProcessing={isProcessing}
                                onSpeak={handleSpeak}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column - Quick Phrases */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="solaris-card p-6 flex flex-col flex-grow overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-[var(--accent-gold)] tracking-[0.2em] uppercase">Quick Phrases</h3>
                            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                            <QuickPhrases onPhraseSelect={handlePhraseSelect} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[var(--text-secondary)] text-[10px] font-medium tracking-wider uppercase">
                <div className="flex items-center gap-6">
                    <span>© 2026 SilenceVoice AI</span>
                    <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Privacy</a>
                    <a href="#" className="hover:text-[var(--accent-gold)] transition-colors">Terms</a>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>System Operational</span>
                </div>
            </footer>
        </main>
    );
}
