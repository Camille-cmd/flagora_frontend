import {Link} from "react-router-dom"
import {Check} from "lucide-react"
import Button from "../common/Button.tsx";

export default function Register() {
    return (
        <main className="flex flex-col justify-center items-center px-4 mt-4 transition-colors duration-300">

            {/* Registration Form */}
            <div className="lg:w-96 px-10 pb-8 pt-8 rounded-lg bg-whitelight-700 dark:bg-darkblue-700">
                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-6 font-rubik">Créer un compte</h2>

                <form className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm text-secondary dark:text-primary">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full box-border p-2 rounded-lg border-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="username"
                               className="block text-sm text-secondary dark:text-primary">
                            Nom d'utilisateur
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="w-full box-border p-2 rounded-lg border-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                            placeholder="Votre nom d'utilisateur"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password"
                               className="block text-sm text-secondary dark:text-primary">
                            Mot de passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full box-border p-2 rounded-lg border-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm-password"
                               className="block text-sm text-secondary dark:text-primary">
                            Confirmer le mot de passe
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            className="w-full box-border p-2 rounded-lg border-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
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
                        onClick={() => console.log("Register clicked")}
                        aria-label="Register button"
                    />
                </form>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    Vous avez déjà un compte?{" "}
                    <Link to="/login" className="text-yellow-500 hover:text-yellow-600">
                        Connectez-vous
                    </Link>
                </p>
            </div>
        </main>
    )
}
