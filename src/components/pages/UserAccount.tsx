import {FormEvent, useState} from "react"
import {Eye, EyeOff, Lock, Mail, Save, User, UserCircle} from "lucide-react"
import Alert from "../common/Alert.tsx"
import {PageTitle} from "../common/PageTitle.tsx";
import Button from "../common/Button.tsx";
import Input from "../common/Input.tsx";
import Card from "../common/Card/Card.tsx";
import {CardHeader} from "../common/Card/CardHeader.tsx";

export default function UserAccount() {
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [alertInfo, setAlertInfo] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
        show: false,
        type: "success",
        message: "",
    })

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        // Simulate successful update
        setAlertInfo({
            show: true,
            type: "success",
            message: "Vos informations ont été mises à jour avec succès.",
        })
    }

    return (
        <main className="flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">

                {/* Page Title */}
                <PageTitle title={"Mon Compte"}/>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Gérez vos informations personnelles et votre mot de passe
                </p>

                {/* Alert for feedback */}
                {alertInfo.show && (
                    <div className="mb-6">
                        <Alert
                            type={alertInfo.type}
                            title={alertInfo.type === "success" ? "Succès!" : "Erreur"}
                            message={alertInfo.message}
                            timeout={2}
                            onDismiss={() => setAlertInfo((prev) => ({...prev, show: false}))}
                        />
                    </div>
                )}

                {/* Account Settings Card */}
                <Card className="mb-8" color1="blue" color2="yellow">
                    {/* En-tête de la carte */}
                    <CardHeader
                        className="mb-6"
                        title={"Informations Personnelles"}
                        icon={
                            <div className="p-3 bg-white dark:bg-blue-800 rounded-full shadow-md mr-4">
                                <User className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                            </div>}>
                    </CardHeader>

                    {/* Corps de la carte */}
                    {/* Form for Personal Information */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label htmlFor="username"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nom d'utilisateur
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    defaultValue="JoueurPro123"  // TODO Replace with actual username
                                    className="w-full p-3 pl-10"
                                />

                                <div className="absolute left-3 start-2 top-3.5 text-gray-400">
                                    <UserCircle className="w-5 h-5"/>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ce nom sera visible par les autres joueurs</p>
                        </div>

                        {/* Email Field (Read-only) */}
                        <div className="space-y-2">
                            <label htmlFor="email"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    defaultValue="utilisateur@exemple.com"
                                    readOnly
                                    disabled={true}
                                    className="w-full p-3 pl-10 "
                                    icon={<Mail className="w-5 h-5"/>}
                                    aria-label={"Email"}
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Pour changer votre email, veuillez contacter le support
                            </p>
                        </div>

                        {/* Save Button for Personal Info */}
                        <Button
                            type={"submit"}
                            buttonType={"info"}
                            size={"small"}
                            text={"Sauvegarder les modifications"}
                            className={"w-full py-3 px-4 mt-4"}
                            children={<Save className="w-5 h-5"/>}
                            aria-label={"Sauvegarder les modifications"}
                        />
                    </form>
                </Card>

                {/* Password Change Card */}
                <Card color1="pink" color2="blue">
                    <CardHeader
                        className="mb-6"
                        title={"Changer le mot de passe"}
                        icon={
                            <div className="p-3 bg-white dark:bg-raspberry-800 rounded-full shadow-md mr-4">
                                <Lock className="w-6 h-6 text-raspberry-600 dark:text-raspberry-400"/>
                            </div>
                        }>
                    </CardHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="current-password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Mot de passe actuel
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="current-password"
                                    name="current-password"
                                    className="w-full p-3 pl-10 pr-10"
                                    icon={<Lock className="w-5 h-5"/>}
                                    placeholder={"Entrez votre mot de passe actuel"}
                                    aria-label={"Mot de passe actuel"}
                                />
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
                        </div>

                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="new-password"
                                   className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <Input
                                    className="w-full p-3 pl-10 pr-10"
                                    id="new-password"
                                    name="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    icon={<Lock className="w-5 h-5"/>}
                                    placeholder={"Entrez votre nouveau mot de passe"}
                                    aria-label={"Nouveau mot de passe"}
                                />
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Confirmer le nouveau mot de passe
                            </label>
                            <div className="relative">
                                <Input
                                    className="w-full p-3 pl-10 pr-10"
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-password"
                                    name="confirm-password"
                                    icon={<Lock className="w-5 h-5"/>}
                                    placeholder={"Confirmez votre nouveau mot de passe"}
                                    aria-label={"Confirmer le mot de passe"}
                                />
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
                        </div>

                        {/* Save Button for Password Change */}
                        <Button
                            type={"submit"}
                            buttonType={"raspberry"}
                            size={"small"}
                            text={"Mettre à jour le mot de passe"}
                            className={"w-full py-3 px-4"}
                            children={<Lock className="w-5 h-5"/>}
                            aria-label={"Mettre à jour le mot de passe"}
                        />
                    </form>
                </Card>

            </div>
        </main>
    )
}
