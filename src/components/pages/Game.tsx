import {Flag, Send, Star} from "lucide-react"
import Alert from "../common/Alert.tsx";
import {useState} from "react";
import Button from "../common/Button.tsx";

export default function FlagsGame() {
    const [showAlert, setShowAlert] = useState(false)

    return (
        <main className="flex flex-col items-center justify-center p-2">

            {/* Alert display */}
            {showAlert &&
                <Alert
                    type="error"
                    title="Success!"
                    message="Your changes have been saved successfully."
                    timeout={1}
                    onDismiss={() => setShowAlert(false)}
                    className={"mb-6"}
                />
            }

            {/* Game - Quiz View (Flags) */}
            <div className="w-full max-w-xl">

                {/* Game Card */}
                <div className="relative overflow-hidden bg-neutral-50 dark:bg-darkblue-700 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800">

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 dark:bg-blue-700/70 rounded-full -mr-20 -mt-20 opacity-70"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200 dark:bg-yellow-300/70 rounded-full -ml-16 -mb-16 opacity-70"></div>

                    <div className="relative p-8">
                        {/* Header with icon */}
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-white dark:bg-blue-800 rounded-full shadow-md mr-4">
                                {/*TODO : icon depends on the game mode*/}
                                <Flag className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                            </div>
                            <h2 className="text-2xl font-bold text-secondary dark:text-primary">Quel est ce pays?</h2>
                        </div>

                        {/* Flag Image */}
                        <div className="mb-8 transform transition-all duration-300 hover:scale-[1.02] relative">
                            <div className="relative w-full h-64 border-4 border-white dark:border-gray-700 rounded-lg overflow-hidden shadow-md">
                                <img
                                    src="https://placehold.co/1280x720"
                                    alt="Drapeau"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                        </div>

                        {/* Input Form */}
                        <form className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-4 pl-5 pr-12 box-border border-1 border-blue-200 dark:border-blue-900 bg-white dark:bg-darkblue-600 text-secondary dark:text-primary rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-700 outline-none transition-all duration-300"
                                    placeholder="Entrez le nom du pays"
                                />
                            </div>

                            <Button
                                type="button"
                                buttonType="primary"
                                className="w-full py-4 px-6"
                                text={"Valider"}
                                children={
                                    <Send className="w-5 h-5"/>
                                }
                                onClick={() => setShowAlert(true)}
                            />
                        </form>
                    </div>
                </div>

                {/* Score Card */}
                <div className="mt-6 p-4 bg-white dark:bg-darkblue-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                            <Star className="text-green-600"/>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Score: 0</span>
                    </div>
                </div>
            </div>
        </main>
    )
}
