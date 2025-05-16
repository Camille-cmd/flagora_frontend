import {JSX} from "react";

export type AlertType = "success" | "error" | "warning" | "info"

export interface AlertInfo {
    type: AlertType
    title: string
    message: string | JSX.Element
    dismissible?: boolean
    onDismiss?: () => void
    className?: string
    timeout?: number | null // Timeout in seconds
}
