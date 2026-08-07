import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        approved: "#16a34a", // green — matches the public site's "Approved" badge / photo border
      },
    },
  },
  plugins: [],
} satisfies Config;
