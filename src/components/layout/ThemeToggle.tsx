import {useEffect, useState} from "react"
import {Moon, Sun} from "lucide-react"
import Button from "../common/Button.tsx";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // Check for system preference or stored preference
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const storedTheme = localStorage.getItem("theme")

        if (storedTheme === "dark" || (!storedTheme && darkModeMediaQuery.matches)) {
            setIsDark(true)
            document.documentElement.classList.add("dark")
        } else {
            setIsDark(false)
            document.documentElement.classList.remove("dark")
        }

        // Listen for changes in system preference
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                setIsDark(e.matches)
                document.documentElement.classList.toggle("dark", e.matches)
            }
        }

        darkModeMediaQuery.addEventListener("change", handleChange)

        return () => {
            darkModeMediaQuery.removeEventListener("change", handleChange)
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme)
        document.documentElement.classList.toggle("dark", newTheme)
        localStorage.setItem("theme", newTheme ? "dark" : "light")
    }

    return (
        <>
        <Button
            type="button"
            buttonType="secondary"
            className="p-2 rounded-full duration-300 border-none shadow-none focus:outline-none hover:shadow-none"
            text={isDark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
            onClick={toggleTheme}
            aria-label={"Toggle theme"}
        />
            </>
    )
}
