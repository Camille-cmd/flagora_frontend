import {useEffect, useState} from "react";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../services/auth/useAuth.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAlert} from "../../contexts/AlertContext.tsx";

export default function EmailConfirm() {
    const {t} = useTranslation();
    const {verifyEmail} = useAuth();
    const {setAlertInfo} = useAlert();
    const navigate = useNavigate();

    // Get the uid and token from the URL parameters
    const {uid, token} = useParams<{ uid: string; token: string }>();

    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

    useEffect(() => {
        // If the token is invalid, the reset cannot be completed
        // redirect to the main page
        verifyEmail(uid, token)
            .then(() => {
                setIsTokenValid(true);
                setAlertInfo({
                    type: "success",
                    message: t("emailConfirm.alerts.success"),
                    timeout: 10
                } as AlertInfo);
                navigate("/", {replace: true});
            })
            .catch((error) => {
                setIsTokenValid(false);
                if (error.message === "invalid_token") {
                    setAlertInfo({
                        type: "error",
                        message: t("resetPasswordConfirm.alerts.invalidLink"),
                        timeout: 10
                    } as AlertInfo);
                    navigate("/", {replace: true});
                }
            });
    }, []);

    if (isTokenValid === false) {
        return (
            <div className="text-center mt-20 text-red-600">
                {t("resetPasswordConfirm.alerts.invalidLink")}
            </div>
        );
    }

    if (isTokenValid === null) {
        return (
            <div className="text-center mt-20 text-gray-500">
                {t("resetPasswordConfirm.checkingLink")}
            </div>
        );
    }
}
