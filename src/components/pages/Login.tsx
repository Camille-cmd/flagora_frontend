import {Link} from "react-router-dom"
import Button from "../common/Button.tsx";
import Card from "../common/Card/Card.tsx";
import Input from "../common/Input.tsx";
import {FormEvent} from "react";

/*
 * Login Form
*/
export default function Login() {
    const handleLogin = (event: FormEvent) => {
        event.preventDefault();
        // Handle login logic here
        console.log("Login clicked");
    }

    return (
        <main className="flex flex-col justify-center items-center px-4 mt-20 transition-colors duration-300">

            <Card className="lg:w-96" color1="yellow" color2="blue">

                <h2 className="text-2xl lg:text-4xl text-center font-bold text-secondary dark:text-primary mb-8 font-rubik">Connexion</h2>

                {/* Login Form */}
                <form className="space-y-8">

                    {/* EMAIL */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm text-secondary dark:text-primary">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            className="w-full p-2"
                            placeholder="votre@email.com"
                            aria-label="Email input"
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
                        <Input
                            id="password"
                            type="password"
                            className="w-full box-border p-2"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        buttonType="primary"
                        className="w-full px-5 py-2.5 mt-20"
                        text={"Se connecter"}
                        onClick={handleLogin}
                        aria-label="Login button"
                    />

                </form>

                <p className="mt-6 text-center text-sm text-secondary dark:text-whitelight-700 transition-colors">
                    Vous n'avez pas de compte?{" "}
                    <Link to="/register" className="text-yellow-500 hover:text-yellow-600">
                        Créez-en un
                    </Link>
                </p>
            </Card>
        </main>
    )
}
