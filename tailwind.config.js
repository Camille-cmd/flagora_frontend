/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class", // Enable dark mode via class strategy
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#F5F5F5",
                secondary: "#1E293B",
                raspberry: {
                    200: "#FEE2E2",
                    300: "#FCA5A1",
                    400: "#F87171",
                    600: "#A43D62",
                    700: "#8B2F50",
                    800: "#7B1E3D"
                },
                darkblue: {
                    600: "#1E293B",
                    700: "#111827"
                },
                whitelight: {
                    600: "#F5F5F5",
                    700: "#E5E7EB"
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                rubik: ['Rubik', 'sans-serif'],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
