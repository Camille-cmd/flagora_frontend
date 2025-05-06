import {Link} from "react-router-dom"
import Button from "../common/Button.tsx";

/*
 * Login Form
*/
export default function Login() {
    return (
        <main className="flex flex-col justify-center items-center px-4 mt-20 transition-colors duration-300">

            <div className="lg:w-96 px-10 pt-8 pb-20 rounded-lg bg-whitelight-700 dark:bg-darkblue-700">

                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-8 font-rubik">Connexion</h2>

                {/* Login Form */}
                <form className="space-y-8">

                    {/* EMAIL */}
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

                    {/* PASSWORD */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm text-secondary dark:text-primary">
                                Mot de passe
                            </label>
                            <Link to="/forgot-password"
                                  className="text-xs text-yellow-500 hover:text-yellow-600">
                                Mot de passe oublié?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            className="w-full box-border p-2 rounded-lg border-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        buttonType="primary"
                        className="w-full px-5 py-2.5 mt-20"
                        text={"Se connecter"}
                        onClick={() => console.log("Login clicked")}
                        aria-label="Login button"
                    />

                </form>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    Vous n'avez pas de compte?{" "}
                    <Link to="/register" className="text-yellow-500 hover:text-yellow-600">
                        Créez-en un
                    </Link>
                </p>
            </div>
        </main>
    )
}
