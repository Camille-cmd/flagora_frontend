import {ThemeToggle} from "./ThemeToggle.tsx"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useEffect, useRef, useState} from "react"
import {ChevronLeft, LogOut, Settings, User} from "lucide-react"
import Button from "../common/Button.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";
import LanguageDropdown from "./LanguageDropdown.tsx";

export function Header() {
    const [showBackButton, setShowBackButton] = useState<boolean>(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const location = useLocation()
    const {user, logout, isAuthenticated} = useAuth()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setShowBackButton(location.pathname !== "/")
    }, [location])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        logout().then(() => {
            // Close dropdown and redirect to home
            setIsDropdownOpen(false)
            navigate("/")
        })


    }

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

                    <LanguageDropdown />

                    {/* User account dropdown */}
                    {isAuthenticated && (
                        <div className="relative" ref={dropdownRef}>
                            <Button
                                type="button"
                                buttonType="secondary"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 rounded-full flex items-center justify-center focus:outline-none hover:shadow-none duration-300"
                                aria-label="User menu"
                            >
                                <User size={20}/>
                            </Button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-50 dark:bg-darkblue-700 ring-1 ring-black ring-opacity-5 z-50">

                                    <div role="menu" aria-orientation="vertical" aria-labelledby="user-menu">

                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {user?.username}
                                            </p>
                                        </div>

                                        <Link
                                            to="/account"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-darkblue-600 transition-colors"
                                            role="menuitem"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <Settings size={16} className="mr-2 text-gray-500 dark:text-gray-400"/>
                                            Mon compte
                                        </Link>


                                        <Button
                                            type={"button"}
                                            buttonType={"raspberry"}
                                            size={"small"}
                                            className="w-full rounded-none"
                                            onClick={() => {
                                                setIsDropdownOpen(false)
                                                handleLogout()
                                            }}
                                            aria-label={"Logout"}
                                            >
                                              <LogOut size={16} className="mr-2"/>
                                            Déconnexion
                                        </Button>

                                    </div>

                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
