import {useState} from "react";
import {Eye, EyeOff, Lock, Mail, Save, User, UserCircle} from "lucide-react";
import {PageTitle} from "../common/PageTitle";
import Card from "../common/Card/Card";
import {CardHeader} from "../common/Card/CardHeader";
import Button from "../common/Button";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import Input from "../common/Input.tsx";
import {useAlert} from "../../contexts/AlertContext.tsx";
import {AlertInfo} from "../../interfaces/alert.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";

export default function UserAccount() {
    const {user} = useAuth();
    const {setAlertInfo} = useAlert();

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation schemas for Formik
    const personalInfoSchema = Yup.object({
        username: Yup.string().required("Nom d'utilisateur est requis"),
    });

    const passwordSchema = Yup.object({
        currentPassword: Yup.string().required("Mot de passe actuel requis"),
        newPassword: Yup.string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères")
            .matches(/[A-Z]/, "Au moins une majuscule")
            .matches(/\d/, "Au moins un chiffre")
            .matches(/[^a-zA-Z\d]/, "Au moins un caractère spécial")
            .required("Nouveau mot de passe requis"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Les mots de passe doivent correspondre")
            .required("Confirmation du mot de passe requise"),
    });

    const handlePersonalInfoSubmit = (values: { username: string }) => {
        setAlertInfo({
            type: "success",
            message: "Vos informations personnelles ont été mises à jour avec succès.",
        } as AlertInfo);
        console.log("Personal info updated:", values);
    };

    const handlePasswordSubmit = (values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string
    }) => {
        setAlertInfo({
            type: "success",
            message: "Votre mot de passe a été mis à jour avec succès.",
        } as AlertInfo);
        console.log("Password updated:", values);
    };

    return (
        <main className="flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Page Title */}
                <PageTitle title={"Mon Compte"}/>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Gérez vos informations personnelles et votre mot de passe
                </p>

                {/* Personal Information Form */}
                <Card className="mb-8" color1="blue" color2="yellow">
                    <CardHeader
                        className="mb-6"
                        title={"Informations Personnelles"}
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
                                email: user.email
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
                                            Nom d'utilisateur
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={props.values.username || ""}
                                                as={Input}
                                                className="w-full p-3 pl-10"
                                                aria-label="Nom d'utilisateur"
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
                                            Email
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
                                            />
                                            <div className="absolute left-3 top-3 text-gray-400">
                                                <Mail className="w-5 h-5"/>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Pour changer votre email, veuillez contacter le support
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        buttonType="info"
                                        size={"small"}
                                        text="Sauvegarder les modifications"
                                        className="w-full py-3 px-4"
                                        children={<Save className="w-5 h-5"/>}
                                        aria-label="Sauvegarder les modifications"
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
                        title={"Changer le mot de passe"}
                        icon={
                            <div className="p-3 bg-white dark:bg-raspberry-800 rounded-full shadow-md mr-4">
                                <Lock className="w-6 h-6 text-raspberry-600 dark:text-raspberry-400"/>
                            </div>
                        }
                    />
                    <Formik
                        initialValues={{
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                        }}
                        validationSchema={passwordSchema}
                        onSubmit={handlePasswordSubmit}
                    >
                        {() => (
                            <Form className="space-y-6">
                                {/* Current Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="currentPassword"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mot de passe actuel
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            as={Input}
                                            className="w-full p-3 pl-10"
                                            placeholder="Entrez votre mot de passe actuel"
                                        />
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                        <Button
                                            type={"button"}
                                            buttonType={"custom"}
                                            size={"small"}
                                            className={"absolute right-3 top-2.5 text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-darkblue-600"}
                                            onClick={() => setShowPassword(!showNewPassword)}
                                            children={showPassword ? <Eye className="w-5 h-5"/> :
                                                <EyeOff className="w-5 h-5"/>}
                                            aria-label={"Afficher/Masquer le mot de passe"}
                                        />
                                    </div>
                                    <ErrorMessage name="currentPassword"
                                                  component="p"
                                                  className="text-red-500 text-sm"/>
                                </div>

                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="newPassword"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nouveau mot de passe
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showNewPassword ? "text" : "password"}
                                            id="newPassword"
                                            name="newPassword"
                                            as={Input}
                                            className="w-full p-3 pl-10"
                                            placeholder="Entrez votre nouveau mot de passe"
                                        />
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                        <Button
                                            type={"button"}
                                            buttonType={"custom"}
                                            size={"small"}
                                            className={"absolute right-3 top-2.5 text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-darkblue-600"}
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            children={showNewPassword ? <Eye className="w-5 h-5"/> :
                                                <EyeOff className="w-5 h-5"/>}
                                            aria-label={"Afficher/Masquer le mot de passe"}
                                        />
                                    </div>
                                    <ErrorMessage name="newPassword" component="p" className="text-red-500 text-sm"/>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword"
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="relative">
                                        <Field
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            as={Input}
                                            className="w-full p-3 pl-10 pr-10"
                                            placeholder="Confirmez votre nouveau mot de passe"
                                        />
                                        <div className="absolute left-3 top-3 text-gray-400">
                                            <Lock className="w-5 h-5"/>
                                        </div>
                                        <Button
                                            type={"button"}
                                            buttonType={"custom"}
                                            size={"small"}
                                            className={"absolute right-3 top-2.5 text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 bg-white dark:bg-darkblue-600"}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            children={showConfirmPassword ? <Eye className="w-5 h-5"/> :
                                                <EyeOff className="w-5 h-5"/>}
                                            aria-label={"Afficher/Masquer le mot de passe"}
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
                                    text="Mettre à jour le mot de passe"
                                    className="w-full py-3 px-4"
                                    children={<Lock className="w-5 h-5"/>}
                                />
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        </main>
    );
}
