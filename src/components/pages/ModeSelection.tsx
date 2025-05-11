import {Link} from "react-router-dom"
import {Flag, MapPin} from "lucide-react"
import {PageTitle} from "../common/PageTitle.tsx"
import Alert from "../common/Alert.tsx";
import Card from "../common/Card/Card.tsx";
import {useAuthContext} from "../../services/auth/AuthContext.tsx";

export default function ModeSelection() {
    const {isAuthenticated} = useAuthContext();

    return (
        <main className="flex flex-col items-center justify-center p-6">
            {/* Title */}
            <PageTitle title={"Sélectionnez un mode"}/>

            {/* Warning */}
            {!isAuthenticated && (
                <div className="p-4 mb-10 w-full max-w-md">
                    <Alert
                        type="warning"
                        title="Attention"
                        dismissible={true}
                        message={
                            <>
                                Vous jouez en tant qu'invité.{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline underline-offset-2"
                                >
                                    Créez un compte
                                </Link>{" "}
                                pour sauvegarder votre progression.
                            </>
                        }
                    />
                </div>
            )}

            {/* Mode Selection Cards */}
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl w-full">
                {/* Flag Card */}
                <Link to="/game" className="group relative overflow-hidden no-underline rounded-xl shadow-lg hover:shadow-xl">
                    <Card color1="blue" color2="yellow">
                        <div className="p-3 mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-white dark:bg-blue-800 rounded-full shadow-md">
                                <Flag className="w-10 h-10 text-blue-600 dark:text-blue-400"/>
                            </div>
                            <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2">Drapeau</h2>
                            <p className="text-gray-600 dark:text-gray-300">Devinez les drapeaux avec précision.</p>
                        </div>
                    </Card>
                </Link>

                {/* Cities Card */}
                <Link to="/game" className="group relative overflow-hidden no-underline rounded-xl shadow-lg hover:shadow-xl">
                    <Card color1="green" color2="raspberry">
                        <div className="p-3 mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-white dark:bg-green-800 rounded-full shadow-md">
                                <MapPin className="w-10 h-10 text-green-600 dark:text-green-400"/>
                            </div>
                            <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2">Villes</h2>
                            <p className="text-gray-600 dark:text-gray-300">Testez vos connaissances sur les villes.</p>
                        </div>
                    </Card>
                </Link>
            </div>
        </main>
    )
}
