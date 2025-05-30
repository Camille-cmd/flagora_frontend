import {ButtonHTMLAttributes, ReactNode, forwardRef} from "react";

type ButtonType = "primary" | "secondary" | "info" | "raspberry" | "custom" | "link";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    buttonType: ButtonType;
    text?: string | ReactNode;
    size?: ButtonSize;
    loading?: boolean;
    className?: string;
}

const buttonStyles = {
    primary: "text-secondary bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-900 ",
    secondary: "text-secondary dark:text-primary bg-primary dark:bg-secondary",
    info: "text-primary bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800",
    raspberry: "text-primary bg-raspberry-600 hover:bg-raspberry-700 focus:ring-4 focus:ring-raspberry-200 dark:focus:ring-raspberry-800",
    custom: "",
    link: "text-primary bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-600",
};

const buttonSizes = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            buttonType = "primary",
            text = "",
            size = "medium",
            disabled = false,
            loading = false,
            children,
            className = "",
            ...options
        },
        ref
    ) => {
        const baseStyles = `shadow-none hover:shadow-lg flex items-center justify-center space-x-2 rounded-lg focus:outline-none border-0 transition-colors ${buttonSizes[size]} ${buttonStyles[buttonType]}`;
        const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
        const loadingStyles = loading ? "cursor-wait" : "";

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${disabledStyles} ${loadingStyles} ${className}`}
                disabled={disabled || loading}
                {...options}
            >
                {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                            />
                        </svg>
                    </div>
                ) : (
                    <>
                        {text && <span>{text}</span>}
                        {children}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = "Button"; // Necessary when using forwardRef
export default Button;
