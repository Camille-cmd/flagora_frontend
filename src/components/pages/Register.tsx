import {Link} from "react-router-dom"
import {Check} from "lucide-react"
import Button from "../common/Button.tsx";
import Card from "../common/Card/Card.tsx";
import Input from "../common/Input.tsx";
import {FormEvent} from "react";

export default function Register() {
    const handleRegister = (event: FormEvent) => {
        event.preventDefault();
        // Handle registration logic here
        console.log("Register clicked");
    }

    return (
        <main className="flex flex-col justify-center items-center px-4 mt-4 transition-colors duration-300">

            {/* Registration Form */}
            <Card className="lg:w-96" color1="yellow" color2="blue">
                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-6 font-rubik">Créer un compte</h2>

                <form className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm text-secondary dark:text-primary">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            className="w-full box-border p-2"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="username"
                               className="block text-sm text-secondary dark:text-primary">
                            Nom d'utilisateur
                        </label>
                        <Input
                            id="username"
                            type="text"
                            className="w-full box-border p-2 "
                            placeholder="Votre nom d'utilisateur"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password"
                               className="block text-sm text-secondary dark:text-primary">
                            Mot de passe
                        </label>
                        <Input
                            id="password"
                            type="password"
                            className="w-full box-border p-2"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm-password"
                               className="block text-sm text-secondary dark:text-primary">
                            Confirmer le mot de passe
                        </label>
                        <Input
                            id="confirm-password"
                            type="password"
                            className="w-full box-border p-2"
                            placeholder="••••••••"
                        />
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
                        text={"Créer mon compte"}
                        onClick={handleRegister}
                        aria-label="Register button"
                    />
                </form>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    Vous avez déjà un compte?{" "}
                    <Link to="/login" className="text-yellow-500 hover:text-yellow-600">
                        Connectez-vous
                    </Link>
                </p>
            </Card>
        </main>
    )
}
