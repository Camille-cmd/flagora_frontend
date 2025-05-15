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
import debounce from "lodash/debounce";
import {useTranslation} from "react-i18next";


export default function Register() {
    const {register, isAuthenticated, isUserNameAvailable} = useAuth();
    const navigate = useNavigate();
    const {setAlertInfo} = useAlert();
    const {t} = useTranslation()

    const RegisterValidationSchema = Yup.object().shape({
        email: Yup.string().email(t("register.email.validation.invalid")).required(t("register.email.validation.required")),
        username: Yup.string()
            .matches(/^[\w.-]+$/, t("register.username.validation.pattern"))
            .min(2, t("register.username.validation.minLength")) // Minimum 2 characters (not checked by backend)
            .max(150, t("register.username.validation.maxLength"))
            .required(t("register.username.validation.required")),
        password: Yup.string()
            .min(8, t("register.passwordRules.length"))
            .matches(/[A-Z]/, t("register.passwordRules.minUppercase"))
            .matches(/\d/, t("register.passwordRules.minNumber"))
            .required(t("register.password.validation.required")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], t("register.confirmPassword.validation.match"))
            .required(t("register.confirmPassword.validation.required")),
    });


    const handleRegister = (values: { email: string; username: string; password: string; confirmPassword: string }) => {
        register(values.email, values.username, values.password)
            .then(() => {
                    navigate("/login", {replace: true});
                    setAlertInfo({
                        type: "success",
                        message: t("register.success"),
                    } as AlertInfo);
                }
            )
            .catch(error => {
                const errorCode = error.message
                switch (errorCode) {
                    case "username_already_registered":
                        setAlertInfo({
                            type: "error",
                            message: t("register.username_not_available"),
                            timeout: 10,
                        } as AlertInfo);
                        break;
                    case "email_already_registered":
                        setAlertInfo({
                            type: "error",
                            title: t("register.email_already_registered"),
                            message: (
                                <>
                                {t("register.alreadyRegistered")}{" "}
                                    <Link to="/login"
                                          onClick={() => setAlertInfo(undefined)}
                                          className="text-red-500 hover:text-red-600">
                                        {t("register.connect")}
                                    </Link>
                                </>
                            ),
                            timeout: 10,
                        } as AlertInfo);
                        break;
                    default:
                        setAlertInfo({
                            type: "error",
                            message: error.message,
                            timeout: 10,
                        } as AlertInfo);
                }
            })
    };

    // Validate username availability
    const validateUsernameAvailability = async (value: string): Promise<string | undefined> => {
        if (!value || value.length < 2) return undefined; // Skip validation if empty or too short

        const available = await isUserNameAvailable(value);
        return available ? undefined : t("register.username_not_available");
    };

    // Debounce it (1 second delay)
    const debouncedValidateUsername = debounce(
        (value: string, callback: (msg?: string) => void) => {
            validateUsernameAvailability(value).then(callback);
        },
        500
    );
    // Wrapper function to use with Formik
    const validateUsername = (value: string): Promise<string | undefined> => {
        return new Promise((resolve) => {
            debouncedValidateUsername(value, resolve);
        });
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
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={t("login.email.placeholder")}
                                    aria-label={t("login.email.ariaLabel")}
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
                                    {t("login.password.label")}
                                </label>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    aria-label={t("login.password.ariaLabel")}
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
                                        {t("register.passwordRules.length")}
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        {t("register.passwordRules.minUppercase")}
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={16} className="text-green-500 mr-2"/>
                                        {t("register.passwordRules.minNumber")}
                                    </li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                buttonType="primary"
                                className="w-full px-5 py-2.5 mt-10"
                                text={t("register.submit")}
                                disabled={!isValid || !dirty || isSubmitting}
                                loading={isSubmitting}
                                aria-label={t("register.submitAriaLabel")}
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
