import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#00f0ff",
                secondary: "#a855f7",
                accent: "#ec4899",
            },
            fontFamily: {
                sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'gradient-shift': 'gradientShift 3s ease infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(0, 240, 255, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)',
                    },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
