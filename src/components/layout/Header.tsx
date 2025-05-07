import {ThemeToggle} from "./ThemeToggle.tsx"
import {Link, useLocation} from "react-router-dom"
import {useEffect, useState} from "react";
import {ChevronLeft, User} from "lucide-react";


export function Header() {
    const [showBackButton, setShowBackButton] = useState<boolean>(false)
    const location = useLocation()

    useEffect(() => {
        setShowBackButton(location.pathname !== "/")
    }, [location]);

    return (
        <header className="p-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="container mx-auto flex items-center justify-between">
                {showBackButton ? (
                    <Link
                        to="/"
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300"
                    >
                        <ChevronLeft size={20}/>
                    </Link>
                ) : (
                    <div className="w-5"></div>
                )}
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white ml-2 transition-colors duration-300">
                        Flagora
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <ThemeToggle/>
                    {/* User account */}
                    <Link
                        to="/account"
                        className="bg-primary dark:bg-secondary text-secondary dark:text-primary transition-colors duration-300"
                    >
                        <User size={20}/>
                    </Link>
                </div>
            </div>
        </header>
    )
}
