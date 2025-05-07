import {AlertCircle, AlertTriangle, CheckCircle, Info, X} from "lucide-react"
import {JSX, useEffect} from "react";

type AlertType = "success" | "error" | "warning" | "info"

interface AlertProps {
    type: AlertType
    title: string
    message: string | JSX.Element
    dismissible?: boolean
    onDismiss?: () => void
    className?: string
    timeout?: number // Timeout in seconds
}

const alertStyles = {
    success: {
        container: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        icon: "text-green-500 dark:text-green-400",
        title: "text-green-800 dark:text-green-300",
        message: "text-green-700 dark:text-green-300/80",
        accent: "bg-green-500",
        closeButton: "hover:bg-green-200 dark:hover:bg-green-800/30 text-green-900 dark:text-green-400 bg-green-100 dark:bg-green-700",
        mainColor: "green",
    },
    error: {
        container: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        icon: "text-red-500 dark:text-red-400",
        title: "text-red-800 dark:text-red-300",
        message: "text-red-700 dark:text-red-300/80",
        accent: "bg-red-500",
        closeButton: "hover:bg-red-200 dark:hover:bg-red-800/30 text-red-900 dark:text-red-400 bg-red-100 dark:bg-red-700",
        mainColor: "red",
    },
    warning: {
        container: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        icon: "text-yellow-500 dark:text-yellow-400",
        title: "text-yellow-800 dark:text-yellow-300",
        message: "text-yellow-700 dark:text-yellow-300/80",
        accent: "bg-yellow-500",
        closeButton: "hover:bg-yellow-200 dark:hover:bg-yellow-800/30 text-yellow-900 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-700",
        mainColor: "yellow",
    },
    info: {
        container: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
        icon: "text-blue-500 dark:text-blue-400",
        title: "text-blue-800 dark:text-blue-300",
        message: "text-blue-700 dark:text-blue-300/80",
        accent: "bg-blue-500",
        closeButton: "hover:bg-blue-200 dark:hover:bg-blue-800/30 text-blue-900 dark:text-blue-400 bg-blue-100 dark:bg-blue-700",
        mainColor: "blue",
    },
}

const alertIcons = {
    success: <CheckCircle className="w-5 h-5"/>,
    error: <AlertCircle className="w-5 h-5"/>,
    warning: <AlertTriangle className="w-5 h-5"/>,
    info: <Info className="w-5 h-5"/>,
}

export default function Alert({type, title, message, dismissible = false, onDismiss, className = "", timeout}: AlertProps) {
    const styles = alertStyles[type]

    // Automatically dismiss the alert after `timeout` seconds, if provided
    useEffect(() => {
        if (timeout && onDismiss) {
            const timer = setTimeout(onDismiss, timeout * 1000)
            return () => clearTimeout(timer) // Cleanup the timer if the component is unmounted
        }
    }, [timeout, onDismiss])


    return (
        <div
            className={`relative overflow-hidden rounded-lg border shadow-sm transition-all ${styles.container} ${className}`}
            role="alert"
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            {/* Left accent border */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.accent}`}></div>

            {/* Content container */}
            <div className="flex p-4">
                {/* Icon */}
                <div className={`flex-shrink-0 mr-3 ${styles.icon}`}>{alertIcons[type]}</div>

                {/* Text content */}
                <div className="flex-1">
                    <h3 className={`text-sm font-medium mb-1 ${styles.title}`}>{title}</h3>
                    <div className={`text-sm ${styles.message}`}>{message}</div>
                </div>

                {/* Dismiss button */}
                {dismissible && onDismiss && (
                    <button
                        type="button"
                        className={`absolute top-2 right-2 p-1 border-0 inline-flex items-center justify-center ${styles.closeButton} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${styles.mainColor}-500`}
                        onClick={onDismiss}
                        aria-label="Dismiss"
                    >
                        <X className={`w-3 h-3 ${styles.icon}`}/>
                    </button>
                )}
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full -mr-8 -mb-8 opacity-10">
                <div className={`w-full h-full rounded-full ${styles.accent}`}></div>
            </div>
        </div>
    )
}
