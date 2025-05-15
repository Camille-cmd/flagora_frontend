import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import Button from "../common/Button.tsx";
import Card from "../common/Card/Card.tsx";
import Input from "../common/Input.tsx";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useAlert} from "../../contexts/AlertContext.tsx";
import {AxiosError} from "axios";
import {useAuth} from "../../services/auth/useAuth.tsx";
import {useTranslation} from "react-i18next";


/**
 * Login component
 * @constructor
 *
 * Renders the login form and handles user authentication.
 */
export default function Login() {
    const {isAuthenticated, login} = useAuth();
    const navigate = useNavigate();
    const {setAlertInfo} = useAlert();
    const {t} = useTranslation()

    const LoginValidationSchema = Yup.object().shape({
        email: Yup.string()
            .required(t("login.email.required"))
            .test(
                'email-or-username',
                t("login.validation.invalid"),
                function (value) {
                    if (!value) return true; // let .required handle an empty case
                    if (value.includes('@')) {
                        return Yup.string().email().isValidSync(value);
                    }
                    return true; // accept as username
                }),
        password: Yup.string().required(t("login.password.required")),
    });

    useEffect(() => {
        // Redirect the user to the main page if already logged-in
        if (isAuthenticated) {
            navigate("/mode-selection", {replace: true});
        }
    }, [isAuthenticated, navigate]);

    /*
        * Handle the login form submission,
        * validate the credentials and redirect to the mode selection page
     */
    const handleLogin = async (values: { email: string; password: string }) => {
        await new Promise(r => setTimeout(r, 300));  // Simulate a delay for the loading state
        setAlertInfo(undefined) // Clear previous alerts

        login(values.email, values.password)
            .then(() => {
                navigate("/mode-selection")
                setAlertInfo({type: "success", message: t("login.success")} as AlertInfo)
            })
            .catch((error: AxiosError) => {
                setAlertInfo({
                    type: "error",
                    message: error.message || t("errors.generic"),
                    timeout: 10,
                } as AlertInfo);

            });
    };

    return (
        <div className="flex flex-col justify-center items-center px-4 mt-14 transition-colors duration-300">
            <Card className="lg:w-96" color1="yellow" color2="blue">
                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-8 font-rubik">
                    {t("login.title")}
                </h2>

                <Formik
                    initialValues={{email: "", password: ""}}
                    validationSchema={LoginValidationSchema}
                    onSubmit={handleLogin}
                >
                    {({isValid, dirty, isSubmitting}) => (
                        <Form className="space-y-8">
                            {/* EMAIL */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm text-secondary dark:text-primary"
                                >
                                    {t("login.email.label")}
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder={t("login.email.placeholder")}
                                    aria-label={t("login.email.ariaLabel")}
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
                                        {t("login.password.label")}
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-yellow-500 hover:text-yellow-600"
                                    >
                                        {t("login.password.forgotPassword")}
                                    </Link>
                                </div>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    aria-label={t("login.password.ariaLabel")}
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
                                text={t("login.submit")}
                                disabled={!isValid || !dirty || isSubmitting}
                                loading={isSubmitting}
                                aria-label={t("login.submitAriaLabel")}
                            />
                        </Form>
                    )}
                </Formik>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    {t("login.accountMissing")}{" "}
                    <Link to="/register" className="text-yellow-500 hover:text-yellow-600">
                        {t("login.createAccount")}
                    </Link>
                </p>
            </Card>
        </div>
    );
}
