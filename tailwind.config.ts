import { Jersey_10 } from "next/font/google";
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				jersey: ['var(--font-jersey-10)', 'sans-serif'],
				'keania-one': ['"Keania One"', 'sans-serif'],
				'sansation': ['"Sansation"', 'sans-serif'],
				'sansation-light': ['"Sansation"', 'sans-serif'],
				'konkhmer-sleokchher': ['var(--font-konkhmer-sleokchher)', 'sans-serif'],
				'jersy-20': ['var(--font-jersy-20)', 'sans-serif'],
				'jersy-10': ['var(--font-jersy-10)', 'sans-serif'],
				'russo-one': ['var(--font-russo-one)', 'sans-serif'],
				'montserrat': ['var(--font-montserrat)', 'sans-serif'],
				'inter': ['var(--font-inter)', 'sans-serif'],
				'playfair-display-sc': ['var(--font-playfair-display-sc)', 'sans-serif'],
				'play': ['var(--font-play)', 'sans-serif'],
				'phudu': ['var(--font-phudu)', 'sans-serif'],
				'protest-strike': ['var(--font-protest-strike)', 'sans-serif'],
				'prosto-one': ['var(--font-prosto-one)', 'sans-serif'],
				'poppins': ['var(--font-poppins)', 'sans-serif'],
				"audiowale": ['var(--font-audiowide)'],
				"spacemono": ['var(--font-spacemono)'],
				"orbitron": ['var(--font-orbitron)'],
				"space-grotesk": ['var(--font-space-grotesk)'],
				"rajdhani": ['var(--font-rajdhani)'],
				
			},
			animation: {
				marquee: 'marquee 6s linear infinite',
			},
			screens: {
				"xxl": "1640px",
				"xs": "360px",
				"xsm": "440px",
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' },
				}
			}
			,
			boxShadow: {
				'custom-glow': '0px 0px 26.55px 0px rgba(252, 210, 39, 0.56)',
			},
			colors: {

				chip: {
					DEFAULT: 'var(--chip-color)'
				},
				background: {
					DEFAULT: 'hsl(var(--background))',
					game: 'var(--background-game)',
					secondary: 'var(--secondary-background)',
					"last-winner": 'var(--last-winner-bg)'
				},
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					game: 'var(--primary-game)'
				},

				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					game: 'var(--secondary-game)'
				},
				"top-bar-text": "var(--top-bar-text)",
				tertiary: {
					DEFAULT: 'var(--tertiary)'
				},
				game: {
					DEFAULT: 'var(--game)',
					text: 'var(--game-text)',
					secondary: 'var(--game-text-secondary)'
				},
				'bet-button': {
					start: 'var(--bet-button-start)',
					mid: 'var(--bet-button-mid)',
					end: 'var(--bet-button-end)',
					border: 'var(--bet-button-border)',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					secondary: 'var(--accent-secondary)',
					"secondary-foreground": 'var(--accent-secondary-foreground)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: {
					DEFAULT: 'hsl(var(--input))',
					field: 'var(--input-field)',
					background: 'var(--input-field-background)',
				},
				ring: 'hsl(var(--ring))',
				platform: {
					border: 'var(--platform-border)',
					text: 'var(--platform-text)'
				},
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
