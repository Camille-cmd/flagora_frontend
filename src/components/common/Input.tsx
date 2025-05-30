import {forwardRef, InputHTMLAttributes, JSX} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    icon?: JSX.Element;
    disabled?: boolean;
}

// forwardRef allows refs to be passed down to the actual <input>
const Input = forwardRef<HTMLInputElement, InputProps>(
    ({className = "", icon, disabled = false, ...args}, ref): JSX.Element => {
        const baseStyles = `${className} p-2 box-border border-2`;
        const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
        const focusStyles = !disabled
            ? "focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:focus:ring-yellow-900 dark:focus:border-yellow-500"
            : "";

        return (
            <div className="relative">
                <input
                    ref={ref}
                    className={`${baseStyles} border-gray-200 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary rounded-lg ${disabledStyles} ${focusStyles} outline-none transition-all`}
                    disabled={disabled}
                    {...args}
                />
                {icon && (
                    <div className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
