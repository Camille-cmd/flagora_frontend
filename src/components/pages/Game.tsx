import {SkipForward, Star, XCircle} from "lucide-react"
import Button from "../common/Button.tsx"
import Card from "../common/Card/Card.tsx"
import useWebSocket from "react-use-websocket"
import {useEffect, useReducer, useState} from "react"
import gameReducer from "../../reducers/gameReducer.tsx"
import {
    AcceptUser,
    AnswerResultMessage,
    CorrectAnswer,
    NewQuestionsMessage,
    WebsocketMessage
} from "../../interfaces/websocket.tsx"
import {useTranslation} from "react-i18next"
import {useAuth} from "../../services/auth/useAuth.tsx";
import {countryCodeEmoji} from "../../utils/common.tsx";
import {Link} from "react-router-dom";
import GuessCountryForm from "./game_modes/GuessCountryForm.tsx";
import GuessCapitalCityForm from "./game_modes/GuessCapitalCityForm.tsx";
import {GameModes} from "../../interfaces/gameModes.tsx";


interface GameProps {
    gameMode: GameModes
}

export default function Game({gameMode}: Readonly<GameProps>) {
    const {t} = useTranslation()
    const {isAuthenticated, token, cleanToken} = useAuth()
    const [state, dispatch] = useReducer(gameReducer, {
        questions: [],
        currentIndex: 0,
        currentQuestion: "",
        score: 0,
    })
    const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null)
    const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer | null>(null)
    const [isSkipping, setIsSkipping] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    const acceptUser = () => {
        // Send the user we have in storage for the backend auth
        sendJsonMessage({type: "user_accept", token: token, gameMode: gameMode})
    }

    const {sendJsonMessage, lastJsonMessage} = useWebSocket(`${import.meta.env.VITE_WS_URL}/`, {
        onOpen: acceptUser,
        shouldReconnect: () => true,
        reconnectAttempts: 10,
    })

    const handleSkip = () => {
        // Prevent multiple rapid skips or skip if questions are not ready yet
        if (isSkipping || Object.keys(state.questions).length === 0) return

        setIsSkipping(true)

        const questionId = Object.keys(state.questions)[state.currentIndex]

        // Register the skip as a false answer
        sendJsonMessage({
            type: "question_skipped",
            id: questionId,
            answer: "", // Empty answer to indicate a false answer
        })


        // Reset skipping state after a short delay
        setTimeout(() => {
            setIsSkipping(false)
        }, 500)
    }

    useEffect(() => {
        if (!lastJsonMessage) return

        const response = lastJsonMessage as WebsocketMessage

        let payload
        switch (response.type) {
            case "user_accept":
                payload = response.payload as AcceptUser
                // If we have an authenticated user but the backend has not
                // This is a problem: redirect to login
                if (!payload.is_user_authenticated && isAuthenticated) {
                    cleanToken();
                    window.location.href = "/login";
                }
                break

            case "new_questions":
                payload = response.payload as NewQuestionsMessage
                dispatch({type: "new_questions", questions: payload.questions})
                setIsLoading(false)
                break

            case "answer_result":
                payload = response.payload as AnswerResultMessage
                if (payload.isCorrect) {
                    dispatch({type: "next_question"})
                    setAnswerStatus("correct")
                    setCorrectAnswer(null) // Clear any previous correct answer

                } else {
                    setAnswerStatus("wrong")
                    // Set the correct answer if provided (yes when question is skipped)
                    if (payload.correctAnswer) {
                        setCorrectAnswer({
                            "name": payload.correctAnswer,
                            "code": countryCodeEmoji(payload.code),
                            "link": payload.wikipediaLink
                        } as CorrectAnswer)

                        // Move to next question
                        dispatch({type: "next_question"})
                    }
                }

                // Request more questions if only 2 remaining
                const remainingQuestions = Object.keys(state.questions).length - state.currentIndex - 1
                if (remainingQuestions <= 2) {
                    sendJsonMessage({
                        type: "request_questions",
                    })
                }

                // Reset answer status after short delay to allow UI to reflect color
                setTimeout(() => setAnswerStatus(null), 500)
                break
        }
    }, [lastJsonMessage])

    // Skip shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ignore keys while loading
            if (isLoading) return;

            if (e.key === "Enter" && e.shiftKey) {
                e.preventDefault();
                handleSkip();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSkipping, isLoading, state.currentIndex]);

    return (
        <div className="flex flex-col items-center justify-center p-2 md:p-6">
            <div className="w-full xl:max-w-xl">

                {isLoading && (
                    <div className="text-center text-gray-500 dark:text-gray-300 mb-4 animate-pulse">
                        {t("game.loadingQuestions")}
                    </div>
                )}

                <Card color1="yellow" color2="blue">

                    <div className="flex items-center justify-between mb-8">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center">
                            <Star className="text-green-600 mr-2"/>
                            <span className="text-gray-600 dark:text-gray-300">Score: {state.score}</span>
                        </div>
                        <Button
                            type="button"
                            buttonType="custom"
                            size={"small"}
                            className="py-2.5 mr-6 text-secondary dark:text-primary bg-neutral-50 dark:bg-darkblue-700 hover:shadow-none focus:outline-none"
                            onClick={handleSkip}
                            disabled={isSkipping || isLoading}
                            text={t("game.skip")}
                        >
                            <SkipForward className="w-5 h-5"/>
                        </Button>
                    </div>

                    {/* Correct Answer Message */}
                    {correctAnswer && (
                        <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center space-x-2">
                                <XCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"/>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <span className="font-medium">{t("game.alerts.oops")}</span> {t("game.alerts.correctAnswer")}{" "}
                                    <Link to={correctAnswer.link}
                                          target="_blank"
                                          className={"text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300"}>
                                                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                                                    {correctAnswer.name}
                                                  </span>
                                    </Link>
                                    <span className="ml-1">{correctAnswer.code}</span>
                                </p>
                            </div>
                        </div>
                    )}


                    {/* Formik Form */}
                    {gameMode === "GUESS_COUNTRY_FROM_FLAG" ? (
                        <GuessCountryForm
                            sendJsonMessage={sendJsonMessage}
                            state={state}
                            answerStatus={answerStatus}
                            correctAnswer={correctAnswer}
                            setCorrectAnswer={setCorrectAnswer}
                        />
                    ) : gameMode === "GUESS_CAPITAL_FROM_COUNTRY" ? (
                        <GuessCapitalCityForm
                            sendJsonMessage={sendJsonMessage}
                            state={state}
                            answerStatus={answerStatus}
                            correctAnswer={correctAnswer}
                            setCorrectAnswer={setCorrectAnswer}
                        />
                    ) : null}
                </Card>
            </div>
        </div>
    )
}
