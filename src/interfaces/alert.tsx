
export type AlertType = "success" | "error" | "warning" | "info"

export interface AlertInfo {
    type: AlertType;
    title: string;
    show: boolean;
    message: string;
}
