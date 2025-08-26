import {Info, X} from "lucide-react"
import {useTranslation} from "react-i18next"
import {GameModes} from "../../interfaces/gameModes.tsx";
import Button from "../common/Button.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";

interface GameTutorialPopupProps {
    gameMode: GameModes
    onClose: () => void
    onNeverShowAgain: () => void
}


/*
*Popup to display a tutorial for a specific game mode.
*
* @param {gameMode} gameMode - The game mode for which to display the tutorial.
* onClose - Callback function to close the popup.
* onNeverShowAgain - Callback function to mark the tutorial as never shown.
 */
export default function GameTutorialPopup({gameMode, onClose, onNeverShowAgain}: GameTutorialPopupProps) {
    const {t} = useTranslation()
    const {updateUserPreferences, isAuthenticated} = useAuth();

    const content: Record<GameModes, {
        title: string
        description: string
    }> = {
        "GCFF_TRAINING_INFINITE": {
            title: t("tutorial.flags.training_infinite.title"),
            description: t("tutorial.flags.training_infinite.description"),
        },
        "GCFF_CHALLENGE_COMBO": {
            title: t("tutorial.flags.challenge.title"),
            description: t("tutorial.flags.challenge.description"),
        },
        "GCFC_TRAINING_INFINITE": {
            title: t("tutorial.capitals.training_infinite.title"),
            description: t("tutorial.capitals.training_infinite.description"),
        },
        "GCFC_CHALLENGE_COMBO": {
            title: t("tutorial.capitals.challenge.title"),
            description: t("tutorial.capitals.challenge.description"),
        },
    }


    const handleNeverShow = async () => {
        try {
            // Save to localStorage
            localStorage.setItem(`flagora_tutorial_shown_${gameMode}`, "true")
            if (isAuthenticated) {
                await updateUserPreferences(false, gameMode)
            }

            onNeverShowAgain();

        } catch (error) {
            onNeverShowAgain() // Still close the popup
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>

            <div className="relative mx-auto w-full max-w-sm sm:max-w-sm md:max-w-lg lg:max-w-2xl
                rounded-2xl bg-white dark:bg-darkblue-600 p-6 sm:p-8 shadow-2xl
                max-h-[90vh] overflow-y-auto">
                <Button
                    buttonType="raspberry"
                    onClick={onClose}
                    children={<X className="w-6 h-6"/>}
                    className="absolute top-6 right-6"
                >
                </Button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 bg-raspberry-600 rounded-full flex items-center justify-center">
                            <Info className="w-6 h-6 sm:w-8 sm:h-8 text-white"/>
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-2xl font-extrabold text-secondary dark:text-primary mb-2">{t("tutorial.title")}</h2>
                </div>


                {/* Content depending on game mode */}
                <div className="mb-8 text-md md:text-xl">
                    <h3 className="text-sm md:text-xl font-bold text-center text-secondary dark:text-primary mb-4">
                        {content[gameMode].title}
                    </h3>

                    <p className="text-sm md:text-xl text-center text-gray-600 dark:text-gray-300 mb-6">{content[gameMode].description}</p>
                </div>


                <div className="text-sm md:text-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg px-4 py-2 mb-6">
                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2">💡 {t("tutorial.note.title")}</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li> {t("tutorial.note.note1")}</li>
                        <li> {t("tutorial.note.note2")}</li>
                        {gameMode.includes("GCFF")
                            ? <li> {t("tutorial.note.flags.note1")}</li>
                            : <li> {t("tutorial.note.capitals.note1")}</li>
                        }
                    </ul>
                </div>


                {/* Navigation Buttons */}
                <div className="flex justify-center items-center">
                    <div className="flex space-x-3">
                        <Button
                            buttonType="raspberry"
                            text={t("tutorial.neverShowAgain")}
                            onClick={handleNeverShow}
                            className="px-4 py-2 text-sm"
                        >
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
