'use client';

import { useEffect, useRef, useState } from 'react';

interface CameraFeedProps {
    isRecording: boolean;
    onVideoReady?: (blob: Blob) => void;
}

export default function CameraFeed({ isRecording, onVideoReady }: CameraFeedProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user',
                    },
                });

                setStream(mediaStream);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error('Camera error:', err);
                setError('Unable to access camera. Please grant camera permissions.');
            }
        };

        initCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (!stream) return;

        if (isRecording) {
            chunksRef.current = [];

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8',
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                if (onVideoReady) {
                    onVideoReady(blob);
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
        } else {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        }
    }, [isRecording, stream, onVideoReady]);

    if (error) {
        return (
            <div className="solaris-card p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-red-400 font-semibold text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-black">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
            />



            {/* Status Overlays */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">
                        {isRecording ? 'Recording' : 'Ready'}
                    </span>
                </div>
            </div>


            {/* Recording Animation */}
            {isRecording && (
                <div className="absolute inset-0 pointer-events-none border-[12px] border-red-500/20 animate-pulse"></div>
            )}
        </div>
    );
}

