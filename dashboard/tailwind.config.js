/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./src/**/*.{html,jsx,tsx,vue,js,ts}"],
	theme: {
	  extend: {
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)'
		},
		animation: {
		  'blob': "blob 7s infinite",
		  'slide-up': 'slide-up 0.5s ease-out',
		  'slide-down': 'slide-down 0.5s ease-out',
		  'slide-left': 'slide-left 0.5s ease-out',
		  'slide-right': 'slide-right 0.5s ease-out',
		  'fade-in': 'fade-in 0.5s ease-out',
		  'slide-in': 'slide-in 0.2s ease-out',
		  'scale-in': 'scale-in 0.5s ease-out',
		  'bounce-in': 'bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
		  'float': 'float 6s ease-in-out infinite',
		  'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
		  'gradient': 'gradient 8s linear infinite',
		  'blur-in': 'blur-in 0.5s ease-out',
		},
		keyframes: {
		  'blob': {
			"0%": {
			  transform: "translate(0px, 0px) scale(1)",
			},
			"33%": {
			  transform: "translate(30px, -50px) scale(1.1)",
			},
			"66%": {
			  transform: "translate(-20px, 20px) scale(0.9)",
			},
			"100%": {
			  transform: "translate(0px, 0px) scale(1)",
			},
		  },
		  'slide-up': {
			'0%': { transform: 'translateY(20px)', opacity: '0' },
			'100%': { transform: 'translateY(0)', opacity: '1' },
		  },
		  'slide-down': {
			'0%': { transform: 'translateY(-20px)', opacity: '0' },
			'100%': { transform: 'translateY(0)', opacity: '1' },
		  },
		  'slide-left': {
			'0%': { transform: 'translateX(20px)', opacity: '0' },
			'100%': { transform: 'translateX(0)', opacity: '1' },
		  },
		  'slide-right': {
			'0%': { transform: 'translateX(-20px)', opacity: '0' },
			'100%': { transform: 'translateX(0)', opacity: '1' },
		  },
		  'slide-in': {
			'0%': { transform: 'scaleX(0)' },
			'100%': { transform: 'scaleX(1)' },
		  },
		  'scale-in': {
			'0%': { transform: 'scale(0.95)', opacity: '0' },
			'100%': { transform: 'scale(1)', opacity: '1' },
		  },
		  'fade-in': {
			'0%': { opacity: '0' },
			'100%': { opacity: '1' },
		  },
		  'bounce-in': {
			'0%': { transform: 'scale(0.3)', opacity: '0' },
			'50%': { transform: 'scale(1.05)' },
			'70%': { transform: 'scale(0.9)' },
			'100%': { transform: 'scale(1)', opacity: '1' },
		  },
		  'float': {
			'0%, 100%': { transform: 'translateY(0)' },
			'50%': { transform: 'translateY(-20px)' },
		  },
		  'gradient': {
			'0%': { backgroundPosition: '0% 50%' },
			'50%': { backgroundPosition: '100% 50%' },
			'100%': { backgroundPosition: '0% 50%' },
		  },
		  'blur-in': {
			'0%': { filter: 'blur(12px)', opacity: '0' },
			'100%': { filter: 'blur(0)', opacity: '1' },
		  },
		},
		backgroundSize: {
		  'gradient-300': '300% 300%',
		},
		colors: {
		  background: 'hsl(var(--background))',
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
			foreground: 'hsl(var(--primary-foreground))'
		  },
		  secondary: {
			DEFAULT: 'hsl(var(--secondary))',
			foreground: 'hsl(var(--secondary-foreground))'
		  },
		  muted: {
			DEFAULT: 'hsl(var(--muted))',
			foreground: 'hsl(var(--muted-foreground))'
		  },
		  accent: {
			DEFAULT: 'hsl(var(--accent))',
			foreground: 'hsl(var(--accent-foreground))'
		  },
		  destructive: {
			DEFAULT: 'hsl(var(--destructive))',
			foreground: 'hsl(var(--destructive-foreground))'
		  },
		  border: 'hsl(var(--border))',
		  input: 'hsl(var(--input))',
		  ring: 'hsl(var(--ring))',
		  chart: {
			'1': 'hsl(var(--chart-1))',
			'2': 'hsl(var(--chart-2))',
			'3': 'hsl(var(--chart-3))',
			'4': 'hsl(var(--chart-4))',
			'5': 'hsl(var(--chart-5))'
		  }
		}
	  }
	},
	plugins: [require("tailwindcss-animate")],
  }