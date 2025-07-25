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
    // Field to send to the backend for answer check (iso2 for Countries e.g.)
    answerFieldName: keyof Country | keyof City
}

interface AutoCompleteData {
    text: string
    value: string
}

export default function SearchBar({
                                      value,
                                      onChange,
                                      onSubmit,
                                      placeholder,
                                      className = "",
                                      options,
                                      answerFieldName
                                  }: SearchBarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState<Country[] | City[]>([])
    // Text is the text to display, value is the value to send to the backend for answer check
    const [autoCompleteData, setAutoCompleteData] = useState<AutoCompleteData | null>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
    const maxDisplayOptions: number = 5

    useEffect(() => {
        if (!Array.isArray(options) || options.length === 0) {
            setAutoCompleteData(null)
            return;
        }

        // Filter depending on what the user types
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === "") {
            setFilteredOptions(options.slice(0, maxDisplayOptions));
            setAutoCompleteData(null)
        } else {
            // Helper function to split the name into words
            const splitWords = (text: string): string[] => {
                return text.toLowerCase().split(/[\s\-_/]+/); // support for space, hyphen, underscore, slash
            };

            // first match words strictly starting with the input
            const filtered = options
                .filter((option) => option.name.toLowerCase().startsWith(value.toLowerCase()))
                .slice(0, maxDisplayOptions)

            // Then: match where any word starts with the input (but not already matched)
            const wordStartsWithMatches = options.filter((option) =>
                !filtered.includes(option) &&
                splitWords(option.name).some((word) => word.startsWith(lowerValue))
            );

            // Then: match where input is included anywhere (but not already matched)
            const includesMatches = options.filter((option) =>
                !wordStartsWithMatches.includes(option) && !filtered.includes(option) &&
                option.name.toLowerCase().includes(lowerValue)
            );

            const combined = [...filtered, ...wordStartsWithMatches, ...includesMatches].slice(0, maxDisplayOptions);

            setFilteredOptions(combined);

            // Set autocomplete text from first result that starts with the input
            const firstMatch = combined.find(option =>
                option.name.toLowerCase().startsWith(lowerValue)
            );

            if (firstMatch && lowerValue.length > 0) {
                // Get the remaining part of the first match after the typed text
                const matchedPart = firstMatch.name.slice(0, value.length);
                const remainingPart = firstMatch.name.slice(value.length);

                // Only show autocomplete if the case matches or we're doing case-insensitive matching
                if (matchedPart.toLowerCase() === value.toLowerCase()) {
                    setAutoCompleteData({text: value + remainingPart, value: firstMatch[answerFieldName]})
                } else {
                    setAutoCompleteData(null)
                }
            } else {
                setAutoCompleteData(null)
            }
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

    const handleOptionSelect = (option: Country | City) => {
        // Get the value dynamically from the target fieldName and trigger OnChange
        const selectedValue = option[answerFieldName];
        onChange(selectedValue);
        setIsOpen(false)
        setAutoCompleteData(null)
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
            case "Tab":
            case "ArrowRight":
                // Accept autocomplete suggestion
                if (autoCompleteData?.value && autoCompleteData.value !== value) {
                    e.preventDefault()
                    onChange(autoCompleteData.value)
                    setAutoCompleteData(null)
                }
                break
            case "Enter":
                e.preventDefault()
                setIsOpen(false)
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    const selected = filteredOptions[highlightedIndex]
                    handleOptionSelect(selected)
                    onSubmit()
                } else if (autoCompleteData?.value && autoCompleteData.value !== value) {
                    console.log("Accept autocomplete")
                    console.log(autoCompleteData)
                    // Accept autocomplete and submit
                    onChange(autoCompleteData.value)
                    setAutoCompleteData(null)
                    onSubmit()
                } else if (value.trim() !== "") {
                    onSubmit()
                }
                // keep focus on input
                inputRef.current?.focus()
                break
            case "Escape":
                setIsOpen(false)
                setAutoCompleteData(null)
                inputRef.current?.blur()
                break
        }
    }

    return (
        <div className="relative" ref={searchRef}>
            <div className="relative">
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

                {/* Ghost text for autocomplete - positioned absolutely over the input */}
                {autoCompleteData?.value && autoCompleteData.value !== value && (
                    <div
                        className="absolute inset-0 flex items-center pl-5 pr-5 pointer-events-none"
                        style={{
                            font: 'inherit',
                            fontSize: "15px",
                            fontFamily: 'inherit',
                            lineHeight: 'inherit'
                        }}
                    >
                        <div className="flex">
                            <span className="text-transparent select-none" style={{whiteSpace: 'pre'}}>
                                {value}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 select-none" style={{whiteSpace: 'pre'}}>
                                {autoCompleteData.text.slice(value.length)}
                            </span>
                        </div>
                    </div>
                )}
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
                            onClick={() => handleOptionSelect(option)}
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
