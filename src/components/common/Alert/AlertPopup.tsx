import { useAlert } from "../../../contexts/AlertContext";
import Alert from "./Alert.tsx";

export default function AlertPopup() {
    const { alertInfo, setAlertInfo } = useAlert();

    return (
        alertInfo?.type ? (
            <div className="top-40 max-w-xl mx-auto my-2">
                <Alert
                    type={alertInfo.type}
                    title={alertInfo.title}
                    message={alertInfo.message}
                    dismissible={alertInfo.dismissible}
                    onDismiss={alertInfo.onDismiss || (() => setAlertInfo(undefined))}
                    className={alertInfo.className}
                    timeout={alertInfo.timeout || 3}
                />
            </div>
        ) : null
    );
}
