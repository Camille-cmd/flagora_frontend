import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from "../common/Button.tsx";
import Card from "../common/Card/Card.tsx";
import Input from "../common/Input.tsx";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import Alert from "../common/Alert.tsx";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useAuthContext} from "../../services/auth/AuthContext.tsx";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Champ requis"),
    password: Yup.string().required("Champ requis"),
});

export default function Login() {
    const {isAuthenticated, login} = useAuthContext();
    const navigate = useNavigate();
    const [alertInfo, setAlertInfo] = useState<AlertInfo>();

    // Redirect user to the main page if already logged-in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/mode-selection", {replace: true});
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (values: { email: string; password: string }) => {
        login(values.email, values.password)
            .then(response => {
                console.log("Login success:", response);
                navigate("/mode-selection");
            })
            .catch(error => {
                console.error("Login failed:", error.response?.data || error.message);
                setAlertInfo({
                    show: true,
                    type: "error",
                    message: "Email ou mot de passe invalides.",
                } as AlertInfo);
            });
    };

    return (
        <main className="flex flex-col justify-center items-center px-4 mt-20 transition-colors duration-300">
            <Card className="lg:w-96" color1="yellow" color2="blue">
                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-8 font-rubik">
                    Connexion
                </h2>

                {alertInfo?.show && (
                    <Alert
                        type={alertInfo.type}
                        title={alertInfo.title}
                        message={alertInfo.message}
                        timeout={20}
                        className={"mb-8"}
                    />
                )}

                <Formik
                    initialValues={{email: "", password: ""}}
                    validationSchema={LoginSchema}
                    onSubmit={handleLogin}
                >
                    {() => (
                        <Form className="space-y-8">
                            {/* EMAIL */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm text-secondary dark:text-primary"
                                >
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    aria-label="Email input"
                                    as={Input}
                                    className="w-full p-2"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm text-secondary dark:text-primary"
                                    >
                                        Mot de passe
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-yellow-500 hover:text-yellow-600"
                                    >
                                        Mot de passe oublié?
                                    </Link>
                                </div>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    as={Input}
                                    className="w-full p-2"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-red-500 text-sm"
                                />
                            </div>

                            <Button
                                type="submit"
                                buttonType="primary"
                                className="w-full px-5 py-2.5 mt-20"
                                text="Se connecter"
                                aria-label="Login button"
                            />
                        </Form>
                    )}
                </Formik>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    Vous n'avez pas de compte?{" "}
                    <Link to="/register" className="text-yellow-500 hover:text-yellow-600">
                        Créez-en un
                    </Link>
                </p>
            </Card>
        </main>
    );
}
