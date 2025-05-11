import {ButtonHTMLAttributes, JSX, ReactNode} from "react";

type ButtonType = "primary" | "secondary" | "info" | "raspberry" | "custom" | "link";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps  extends  ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType: ButtonType
    text?: string | ReactNode
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    children?: ReactNode
    className?: string
}

const buttonStyles = {
    primary: "text-secondary bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900 ",
    secondary: "text-secondary dark:text-primary bg-primary dark:bg-secondary",
    info : "text-primary bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800",
    raspberry: "text-primary bg-raspberry-600 hover:bg-raspberry-700 focus:ring-4 focus:ring-raspberry-200 dark:focus:ring-raspberry-800",
    custom : "",
    link : "text-primary bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600",
};

const buttonSizes = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
};

export default function Button({
    buttonType = "primary",
    text = "",
    size = "medium",
    disabled = false,
    loading = false,
    children,
    className = "",
    ...options
}:ButtonProps): JSX.Element {
    const baseStyles = `shadow-none hover:shadow-lg flex items-center justify-center space-x-2 rounded-lg focus:outline-none border-0 transition-colors ${buttonSizes[size]} ${buttonStyles[buttonType]}`;
    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
    const loadingStyles = loading ? "cursor-wait" : "";


    return (
        <button
            className={`${baseStyles} ${disabledStyles} ${loadingStyles} ${className}`}
            disabled={disabled || loading}
            {...options}
        >
            {text && <span>{text}</span>}
            {children && children}
        </button>
    );
};
