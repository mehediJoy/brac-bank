const preset = require("../../tailwind.preset.cjs");

module.exports = {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui-library/src/**/*.{ts,tsx}"
  ]
};
