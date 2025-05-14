import {useState} from "react";
import {Link} from "react-router-dom";
import {ArrowLeft, KeyRound, Mail, Send} from "lucide-react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

import Card from "../common/Card/Card.tsx";
import {CardHeader} from "../common/Card/CardHeader.tsx";
import Input from "../common/Input.tsx";
import Button from "../common/Button.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useAlert} from "../../contexts/AlertContext.tsx";

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Adresse email invalide")
        .required("Champ requis"),
});

export default function ResetPassword() {
    const {resetPassword} = useAuth();
    const {setAlertInfo} = useAlert();

    const [submitted, setSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const handleSubmit = (values: { email: string }) => {
        resetPassword(values.email)
            .then(() => {
                setSubmittedEmail(values.email);
                setSubmitted(true);

                setAlertInfo(
                    {
                        type: "success",
                        message: "Si votre adresse email est valide, vous recevrez un lien de réinitialisation de mot de passe.",
                    } as AlertInfo
                )
            })
            .catch(() => {});
    };

    return (
        <main className="flex flex-col justify-center items-center px-4 mt-20">
            <Card className="lg:w-96" color1="blue" color2="raspberry">
                <CardHeader
                    title="Réinitialiser le mot de passe"
                    className="text-center mb-6"
                    icon={
                        <div className="mx-auto mb-4 p-3 bg-white dark:bg-raspberry-800 rounded-full shadow-md">
                            <KeyRound className="w-6 h-6 text-raspberry-600 dark:text-raspberry-400"/>
                        </div>
                    }
                />

                <div>
                    {!submitted ? (
                        <>
                            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                            </p>

                            <Formik
                                initialValues={{email: ""}}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({isValid, dirty, isSubmitting}) => (
                                    <Form className="space-y-6">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Email
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    as={Input}
                                                    id="email"
                                                    className="w-full p-3 pl-10"
                                                    placeholder="email@test.com"
                                                    icon={<Mail className="w-5 h-5"/>}
                                                    aria-label="Email"
                                                />
                                            </div>
                                            <ErrorMessage name="email" component="p" className="text-red-500 text-sm"/>
                                        </div>

                                        <Button
                                            type="submit"
                                            buttonType="raspberry"
                                            size="medium"
                                            text="Envoyer le lien de réinitialisation"
                                            className="w-full"
                                            disabled={!isValid || !dirty || isSubmitting}
                                            children={<Send className="w-5 h-5 ml-2"/>}
                                        />
                                    </Form>
                                )}
                            </Formik>
                        </>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="p-4 mx-auto w-16 h-16 bg-raspberry-800 dark:bg-raspberry-900 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-raspberry-600 dark:text-raspberry-400"/>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-secondary dark:text-primary">
                                    Vérifiez votre boîte de réception
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Nous avons envoyé un lien de réinitialisation à{" "}
                                    <span className="font-medium">{submittedEmail}</span>
                                </p>
                            </div>

                            <div className="pt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou{" "}
                                    <Link to=""
                                          onClick={() => setSubmitted(false)}
                                          className="text-raspberry-400 hover:text-raspberry-600">
                                        essayez à nouveau
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-primary hover:text-raspberry-600"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1"/>
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </Card>
        </main>
    );
}
