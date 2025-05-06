import {ReactNode} from "react";

type ButtonType = "primary" | "secondary";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
    type: "button" | "submit" | "reset";
    buttonType: ButtonType
    text?: string | ReactNode
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    onClick?: () => void
    children?: ReactNode
    className?: string
    ariaLabel?: string
    options?: {
        [key: string]: string
    }
}

const buttonStyles = {
    primary: "text-secondary bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900 ",
    secondary: "bg-primary dark:bg-secondary text-secondary dark:text-primary",
};

const buttonSizes = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
};

export default function Button({
    type,
    buttonType = "primary",
    text = "",
    size = "medium",
    disabled = false,
    loading = false,
    onClick,
    children,
    className = "",
    ...options
}:ButtonProps) {
    const baseStyles = `shadow-md hover:shadow-lg flex items-center justify-center space-x-2 rounded-lg focus:outline-none border-0 transition-colors ${buttonSizes[size]} ${buttonStyles[buttonType]}`;
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
    const loadingStyles = loading ? "cursor-wait" : "";


    return (
        <button
            type={type}
            className={`${baseStyles} ${disabledStyles} ${loadingStyles} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
            {...options}
        >
            {text && <span>{text}</span>}
            {children && children}
        </button>
    );
};
