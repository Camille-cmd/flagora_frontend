import {useNavigate, useParams} from "react-router-dom";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import Input from "../common/Input";
import Button from "../common/Button";
import Card from "../common/Card/Card";
import {useAlert} from "../../contexts/AlertContext.tsx";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {passwordConfirmValidation, passwordValidation} from "../../utils/validationSchemas.tsx";

export default function ResetPasswordConfirm() {
    const {t} = useTranslation();
    const {resetPasswordValidate, resetPasswordConfirm} = useAuth();
    const navigate = useNavigate();
    const {setAlertInfo} = useAlert();

    // Get the uid and token from the URL parameters
    const {uid, token} = useParams<{ uid: string; token: string }>();

    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

    const ResetValidationSchema = Yup.object().shape({
        password: passwordValidation,
        confirmPassword: passwordConfirmValidation
    });

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        // If one of the parameters is missing, show an error message
        if (!uid || !token) {
            setAlertInfo({
                type: "error",
                message: t("resetPasswordConfirm.alerts.invalidLink")
            } as AlertInfo);
            return;
        }

        resetPasswordConfirm(uid, token, values.password)
            .then(() => {
                navigate("/login", {replace: true});
                setAlertInfo({
                    type: "success",
                    message: t("resetPasswordConfirm.alerts.success")
                } as AlertInfo);
            })
            .catch((error) => {
                if (error.response?.status === 400) {
                    setAlertInfo({
                        type: "error",
                        message: t("resetPasswordConfirm.alerts.invalidLink")
                    } as AlertInfo);
                } else {
                    setAlertInfo({
                        type: "error",
                        message: error.message,
                    } as AlertInfo);
                }
            });
    };

    useEffect(() => {
        // If the token is invalid, the reset cannot be completed
        // redirect to the main page
        resetPasswordValidate(uid, token)
            .then(() => setIsTokenValid(true))
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

    return (
        <div className="flex flex-col justify-center items-center px-4 mt-20">
            <Card className="lg:w-96" color1="raspberry" color2="blue">
                <h2 className="text-2xl text-center font-bold mb-6 text-primary dark:text-white">
                    {t("resetPasswordConfirm.title")}
                </h2>

                <Formik
                    initialValues={{password: "", confirmPassword: ""}}
                    validationSchema={ResetValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting}) => (
                        <Form className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("register.password.label")}
                                </label>
                                 <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    aria-label={t("register.password.ariaLabel")}
                                    as={Input}
                                    className="w-full"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("register.confirmPassword.label")}
                                </label>
                                 <Field
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    aria-label={t("register.confirmPassword.ariaLabel")}
                                    as={Input}
                                    className="w-full"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm"/>
                            </div>

                            <Button
                                type="submit"
                                buttonType="raspberry"
                                className="w-full"
                                text={t("resetPasswordConfirm..submit.text")}
                                aria-label={t("resetPasswordConfirm.submit.ariaLabel")}
                                disabled={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}
