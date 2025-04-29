import { ThemeToggle } from "./ThemeToggle.tsx"
import { Link } from "react-router-dom"

interface HeaderProps {
  title?: string
  showBackButton?: boolean
}

export function Header({ title = "Flagora", showBackButton = false }: HeaderProps) {
  return (
    <header className="p-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between">
        {showBackButton ? (
          <Link
            to="/"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300"
          >
          </Link>
        ) : (
          <div className="w-5"></div>
        )}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white ml-2 transition-colors duration-300">
            {title}
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
