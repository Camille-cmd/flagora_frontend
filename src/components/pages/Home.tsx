import {Link} from "react-router-dom"
import {KeyRound, UserRoundPlus} from "lucide-react";
import {useAuth} from "../../services/auth/useAuth.tsx";
import {useTranslation} from "react-i18next";

export default function Home() {
    const {isAuthenticated} = useAuth();
    const {t} = useTranslation()

    return (

        <main className="flex-1 flex flex-col items-center justify-center p-2 text-center mt-24">
            <div className="mb-8">
                <div className="flex items-center justify-center mb-2">
                    <h1 className="text-5xl font-bold ml-3 transition-colors duration-300 font-rubik">
                        Flagora
                    </h1>
                </div>
                <p className="text-lg mt-2 transition-colors duration-300">
                    {t("home.welcomeMessage")}
                </p>
            </div>

            <div className="space-y-4 w-full max-w-xs">
                <Link
                    to="/mode-selection"
                    className="block w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-secondary dark:text-gray-200 font-medium rounded-lg text-center transition-colors no-underline"
                >
                    {t("home.play")}
                </Link>

                {!isAuthenticated &&
                    <>
                    <Link
                        to="/login"
                        className="w-full py-3  bg-darkblue-600 dark:bg-raspberry-700 hover:bg-darkblue-700 dark:hover:bg-raspberry-600 text-primary dark:text-gray-200 font-medium rounded-lg text-center flex items-center justify-center transition-colors duration-300 no-underline"
                    >
                        <span className="mr-2"><KeyRound/></span>
                        {t("home.connection")}
                    </Link>

                    <Link
                        to="/register"
                        className="w-full py-3 dark:bg-gray-700 dark:text-gray-400 border border-solid border-darkblue-600 text-secondary font-medium rounded-lg text-center flex items-center justify-center transition-colors duration-300 no-underline"
                    >
                        <span className="mr-2"><UserRoundPlus/></span>
                        {t("home.createAccount")}
                    </Link>
                    </>
                }
            </div>

        </main>
    )
}
