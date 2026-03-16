/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563eb",
          bg: "#f3f4f6",
          surface: "#ffffff",
          success: "#22c55e",
          error: "#ef4444"
        }
      },
      boxShadow: {
        card: "0 16px 40px -24px rgba(15, 23, 42, 0.4)"
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
