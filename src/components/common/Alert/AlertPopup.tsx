import { useAlert } from "../../../contexts/AlertContext";
import Alert from "./Alert.tsx";

export default function AlertPopup() {
    const { alertInfo } = useAlert();

    return (
        alertInfo ? (
            <Alert
                type={alertInfo.type}
                title={alertInfo.title}
                message={alertInfo.message}
                dismissible={alertInfo.dismissible}
                onDismiss={alertInfo.onDismiss}
                className={alertInfo.className}
                timeout={alertInfo.timeout}
            />
        ) : null
    );
}
