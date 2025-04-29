import { Link } from "react-router-dom"
import { Check } from "lucide-react"

export default function Register() {
  return (
    <div className="bg-whitelight-700 dark:bg-darkblue-700 flex flex-col transition-colors duration-300">

      {/* Registration Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-6">Créer un compte</h2>

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-secondary dark:text-primary">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary rounded-lg focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-secondary dark:text-primary">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary rounded-lg focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-secondary dark:text-primary">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary rounded-lg focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-secondary dark:text-primary">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary rounded-lg focus:ring-2 focus:ring-raspberry-600 focus:border-transparent outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-secondary dark:text-primary">Règles du mot de passe</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Au moins 8 caractères
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Au moins une lettre majuscule
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Au moins un chiffre
                </li>
                <li className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  Au moins un caractère spécial
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-600 text-primary dark:text-secondary  border-y-amber-400 font-medium rounded-lg transition-colors mt-4"
            >
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-700 font-medium">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
