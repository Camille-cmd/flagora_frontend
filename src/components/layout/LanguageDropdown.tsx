import {useEffect, useRef, useState} from "react";
import Button from "../common/Button";
import i18n from "../../i18n/i18n.tsx";
import {Languages} from "../../interfaces/languages.tsx";
import UserService from "../../services/UserService.tsx";
import AuthService from "../../services/auth/AuthService.tsx";


/**
 * List of languages supported by the application
 */
const languages: Languages = {
    en: {nativeName: 'English', flag: '🇬🇧'},
    fr: {nativeName: 'Français', flag: '🇫🇷'}
};

/**
 * Get the flag emoji flag for a given language
 * @param language
 */
const getLanguageFlag = (language: string | undefined) => {
    if (language && language.length >= 2) {
        language = language.toLowerCase().slice(0, 2)
    }
    return languages[language ? language : "en"].flag
}


/**
 * LanguageDropdown component
 * @constructor
 *
 * Renders a dropdown menu for selecting the language of the application.
 */
export default function LanguageDropdown() {
    const [currentLanguage, setCurrentLanguage] = useState<string>(getLanguageFlag(i18n.resolvedLanguage))
    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);


    /*
        * Handle the language change when a new language is selected
        * @param lang - The language code (e.g. "en", "fr")
        * @returns {Promise<void>}
        *
        * Changes the language of the application using i18n and updates the language via the api
     */
    const switchLanguage = (lang: string) => {
        if (AuthService.isAuthenticated) {
            // If the user is authenticated, update the language in the database and the client
            UserService.setLanguage(lang).then(_ => {
                i18n.changeLanguage(lang)
                    .catch((error) => {
                        console.error("Error changing language:", error);
                    });
            })
        } else {
            // Update the language in the client only
            i18n.changeLanguage(lang)
                .catch((error) => {
                    console.error("Error changing language:", error);
                });
        }
    };

    useEffect(() => {
        // Close the dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update current flag if i18n.language changes
    useEffect(() => {
        const updateFlag = () => setCurrentLanguage(getLanguageFlag(i18n.resolvedLanguage));
        i18n.on("languageChanged", updateFlag);
        return () => {
            i18n.off("languageChanged", updateFlag);
        };
    }, []);


    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                type="button"
                buttonType="secondary"
                className="p-2 rounded-full flex items-center justify-center focus:outline-none hover:shadow-none duration-300"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Language switcher"
            >
                {currentLanguage}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-50 dark:bg-darkblue-700 ring-1 ring-black ring-opacity-5 z-50">
                    <div role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                        {Object.entries(languages).map(([language_name, language_values]) => (
                            <Button
                                type={"button"}
                                buttonType={"custom"}
                                className={"w-full rounded-none text-primary bg-gray-50 dark:bg-darkblue-700 items-center justify-center focus:outline-none hover:shadow-none duration-300"}
                                key={language_name}
                                onClick={() => switchLanguage(language_name)}>
                                {language_values.nativeName} {language_values.flag}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
