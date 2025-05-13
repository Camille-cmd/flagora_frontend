import {Link, useNavigate} from "react-router-dom";
import {Check} from "lucide-react";
import Button from "../common/Button.tsx";
import Card from "../common/Card/Card.tsx";
import Input from "../common/Input.tsx";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useAlert} from "../../contexts/AlertContext.tsx";
import {useAuthContext} from "../../contexts/AuthContext.tsx";

const RegisterSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Champ requis"),
    username: Yup.string()
        .min(3, "Au moins 3 caractères")
        .max(20, "Maximum 20 caractères")
        .required("Champ requis"),
    password: Yup.string()
        .min(8, "Au moins 8 caractères")
        .matches(/[A-Z]/, "Au moins une lettre majuscule")
        .matches(/\d/, "Au moins un chiffre")
        .matches(/[^a-zA-Z\d]/, "Au moins un caractère spécial")
        .required("Champ requis"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], "Les mots de passe ne correspondent pas")
        .required("Champ requis"),
});

export default function Register() {
    const {register} = useAuthContext();
    const navigate = useNavigate();
    const {setAlertInfo} = useAlert();
    
    const handleRegister = (values: { email: string; username: string; password: string; confirmPassword: string }) => {
        register(values.email, values.username, values.password)
            .then(() => {
                    navigate("/login", {replace: true});
                    setAlertInfo({
                        type: "success",
                        message: "Votre compte a bien été créé. Vous pouvez maintenant vous connecter.",
                    } as AlertInfo);
                }
            )
            .catch(error => {
                setAlertInfo(
                    {
                        type: "error",
                        message: error.response?.data
                    } as AlertInfo
                )
            })
    };

    return (
        <div className="flex flex-col justify-center items-center px-4 mt-4 transition-colors duration-300">
            <Card className="lg:w-96" color1="yellow" color2="blue">
                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-6 font-rubik">
                    Créer un compte
                </h2>

                <Formik
                    initialValues={{
                        email: "",
                        username: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleRegister}
                >
                    {() => (
                        <Form className="space-y-8">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm text-secondary dark:text-primary">
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    as={Input}
                                    className="w-full box-border p-2"
                                />
                                <ErrorMessage name="email" component="p" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="username"
                                       className="block text-sm text-secondary dark:text-primary">
                                    Nom d'utilisateur
                                </label>
                                <Field
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Votre nom d'utilisateur"
                                    as={Input}
                                    className="w-full box-border p-2"
                                />
                                <ErrorMessage name="username" component="p" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password"
                                       className="block text-sm text-secondary dark:text-primary">
                                    Mot de passe
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    as={Input}
                                    className="w-full box-border p-2"
                                />
                                <ErrorMessage name="password" component="p" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword"
                                       className="block text-sm text-secondary dark:text-primary">
                                    Confirmer le mot de passe
                                </label>
                                <Field
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    as={Input}
                                    className="w-full box-border p-2"
                                />
                                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-secondary dark:text-primary">Règles du mot de passe</h3>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        Au moins 8 caractères
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        Au moins une lettre majuscule
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        Au moins un chiffre
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        Au moins un caractère spécial
                                    </li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                buttonType="primary"
                                className="w-full px-5 py-2.5 mt-20"
                                text="Créer mon compte"
                                aria-label="Register button"
                            />
                        </Form>
                    )}
                </Formik>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    Vous avez déjà un compte?{" "}
                    <Link to="/login" className="text-yellow-500 hover:text-yellow-600">
                        Connectez-vous
                    </Link>
                </p>
            </Card>
        </div>
    );
}
