import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#19BFA5",
          50: "#E8FAF6",
          100: "#C5F2EA",
          200: "#8FE5D5",
          300: "#59D4C0",
          400: "#19BFA5",
          500: "#17A892",
          600: "#138F7C",
          700: "#0F7566",
          800: "#0B5C50",
          900: "#074339",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          50: "#1A1A1A",
          100: "#141414",
          200: "#111111",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
