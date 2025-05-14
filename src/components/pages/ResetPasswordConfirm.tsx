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

const ResetSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Au moins 8 caractères")
        .matches(/[A-Z]/, "Au moins une lettre majuscule")
        .matches(/\d/, "Au moins un chiffre")
        .matches(/[^a-zA-Z\d]/, "Au moins un caractère spécial")
        .required("Champ requis"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Les mots de passe ne correspondent pas")
        .required("Champ requis"),
});
export default function ResetPasswordConfirm() {
    const {resetPasswordValidate, resetPasswordConfirm} = useAuth();
    const navigate = useNavigate();
    const {setAlertInfo} = useAlert();

    const {uid, token} = useParams<{ uid: string; token: string }>();
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

    const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
        if (!uid || !token) {
            setAlertInfo({
                type: "error",
                message: "Lien de réinitialisation invalide.",
            } as AlertInfo);
            return;
        }

        resetPasswordConfirm(uid, token, values.password)
            .then(
                () => {
                    navigate("/login", {replace: true});
                    setAlertInfo({
                        type: "success",
                        message: "Votre mot de passe a été réinitialisé avec succès.",
                    } as AlertInfo);
                }
            )
            .catch((error) => {
                if (error.response.status === 400) {
                    setAlertInfo({
                        type: "error",
                        message: "Le lien de réinitialisation a expiré ou est invalide.",
                    } as AlertInfo);
                } else {
                    setAlertInfo({
                        type: "error",
                        message: "Erreur inconnue lors de la réinitialisation du mot de passe.",
                    } as AlertInfo);
                }
            });
    };

    useEffect(() => {
        // Check if the token is valid before allowing the user to reset the password
        resetPasswordValidate(uid, token)

            .then(() => setIsTokenValid(true))

            .catch((error) => {
                setIsTokenValid(false);
                if (error.message === "invalid_token") {
                    setAlertInfo({
                        type: "error",
                        message: "Le lien de réinitialisation a expiré ou est invalide.",
                        timeout: 10,
                    } as AlertInfo);
                    navigate("/", {replace: true});
                }
            });
    }, []);


    if (isTokenValid === false) {
        return (
            <div className="text-center mt-20 text-red-600">
                Le lien est invalide ou a expiré.
            </div>
        );
    }

    if (isTokenValid === null) {
        return (
            <div className="text-center mt-20 text-gray-500">
                Vérification du lien en cours...
            </div>
        );
    }
    return (
        <div className="flex flex-col justify-center items-center px-4 mt-20">
            <Card className="lg:w-96" color1="raspberry" color2="blue">
                <h2 className="text-2xl text-center font-bold mb-6 text-primary dark:text-white">
                    Réinitialiser le mot de passe
                </h2>

                <Formik
                    initialValues={{password: "", confirmPassword: ""}}
                    validationSchema={ResetSchema}
                    onSubmit={handleSubmit}
                >
                    {({isSubmitting}) => (
                        <Form className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="password"
                                       className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nouveau mot de passe
                                </label>
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    as={Input}
                                    className="w-full"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword"
                                       className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirmer le mot de passe
                                </label>
                                <Field
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    as={Input}
                                    className="w-full"
                                />
                                <ErrorMessage name="confirmPassword"
                                              component="div"
                                              className="text-red-500 text-sm"/>
                            </div>

                            <Button
                                type="submit"
                                buttonType="raspberry"
                                className="w-full"
                                text="Réinitialiser"
                                disabled={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}
