import {Flag, Send, Star} from "lucide-react"
import Alert from "../common/Alert.tsx";
import {useState} from "react";
import Button from "../common/Button.tsx";
import Card from "../common/Card/Card.tsx";
import {CardHeader} from "../common/Card/CardHeader.tsx";
import Input from "../common/Input.tsx";

export default function FlagsGame() {
    const [showAlert, setShowAlert] = useState(false)

    const handleSubmit = () => {
        // Handle form submission logic here
        setShowAlert(true)
    }

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
                <Card color1="yellow" color2="blue">

                    <div className="relative p-8">

                        <CardHeader
                            className="mb-6"
                            title={"Quel est ce pays?"}
                            icon={
                                <div className="p-3 bg-white dark:bg-blue-800 rounded-full shadow-md mr-4">
                                    {/*TODO : icon depends on the game mode*/}
                                    <Flag className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                                </div>
                            }>
                        </CardHeader>

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
                                <Input
                                    type="text"
                                    className="w-full p-4 pl-5 pr-12"
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
                                onClick={handleSubmit}
                            />
                        </form>
                    </div>
                </Card>

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
