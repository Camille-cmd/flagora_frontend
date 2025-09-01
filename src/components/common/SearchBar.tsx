import type React from "react"
import {useEffect, useRef, useState} from "react"
import Input from "./Input.tsx"

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    placeholder?: string
    className?: string
    options: Object
}

interface AutoCompleteData {
    text: string
    value: string
}

export default function SearchBar(
    {
        value,
        onChange,
        onSubmit,
        placeholder,
        className = "",
        options,
    }: SearchBarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filteredOptions, setFilteredOptions] = useState<Array<string>>([])
    const [autoCompleteData, setAutoCompleteData] = useState<AutoCompleteData | null>(null)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
    const maxDisplayOptions: number = 15

    // helper to strip accents
    const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    useEffect(() => {
        let optionsArray = Object.keys(options)
        if (optionsArray.length === 0) {
            setAutoCompleteData(null)
            return;
        }

        // Filter depending on what the user types
        const lowerValue = normalize(value.toLowerCase().trim());

        if (lowerValue === "") {
            setFilteredOptions(optionsArray.slice(0, maxDisplayOptions));
            setAutoCompleteData(null)
            return
        }

        // Helper function to split the name into word
        const splitWords = (text: string): string[] =>
            normalize(text.toLowerCase()).split(/[\s\-_/]+/)

        // first match words strictly starting with the input
        const filtered = optionsArray
            .filter(option => normalize(option.toLowerCase()).startsWith(lowerValue))
            .slice(0, maxDisplayOptions)

        // Then: match where any word starts with the input (but not already matched)
        const wordStartsWithMatches = optionsArray.filter(option =>
            !filtered.includes(option) &&
            splitWords(option).some(word => word.startsWith(lowerValue))
        )

        // Then: match where input is included anywhere (but not already matched)
        const includesMatches = optionsArray.filter(option =>
            !filtered.includes(option) &&
            !wordStartsWithMatches.includes(option) &&
            normalize(option.toLowerCase()).includes(lowerValue)
        )

        const combined = [...filtered, ...wordStartsWithMatches, ...includesMatches].slice(0, maxDisplayOptions)

        setFilteredOptions(combined)

        // Autocomplete: find first result starting with input
        const firstMatch = combined.find(option =>
            normalize(option.toLowerCase()).startsWith(lowerValue)
        )

        if (firstMatch && lowerValue.length > 0) {
            // Get the remaining part of the first match after the typed text
            const matchedLength = value.length
            const matchedPart = firstMatch.slice(0, matchedLength)
            const remainingPart = firstMatch.slice(matchedLength)

            // Only show autocomplete if the case matches or we're doing case-insensitive matching
            if (normalize(matchedPart.toLowerCase()) === lowerValue) {
                setAutoCompleteData({text: value + remainingPart, value: firstMatch})
            } else {
                setAutoCompleteData(null)
            }
        } else {
            setAutoCompleteData(null)
        }

        setHighlightedIndex(-1)
    }, [value, options])

    useEffect(() => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        onChange(newValue)
        if (newValue.trim() !== "") {
            setIsOpen(true)
        }
    }

    const handleOptionSelect = (option: string) => {
        // Get the value dynamically from the target fieldName and trigger OnChange
        onChange(option);
        setIsOpen(false)
        setAutoCompleteData(null)
        inputRef.current?.blur()
    }

    const handleInputFocus = () => {
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
                    // Accept autocomplete and submit
                    onChange(autoCompleteData.value)
                    setAutoCompleteData(null)
                    onSubmit()
                } else if (value.trim() !== "") {
                    onSubmit()
                }
                inputRef.current?.focus({preventScroll: true})
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
                    spellCheck="false"
                    autoCorrect="off"
                />

                {/* Ghost text for autocomplete - positioned absolutely over the input */}
                {autoCompleteData?.value && autoCompleteData.value !== value && (
                    <div
                        className="absolute inset-0 flex items-center pl-5 pr-5 pointer-events-none"
                        style={{font: "inherit", fontSize: "15px", lineHeight: "inherit"}}
                    >
                        <div className="flex">
                            <span className="text-transparent select-none" style={{whiteSpace: "pre"}}>
                                {value}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 select-none" style={{whiteSpace: "pre"}}>
                                {autoCompleteData.text.slice(value.length)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Dropdown */}
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
                            {option}
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
