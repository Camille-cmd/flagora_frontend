import {Link, useNavigate} from "react-router-dom";
import {Check} from "lucide-react";
import Button from "../common/Button.tsx";
import Card from "../common/Card/Card.tsx";
import Input from "../common/Input.tsx";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useAlert} from "../../contexts/AlertContext.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {
    emailValidation,
    passwordConfirmValidation,
    passwordValidation,
    UsernameValidation
} from "../../utils/validationSchemas.tsx";
import {validateUsername} from "../../utils/user.tsx";


export default function Register() {
    const {register, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const {setAlertInfo} = useAlert();
    const {t} = useTranslation()

    // Validation schema for the registration form
    const RegisterValidationSchema = Yup.object().shape({
        email: emailValidation,
        username: UsernameValidation,
        password: passwordValidation,
        confirmPassword: passwordConfirmValidation
    });


    /**
     * Handle the registration form submission
     * Registers the user and redirects to the login page
     * @param values - email, username, password, confirmPassword
     */
    const handleRegister = async (values: { email: string; username: string; password: string; confirmPassword: string }) => {
        setAlertInfo(undefined) // Clear previous alerts

        register(values.email, values.username, values.password)
            .then(() => {
                    navigate("/login", {replace: true});
                    setAlertInfo({
                        type: "success",
                        message: t("register.alerts.success"),
                        timeout: 8,
                    } as AlertInfo);
                }
            )
            .catch(error => {
                setAlertInfo({
                    type: "error",
                    message: error.message,
                    timeout: null,
                    dismissible: true,
                } as AlertInfo);
            })
    };


    // Redirect user to the main page if already logged-in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", {replace: true});
        }
    }, [isAuthenticated, navigate]);


    return (
        <div className="flex flex-col justify-center items-center px-4 mt-4 transition-colors duration-300">
            <Card className="lg:w-96" color1="yellow" color2="blue">
                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-6 font-rubik">
                    {t("register.title")}
                </h2>

                <Formik
                    initialValues={{
                        email: "",
                        username: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    validationSchema={RegisterValidationSchema}
                    onSubmit={handleRegister}
                >
                    {({isValid, dirty, isSubmitting}) => (
                        <Form className="space-y-8">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm text-secondary dark:text-primary">
                                    {t("register.email.label")}
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t("register.email.placeholder")}
                                    aria-label={t("register.email.ariaLabel")}
                                    as={Input}
                                    className="w-full box-border p-2"
                                />
                                <ErrorMessage name="email" component="p" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm text-secondary dark:text-primary">
                                    {t("register.username.label")}
                                </label>
                                <ErrorMessage name="username" component="p" className="text-red-500 text-sm"/>
                                <Field
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder={t("register.username.placeholder")}
                                    aria-label={t("register.username.ariaLabel")}
                                    as={Input}
                                    validate={validateUsername}
                                    className="w-full box-border p-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password"
                                       className="block text-sm text-secondary dark:text-primary">
                                    {t("register.password.label")}
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    aria-label={t("register.password.ariaLabel")}
                                    as={Input}
                                    className="w-full box-border p-2"
                                />
                                <ErrorMessage name="password" component="p" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword"
                                       className="block text-sm text-secondary dark:text-primary">
                                    {t("register.confirmPassword.label")}
                                </label>
                                <Field
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    aria-label={t("register.confirmPassword.ariaLabel")}
                                    as={Input}
                                    className="w-full box-border p-2"
                                />
                                <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-secondary dark:text-primary">{t("register.passwordRules.title")}</h3>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        {t("passwordRules.length")}
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        {t("passwordRules.uppercase")}
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        {t("passwordRules.number")}
                                    </li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                buttonType="primary"
                                className="w-full px-5 py-2.5 mt-10"
                                text={t("register.submit.text")}
                                disabled={!isValid || !dirty || isSubmitting}
                                loading={isSubmitting}
                                aria-label={t("register.submit.ariaLabel")}
                            />
                        </Form>
                    )}
                </Formik>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    {t("register.alreadyHaveAccount")}{" "}
                    <Link to="/login" className="text-yellow-500 hover:text-yellow-600">
                        {t("register.login")}
                    </Link>
                </p>
            </Card>
        </div>
    );
}
