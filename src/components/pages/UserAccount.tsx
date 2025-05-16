import {useState} from "react"
import {AlertTriangle, CheckCircle, Eye, EyeOff, Lock, Mail, Save, User, UserCircle} from "lucide-react"
import {PageTitle} from "../common/PageTitle"
import Card from "../common/Card/Card"
import {CardHeader} from "../common/Card/CardHeader"
import {ErrorMessage, Field, Form, Formik} from "formik"
import * as Yup from "yup"
import Input from "../common/Input.tsx"
import {useAlert} from "../../contexts/AlertContext.tsx"
import type {AlertInfo} from "../../interfaces/alert.tsx"
import {useAuth} from "../../services/auth/useAuth.tsx"
import Alert from "../common/Alert/Alert.tsx";
import Button from "../common/Button.tsx";
import {passwordConfirmValidation, passwordValidation, UsernameValidation} from "../../utils/validationSchemas.tsx";
import {useTranslation} from "react-i18next";
import {validateUsername} from "../../utils/user.tsx";

export default function UserAccount() {
    const {t} = useTranslation()
    const {user, sendVerificationEmail, updateUser, updateUserPassword} = useAuth()
    const {setAlertInfo} = useAlert()

    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [verificationEmailSent, setVerificationEmailSent] = useState(false)

    // Validation schemas for Formik
    const personalInfoSchema = Yup.object({
        username: UsernameValidation
    })

    const passwordSchema = Yup.object({
        currentPassword: Yup.string().required(t("userAccount.currentPassword.validation.required")),
        password: passwordValidation,
        confirmPassword: passwordConfirmValidation
    })

    const handlePersonalInfoSubmit = async (values: { username: string }) => {
        updateUser(values.username)
            .then(() => {
                setAlertInfo({
                    type: "success",
                    message: t("userAccount.submitPersonalInfo.alerts.success"),
                } as AlertInfo)
            })
            .catch((error) => {
                setAlertInfo({
                    type: "error",
                    message: error.message
                } as AlertInfo)
            })
    }

    const handlePasswordSubmit = async (values: {
        currentPassword: string
        password: string
        confirmPassword: string
    }) => {
        updateUserPassword(values.currentPassword, values.password)
            .then(() => {
                setAlertInfo({
                    type: "success",
                    message: t("userAccount.submitPassword.alerts.success"),
                } as AlertInfo)
            })
            .catch((error) => {
                setAlertInfo({
                    type: "error",
                    message: error.message
                } as AlertInfo)
            })
    }

    const handleSendVerificationEmail = async () => {
        sendVerificationEmail()
            .then(
                () => {
                    setVerificationEmailSent(true)
                    setAlertInfo({
                        type: "success",
                        message: t("userAccount.sendVerificationEmail.alerts.success"),
                    } as AlertInfo)
                }
            )
    }

    return (
        <main className="flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Page Title */}
                <PageTitle title={t("userAccount.title")}/>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    {t("userAccount.description")}
                </p>

                {/* Email Verification Alert */}
                {user && !user.isEmailVerified && (
                    <div className="mb-8">
                        <Alert
                            type="warning"
                            title={t("userAccount.isEmailVerified.title")}
                            message={
                                verificationEmailSent
                                    ? t("userAccount.isEmailVerified.verificationSent")
                                    : t("userAccount.isEmailVerified.notVerified")
                            }
                            dismissible={false}
                        />

                        {!verificationEmailSent && (
                            <Button
                                type="button"
                                buttonType="primary"
                                size="small"
                                text={t("userAccount.isEmailVerified.button.text")}
                                className="mt-4 w-full"
                                onClick={handleSendVerificationEmail}
                                children={<Mail className="w-5 h-5 ml-2"/>}
                                aria-label={t("userAccount.isEmailVerified.button.ariaLabel")}
                            />
                        )}

                        {verificationEmailSent && (
                            <div className="flex items-center mt-4 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-5 h-5 mr-2"/>
                                <span>{t("userAccount.isEmailVerified.buttonSent.text")}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Personal Information Form */}
                <Card className="mb-8" color1="blue" color2="yellow">
                    <CardHeader
                        className="mb-6"
                        title={t("userAccount.personalInfoCard.title")}
                        icon={
                            <div className="p-3 bg-white dark:bg-blue-800 rounded-full shadow-md mr-4">
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                            </div>
                        }
                    />
                    {user && (
                        <Formik
                            initialValues={{
                                username: user.username ? user.username : "",
                                email: user.email,
                            }}
                            validationSchema={personalInfoSchema}
                            onSubmit={handlePersonalInfoSubmit}
                        >
                            {(props) => (
                                <Form className="space-y-6">
                                    {/* Username Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="username"
                                               className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t("register.username.label")}
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={props.values.username || ""}
                                                as={Input}
                                                validate={(value: string) => {
                                                    // If username don't change, don't validate
                                                    if (value === user?.username || value.trim() === "") {
                                                        return undefined; // Explicitly return undefined for valid cases
                                                    }
                                                    return validateUsername(value); // Call validateUsername for other
                                                                                    // cases
                                                }}
                                                className="w-full p-3 pl-10"
                                                aria-label={t("register.username.ariaLabel")}
                                            />
                                            <div className="absolute left-3 top-3 text-gray-400">
                                                <UserCircle className="w-5 h-5"/>
                                            </div>
                                        </div>
                                        <ErrorMessage name="username" component="p" className="text-red-500 text-sm"/>
                                    </div>

                                    {/* Email Field (Read-only) */}
                                    <div className="space-y-2">
                                        <label htmlFor="email"
                                               className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t("register.email.label")}
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type="email"
                                                id="email"
                                                name="email"
                                                disabled={true}
                                                readOnly
                                                as={Input}
                                                value={props.values.email}
                                                className="w-full p-3 pl-10"
                                                aria-label={t("register.email.ariaLabel")}
                                            />
                                            <div className="absolute left-3 top-3 text-gray-400">
                                                <Mail className="w-5 h-5"/>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t("userAccount.personalInfoCard.cantChangeEmail")}
                                            </p>
                                            {user && !user.isEmailVerified && (
                                                <span className="text-xs flex items-center text-yellow-600 dark:text-yellow-400">
                                                    <AlertTriangle className="w-3 h-3 mr-1"/>
                                                    {t("userAccount.personalInfoCard.unverifiedEmail")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        buttonType="info"
                                        size={"small"}
                                        text={t("userAccount.personalInfoCard.submit.text")}
                                        className="w-full py-3 px-4"
                                        children={<Save className="w-5 h-5"/>}
                                        aria-label={t("userAccount.personalInfoCard.submit.ariaLabel")}
                                        disabled={!props.isValid || props.isSubmitting}
                                        loading={props.isSubmitting}
                                    />
                                </Form>
                            )}
                        </Formik>
                    )}
                </Card>

                {/* Password Change Form */}
                <Card color1="pink" color2="blue">
                    <CardHeader
                        className="mb-6"
                        title={t("userAccount.changePasswordCard.title")}
                        icon={
                            <div className="p-3 bg-white dark:bg-raspberry-800 rounded-full shadow-md mr-4">
                                <Lock className="w-6 h-6 text-raspberry-600 dark:text-raspberry-400"/>
                            </div>
                        }
                    />
                    <Formik
                        initialValues={{
                            currentPassword: "",
                            password: "",
                            confirmPassword: "",
                        }}
                        validationSchema={passwordSchema}
                        onSubmit={handlePasswordSubmit}
                    >
                        {(props) => (
                            <Form className="space-y-6">
                                {/* Current Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="currentPassword"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        {t("userAccount.changePasswordCard.currentPassword.label")}
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={"password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            autocomplete="new-password"  // Prevents autofill
                                            as={Input}
                                            className="w-full p-3 pl-10"
                                            placeholder={t("userAccount.changePasswordCard.currentPassword.placeholder")}
                                            aria-label={t("userAccount.changePasswordCard.currentPassword.ariaLabel")}
                                        />
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                    </div>
                                    <ErrorMessage name="currentPassword"
                                                  component="p"
                                                  className="text-red-500 text-sm"/>
                                </div>

                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="password"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t("userAccount.changePasswordCard.newPassword.label")}
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showNewPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            as={Input}
                                            className="w-full p-3 pl-10"
                                            placeholder={t("userAccount.changePasswordCard.newPassword.placeholder")}
                                            aria-label={t("userAccount.changePasswordCard.newPassword.ariaLabel")}
                                        />
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                        <Button
                                            type={"button"}
                                            buttonType={"custom"}
                                            size={"small"}
                                            className={
                                                "absolute right-3 top-2.5 text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-darkblue-600"
                                            }
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            children={showNewPassword ? <Eye className="w-5 h-5"/> :
                                                <EyeOff className="w-5 h-5"/>}
                                            aria-label={t("userAccount.changePasswordCard.showHidePassword.ariaLabel")}
                                        />
                                    </div>
                                    <ErrorMessage name="password" component="p" className="text-red-500 text-sm"/>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        {t("userAccount.changePasswordCard.confirmNewPassword.label")}
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            as={Input}
                                            className="w-full p-3 pl-10 pr-10"
                                            placeholder={t("userAccount.changePasswordCard.confirmNewPassword.placeholder")}
                                            aria-label={t("userAccount.changePasswordCard.confirmNewPassword.ariaLabel")}
                                        />
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                        <Button
                                            type={"button"}
                                            buttonType={"custom"}
                                            size={"small"}
                                            className={
                                                "absolute right-3 top-2.5 text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-darkblue-600"
                                            }
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            children={showConfirmPassword ? <Eye className="w-5 h-5"/> :
                                                <EyeOff className="w-5 h-5"/>}
                                            aria-label={t("userAccount.changePasswordCard.showHidePassword.ariaLabel")}
                                        />
                                    </div>
                                    <ErrorMessage name="confirmPassword"
                                                  component="p"
                                                  className="text-red-500 text-sm"/>
                                </div>

                                <Button
                                    type="submit"
                                    buttonType="raspberry"
                                    size={"small"}
                                    text={t("userAccount.changePasswordCard.submit.text")}
                                    className="w-full py-3 px-4"
                                    children={<Lock className="w-5 h-5"/>}
                                    aria-label={t("userAccount.changePasswordCard.submit.ariaLabel")}
                                    disabled={!props.isValid || props.isSubmitting}
                                    loading={props.isSubmitting}
                                />
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        </main>
    )
}
