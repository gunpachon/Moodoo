/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./{app,components}/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-content": "var(--color-primary-content)",
        "base-100": "var(--color-base-100)",
        "base-200": "var(--color-base-200)",
        "base-content": "var(--color-base-content)",
      },
    },
  },
  plugins: [],
};
