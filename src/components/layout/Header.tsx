import {ThemeToggle} from "./ThemeToggle.tsx"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useEffect, useRef, useState} from "react"
import {ChartColumnStacked, ChevronLeft, LogOut, Settings, User} from "lucide-react"
import Button from "../common/Button.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";
import LanguageDropdown from "./LanguageDropdown.tsx";
import {useTranslation} from "react-i18next";
import FlagoraIcon from '../../assets/flagora_logo.svg';
import FlagoraIconWhite from '../../assets/flagora_logo_white.svg';

export function Header() {
    const {t} = useTranslation();
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
            <div className="container mx-auto grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-2 md:gap-0">
                {/* Left side - Back button or spacer */}
                <div className="flex items-center justify-start">
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
                </div>

                {/* Center - Logo and title */}
                <div className="flex items-center justify-center">
                    <Link to="/" className="text-slate-800 dark:text-white no-underline transition-colors duration-300">
                        <h1 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Flagora</h1>
                    </Link>
                    <img src={FlagoraIcon} alt="Flagora" className="ml-2 w-7 h-7 sm:w-9 sm:h-9 dark:hidden"/>
                    <img src={FlagoraIconWhite} alt="Flagora" className="ml-2 w-7 h-7 sm:w-9 sm:h-9 hidden dark:block"/>
                </div>

                {/* Right side - Controls */}
                <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                    <ThemeToggle/>

                    <LanguageDropdown/>

                    {/* User account dropdown */}
                    {isAuthenticated && (
                        <div className="relative" ref={dropdownRef}>
                            <Button
                                type="button"
                                buttonType="secondary"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 rounded-full flex items-center justify-center focus:outline-none hover:shadow-none duration-300"
                                aria-label={t("header.userMenu.dropdown.ariaLabel")}
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
                                            to="/stats"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-darkblue-600 transition-colors"
                                            role="menuitem"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <ChartColumnStacked size={16}
                                                                className="mr-2 text-gray-500 dark:text-gray-400"/>
                                            <span>{t("header.userStats.myStats")}</span>
                                        </Link>

                                        <Link
                                            to="/account"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-darkblue-600 transition-colors"
                                            role="menuitem"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <Settings size={16} className="mr-2 text-gray-500 dark:text-gray-400"/>
                                            <span>{t("header.userMenu.myAccount")}</span>
                                            {!user?.isEmailVerified && (
                                                <span className="relative group cursor-default ml-2">
                                                    <span
                                                        className="text-yellow-500"
                                                        aria-label={t("header.userMenu.EmailNotVerifiedAriaLabel")}
                                                    >
                                                       ⚠️
                                                    </span>
                                                </span>
                                            )}
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
                                            aria-label={t("header.userMenu.logout.ariaLabel")}
                                        >
                                            <LogOut size={16} className="mr-2"/>
                                            {t("header.userMenu.logout.text")}
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
