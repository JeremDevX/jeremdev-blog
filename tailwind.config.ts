import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "425px",
      xxs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1200px",
      "2xl": "1536px",
    },
    extend: {
      flex: {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
      },
      scale: {
        "101": "1.01",
      },
      dropShadow: {
        light: "0 0px 15px rgba(62, 112, 138,0.15)",
        lighter: "0 0px 15px rgba(62, 112, 138,0.5)",
      },
      maxWidth: {
        "1440": "1440px",
        "1000": "1000px",
      },
      minHeight: {
        "650": "650px",
      },
      maxHeight: {
        "650": "650px",
      },
      width: { logo: "calc(var(--sidebar-size) - 64px)", "66": "16.5rem" },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          darker: "hsl(var(--accent-darker))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        react: "hsl(0, 100%, 50%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    backgroundImage: {
      gradient: "var(--gradient)",
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-animated")],
};
export default config;
