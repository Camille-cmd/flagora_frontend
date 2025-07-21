import type React from "react"
import {useEffect, useRef, useState} from "react"
import Input from "./Input.tsx"
import {Country} from "../../interfaces/country.tsx";
import {City} from "../../interfaces/city.tsx";

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    placeholder?: string
    className?: string
    options: Country[] | City[]
}

export default function SearchBar({value, onChange, onSubmit, placeholder, className = "", options}: SearchBarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState<Country[] | City[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
    const maxDisplayOptions: number = 5

    useEffect(() => {
        if (!Array.isArray(options) || options.length === 0) return;

        // Filter depending on what the user types
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === "") {
            setFilteredOptions(options.slice(0, maxDisplayOptions));
        } else {
            // Helper function to split the name into words
            const splitWords = (text: string): string[] => {
                return text.toLowerCase().split(/[\s\-_/]+/); // support for space, hyphen, underscore, slash
            };

            // First: match where any word starts with the input
            const wordStartsWithMatches = options.filter((option) =>
                splitWords(option.name).some((word) => word.startsWith(lowerValue))
            );

            // Then: match where input is included anywhere (but not already matched)
            const includesMatches = options.filter((option) =>
                !wordStartsWithMatches.includes(option) &&
                option.name.toLowerCase().includes(lowerValue)
            );

            const combined = [...wordStartsWithMatches, ...includesMatches].slice(0, maxDisplayOptions);

            setFilteredOptions(combined);
        }

        setHighlightedIndex(-1);
    }, [value, options]);


    useEffect(() => {
        // Close the dropdown when user clicks outside
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && dropdownRef.current) {
            const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement
            if (highlightedElement) {
                highlightedElement.scrollIntoView({block: "nearest"})
            }
        }
    }, [highlightedIndex])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        onChange(newValue)
        if (newValue.trim() !== "") {
            setIsOpen(true)
        }
    }

    const handleOptionSelect = (option: Country | City, fieldName: keyof Country | keyof City) => {
        // Get the value dynamically from the target fieldName and trigger OnChange
        const selectedValue = option[fieldName];
        onChange(selectedValue);
        setIsOpen(false)
        inputRef.current?.blur()
    }

    const handleInputFocus = () => {
        // Open dropdown on first user input
        if (value.trim() !== "") {
            setIsOpen(true)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) return

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
                break
            case "ArrowUp":
                e.preventDefault()
                setHighlightedIndex((prev) => Math.max(prev - 1, 0))
                break
            case "Enter":
                e.preventDefault()
                setIsOpen(false)
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    const selected = filteredOptions[highlightedIndex]
                    const fieldName = selected.iso2Code ? "iso2Code" : "name"
                    handleOptionSelect(selected, fieldName)
                    onSubmit()
                } else if (value.trim() !== "") {
                    onSubmit()
                }
                // keep focus on input
                value = "" // restore value
                inputRef.current?.focus()
                break
            case "Escape":
                setIsOpen(false)
                inputRef.current?.blur()
                break
        }
    }

    return (
        <div className="relative" ref={searchRef}>
            <div>
                <Input
                    ref={inputRef}
                    type="text"
                    value={value ?? ""}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-10 ${className}`}
                    autoComplete="off"
                />
            </div>

            {/* Dropdown positioned absolutely with higher z-index */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/5 pointer-events-none"
                     onClick={() => setIsOpen(false)}
                     aria-hidden="true"></div>
            )}

            {isOpen && filteredOptions.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 w-full z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto"
                >
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 cursor-pointer text-left text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                index === highlightedIndex
                                    ? "bg-blue-50 dark:bg-gray-700 text-yellow-700 dark:text-yellow-300"
                                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => handleOptionSelect(option, "name")}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}

            {isOpen && value.trim() !== "" && filteredOptions.length === 0 && (
                <div className="absolute z-50 w-full transform -translate-x-1/2 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl">
                    <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center text-sm">Aucun résultat trouvé</div>
                </div>
            )}
        </div>
    )
}
