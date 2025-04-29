import {Link} from "react-router-dom";
import {AlertTriangle, Flag, MapPin} from "lucide-react";

export default function ModeSelection() {
    return (
        <div className="flex flex-col items-center justify-center p-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-secondary dark:text-primary mb-6">Sélectionnez un mode</h1>

            {/* Warning */}
            <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 w-full max-w-md">
                <AlertTriangle className="w-6 h-6 mr-3"/>
                <p className="text-sm text-foreground">
                    Vous jouez en tant qu'invité.{" "}
                    <Link to="/register" className="font-medium underline-yellow-500">
                        Créez un compte
                    </Link>{" "}
                    pour sauvegarder votre progression.
                </p>
            </div>

            {/* Mode Selection Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Drapeau Card */}
                <Link
                    to="/game"
                    className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-yellow-50 hover:border-y-amber-400 transition transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <Flag className="w-12 h-12 text-blue-500 mr-4"/>
                        <div>
                            <h2 className="text-xl font-semibold text-secondary">Drapeau</h2>
                            <p className="text-gray-500">Devinez les drapeaux avec précision.</p>
                        </div>
                    </div>
                </Link>

                {/* Villes Card */}
                <Link
                    to="/game"
                    className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1">
                    <div className="flex items-center">
                        <MapPin className="w-12 h-12 text-green-500 mr-4"/>
                        <div>
                            <h2 className="text-xl font-semibold text-secondary">Villes</h2>
                            <p className="text-gray-500">Testez vos connaissances sur les villes.</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
