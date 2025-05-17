/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./{app,components}/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-soft": "var(--color-primary-soft)",
        "primary-content": "var(--color-primary-content)",
        secondary: "var(--color-secondary)",
        "secondary-content": "var(--color-secondary-content)",
        "base-100": "var(--color-base-100)",
        "base-200": "var(--color-base-200)",
        "base-content-soft": "var(--color-base-content-soft)",
        "base-content": "var(--color-base-content)",
      },
    },
  },
  plugins: [],
};
