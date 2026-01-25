import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        console.log('API Key Status:', apiKey ? `Present (starts with ${apiKey.substring(0, 4)}...)` : 'Missing');

        if (!apiKey) {
            return NextResponse.json({ error: 'ElevenLabs API key not configured on server' }, { status: 500 });
        }

        // Using the "Adam" voice (pre-made popular voice)
        // Voice ID: pNInz6obpgDQGcFmaJgB
        const voiceId = 'pNInz6obpgDQGcFmaJgB';

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('ElevenLabs API Error:', JSON.stringify(errorData, null, 2));
            return NextResponse.json({ error: errorData.detail?.message || 'ElevenLabs API Error', details: errorData }, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('TTS Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
