/** @type {import('tailwindcss').Config} */
export default {
  flyonui: {
      themes: [
        {
          explivistheme: {
            "primary": "#0000ff",
            "primary-content": "#c6dbff",
            "secondary": "#00bb00",
            "secondary-content": "#000d00",
            "accent": "#003eff",
            "accent-content": "#cbdeff",
            "neutral": "#201a24",
            "neutral-content": "#cdccce",
            "base-100": "#fffeff",
            "base-200": "#FAFAFA",
            "base-300": "#bebdbe",
            "base-content": "#161616",
            "info": "#00b2ff",
            "info-content": "#000c16",
            "success": "#2ecc71",
            "success-content": "#010f04",
            "warning": "#ff9000",
            "warning-content": "#160700",
            "error": "#ff6575",
            "error-content": "#160305"
          }
        }
      ]
    },
  
  content: [
    "./index.html",       
    "./src/**/*.{js,ts}", 
    "./src/**/*.{jsx,tsx,vue,svelte}", 
    "./node_modules/flyonui/dist/js/*.js", 
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flyonui"),
    require("flyonui/plugin")
  ],
}

