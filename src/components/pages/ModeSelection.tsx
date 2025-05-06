import { Link } from "react-router-dom"
import { AlertTriangle, Flag, MapPin } from "lucide-react"
import { PageTitle } from "../common/PageTitle.tsx"

export default function ModeSelection() {
  const is_authenticated = true // Replace with actual authentication check

  return (
    <main className="flex flex-col items-center justify-center p-6">
      {/* Title */}
      <PageTitle title={"Sélectionnez un mode"} />

      {/* Warning */}
      {!is_authenticated && (
        <div className="p-4 mb-10 w-full max-w-md flex items-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 shadow-sm">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <p className="text-sm">
            Vous jouez en tant qu'invité.{" "}
            <Link
              to="/register"
              className="font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline underline-offset-2"
            >
              Créez un compte
            </Link>{" "}
            pour sauvegarder votre progression.
          </p>
        </div>
      )}

      {/* Mode Selection Cards */}
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl w-full">
        {/* Flag Card */}
        <Link
          to="/game"
          className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl no-underline bg-neutral-50 dark:bg-darkblue-700 transition-all duration-300 hover:scale-105 transform"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-700/70 rounded-full -mr-16 -mt-16 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200 dark:bg-yellow-300/70 rounded-full -ml-12 -mb-12 opacity-70"></div>

          <div className="relative p-8 mb-8 flex flex-col items-center text-center t">
            <div className="mb-4 p-3 bg-white dark:bg-blue-800 rounded-full shadow-md">
              <Flag className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2">Drapeau</h2>
            <p className="text-gray-600 dark:text-gray-300">Devinez les drapeaux avec précision.</p>
          </div>
        </Link>

        {/* Cities Card */}
        <Link
          to="/game"
          className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl no-underline bg-neutral-50 dark:bg-darkblue-700 transition-all duration-300 hover:scale-105 transform"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-700/70 rounded-full -mr-16 -mt-16 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200 dark:bg-yellow-300/70 rounded-full -ml-12 -mb-12 opacity-70"></div>

          <div className="relative p-8 mb-8 flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-white dark:bg-green-800 rounded-full shadow-md">
              <MapPin className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2">Villes</h2>
            <p className="text-gray-600 dark:text-gray-300">Testez vos connaissances sur les villes.</p>
          </div>
        </Link>
      </div>
    </main>
  )
}
