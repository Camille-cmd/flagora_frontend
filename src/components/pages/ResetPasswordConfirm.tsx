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

export default function ResetPasswordConfirm() {
    const {t} = useTranslation();
    const {resetPasswordValidate, resetPasswordConfirm} = useAuth();
    const navigate = useNavigate();
    const {setAlertInfo} = useAlert();
    const {uid, token} = useParams<{ uid: string; token: string }>();
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

    const ResetSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, t("resetPasswordConfirm.validation.password.minLength"))
            .matches(/[A-Z]/, t("resetPasswordConfirm.validation.password.uppercase"))
            .matches(/\d/, t("resetPasswordConfirm.validation.password.number"))
            .matches(/[^a-zA-Z\d]/, t("resetPasswordConfirm.validation.password.specialChar"))
            .required(t("resetPasswordConfirm.validation.password.required")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], t("resetPasswordConfirm.validation.confirmPassword.match"))
            .required(t("resetPasswordConfirm.validation.confirmPassword.required"))
    });

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
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
                        message: t("resetPasswordConfirm.alerts.error")
                    } as AlertInfo);
                }
            });
    };

    useEffect(() => {
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
                {t("resetPasswordConfirm.invalidLink")}
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
                    validationSchema={ResetSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting}) => (
                        <Form className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("resetPasswordConfirm.labels.password")}
                                </label>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder={t("resetPasswordConfirm.placeholders.password")}
                                    as={Input}
                                    className="w-full"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("resetPasswordConfirm.labels.confirmPassword")}
                                </label>
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    placeholder={t("resetPasswordConfirm.placeholders.confirmPassword")}
                                    as={Input}
                                    className="w-full"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm"/>
                            </div>

                            <Button
                                type="submit"
                                buttonType="raspberry"
                                className="w-full"
                                text={t("resetPasswordConfirm.button")}
                                disabled={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}
