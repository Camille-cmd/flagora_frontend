import {SkipForward, XCircle, HelpCircle} from "lucide-react"
import Button from "../common/Button.tsx"
import Card from "../common/Card/Card.tsx"
import useWebSocket from "react-use-websocket"
import {useEffect, useReducer, useRef, useState} from "react"
import gameReducer from "../../reducers/gameReducer.tsx"
import {
    AcceptUser,
    AnswerResultMessage,
    AnswerStatusTypes,
    CorrectAnswer,
    NewQuestionsMessage,
    WebsocketMessage
} from "../../interfaces/websocket.tsx"
import {useTranslation} from "react-i18next"
import {useAuth} from "../../services/auth/useAuth.tsx";
import {Link} from "react-router-dom";
import GuessCountryMode from "./game_modes/GuessCountryMode.tsx";
import GuessCapitalCityMode from "./game_modes/GuessCapitalCityMode.tsx";
import {GameModes} from "../../interfaces/gameModes.tsx";
import Score from "../layout/Score.tsx";
import {GameLostPopup} from "../layout/GameLostPopup.tsx";
import useMobileScreen from "../../utils/useMobileScreen.tsx";
import {Tooltip} from "../common/Tooltip.tsx";
import {useGameTutorial} from "../../hooks/useGameTutorial.tsx";
import GameTutorialPopup from "../layout/useGameTutorialPopup.tsx";
import {countryCodeEmoji} from "../../utils/common.tsx";
import i18n from "i18next";

interface GameProps {
    gameMode: GameModes,
}

export default function Game({gameMode}: Readonly<GameProps>) {
    const {t} = useTranslation()
    const {isAuthenticated, token, cleanToken, user, loadingUser} = useAuth()
    const [state, dispatch] = useReducer(gameReducer, {
        questions: [],
        currentIndex: 0,
        currentQuestion: "",
        score: 0,
    })
    const {
        shouldShowTutorial,
        isLoading: tutorialLoading,
        markTutorialAsShown
    } = useGameTutorial(user, loadingUser, gameMode)
    const [showTutorial, setShowTutorial] = useState(false)
    const [answerStatus, setAnswerStatus] = useState<AnswerStatusTypes | null>(null)
    const [correctAnswer, setCorrectAnswer] = useState<CorrectAnswer[] | null>(null)
    const [isSkipping, setIsSkipping] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [gameIsLost, setGameIsLost] = useState(false);
    const [bestStreak, setBestStreak] = useState<number | null>(null);
    const [remainingToGuess, setRemainingToGuess] = useState(0);
    const flagTopElement = useRef<HTMLDivElement | null>(null);
    const isMobile = useMobileScreen();

    const acceptUser = () => {
        // Send the user we have in storage for the backend auth
        sendJsonMessage({type: "user_accept", token: token, gameMode: gameMode, language: i18n.resolvedLanguage})
    }

    const {sendJsonMessage, lastJsonMessage, getWebSocket} = useWebSocket(`${import.meta.env.VITE_WS_URL}/`, {
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

    const handleGameOverRetry = () => {
        setGameIsLost(false);
        dispatch({type: "next_question"});
        setCorrectAnswer(null);
        setAnswerStatus(null);
    }

    const handleTutorialClose = () => {
        setShowTutorial(false)
    }

    const handleNeverShowAgain = () => {
        markTutorialAsShown()
        setShowTutorial(false)
    }

    // Handle incoming messages from the backend
    useEffect(() => {
        if (!lastJsonMessage) return

        const response = lastJsonMessage as WebsocketMessage

        let payload
        switch (response.type) {
            case "user_accept":
                payload = response.payload as AcceptUser
                // If we have an authenticated user but the backend has not
                // This is a problem: redirect to login
                if (!payload.isUserAuthenticated && isAuthenticated) {
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

                setRemainingToGuess(payload.remainingToGuess);

                if (payload.isCorrect) {
                    setCorrectAnswer(null) // Clear any previous correct answer

                    // Move to the next question if all answers have been guessed
                    if (payload.remainingToGuess == 0) {
                        dispatch({type: "next_question"})
                        setAnswerStatus("correct")
                        dispatch({type: "update_score", new_streak: payload.currentStreak})
                    } else {
                        setAnswerStatus("partiallyCorrect")
                    }
                } else {
                    setAnswerStatus("wrong");

                    // Score keep track of strikes
                    dispatch({type: "update_score", new_streak: payload.currentStreak})

                    // Set the correct answer if provided (yes when question is skipped)
                    if (payload.correctAnswer.length > 0) {
                        setCorrectAnswer(payload.correctAnswer)

                        // Move to the next question only in training mode
                        if (gameMode.includes("TRAINING")) {
                            dispatch({type: "next_question"})
                        }
                    }

                    // In challenge mode, game is lost if the answer is wrong
                    if (gameMode.includes("CHALLENGE")) {
                        setGameIsLost(true);
                        setBestStreak(payload.bestStreak)
                    }

                }

                // Request more questions if only 2 remaining
                const remainingQuestions = Object.keys(state.questions).length - state.currentIndex - 1
                if (remainingQuestions <= 2) {
                    sendJsonMessage({
                        type: "request_questions"
                    })
                }

                // Reset answer status after short delay to allow UI to reflect color
                if (payload.remainingToGuess == 0) {
                    setTimeout(() => setAnswerStatus(null), 500)
                }

                // Scroll to the flag top element if on mobile
                if (isMobile) {
                    flagTopElement.current?.scrollIntoView({behavior: "smooth", block: "nearest"});
                }

                break;
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

            if (e.key === "Enter" && gameIsLost) {
                e.preventDefault();
                handleGameOverRetry();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSkipping, isLoading, state.currentIndex]);

    // Show "tutorial" popup if user has not seen it before
    useEffect(() => {
        if (!tutorialLoading && shouldShowTutorial) {
            setShowTutorial(true)
        }
    }, [tutorialLoading, shouldShowTutorial])

    // Change the language with the backend as well
    useEffect(() => {
        // In case the user changes language while the game is running, send the new language to the backend
        sendJsonMessage({type: "user_change_language", language: i18n.resolvedLanguage})
    }, [i18n.resolvedLanguage]);

    // Page Lifecycle API - reconnect WebSocket when device wakes from sleep/lock
    useEffect(() => {
        const handleFreeze = () => {
            // Device is going to sleep/lock - nothing to do here
        };

        const handleResume = () => {
            // Device woke up - check if WebSocket needs reconnection
            const ws = getWebSocket();
            if (ws && ws.readyState === WebSocket.CLOSED) {
                // Reconnect by calling acceptUser again
                acceptUser();
            }
        };

        document.addEventListener('freeze', handleFreeze);
        document.addEventListener('resume', handleResume);

        return () => {
            document.removeEventListener('freeze', handleFreeze);
            document.removeEventListener('resume', handleResume);
        };
    }, [getWebSocket, acceptUser]);


    return (
        <div className="flex flex-col items-center justify-center p-2 md:p-6">
            <div className="w-full xl:max-w-xl mb-24">

                {isLoading && (
                    <div className="text-center text-gray-500 dark:text-gray-300 mb-4 animate-pulse">
                        {t("game.loadingQuestions")}
                    </div>
                )}

                {gameMode.includes("TRAINING") && (
                    <div className="text-center text-gray-500 dark:text-gray-300 mb-4 text-xl">{t("modeSelection.cards.training")}</div>
                )}

                {/* Game Over Popup */}
                {gameIsLost && (
                    <GameLostPopup
                        score={state.score}
                        correctAnswer={correctAnswer}
                        bestStreak={bestStreak}
                        triggerNextQuestion={handleGameOverRetry}
                    />
                )}

                <Card color1="yellow" color2="blue">

                    <div ref={flagTopElement} className="flex items-center justify-between mb-8">
                        <Score score={state.score} gameMode={gameMode}/>
                        <Button
                            buttonType={"custom"}
                            children={<HelpCircle className="w-5 h-5"/>}
                            className={"text-secondary dark:text-primary bg-transparent hover:bg-transparent hover:text-gray-400 dark:hover:text-gray-600 focus:outline-none hover:shadow-none"}
                            onClick={() => setShowTutorial(true)}/>
                    </div>

                    {/* Correct Answer Message */}
                    {correctAnswer && correctAnswer.length > 0 && (
                        <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center space-x-2">
                                <XCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"/>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <span className="font-medium">{t("game.alerts.oops")}</span> {t("game.alerts.correctAnswer")}{" "}
                                    {correctAnswer.map((answer, i) => (
                                        <Link key={i} to={answer.wikipediaLink}
                                              target="_blank"
                                              className={"text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-300"}>
                                        <span className="font-semibold text-blue-900 dark:text-blue-100">
                                            {answer.name}
                                        </span>
                                            <span className="ml-1">{countryCodeEmoji(answer.code)}</span>
                                            {i < correctAnswer.length - 1 && ", "}
                                        </Link>
                                    ))}
                                </p>
                            </div>
                        </div>
                    )}

                    {answerStatus === "partiallyCorrect" && (
                        <div className="mb-4 p-2 text-center bg-amber-50 dark:bg-orange-600/60 border-l-4 border-amber-400 rounded-lg animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col space-y-2">
                                <span>{t("game.alerts.capitalsMessage")}</span>
                                <span>{t("game.alerts.remainingCapitals", {count: remainingToGuess})}</span>
                            </div>
                        </div>
                    )}


                    {/* Formik Form */}
                    {/* GCFF = Guess Country From Flag | GCFC = Guess Capital City From Country */}
                    {gameMode.includes("GCFF") ? (
                        <GuessCountryMode
                            sendJsonMessage={sendJsonMessage}
                            state={state}
                            answerStatus={answerStatus}
                            correctAnswer={correctAnswer}
                            setCorrectAnswer={setCorrectAnswer}
                        />
                    ) : gameMode.includes("GCFC") ? (
                        <GuessCapitalCityMode
                            sendJsonMessage={sendJsonMessage}
                            state={state}
                            answerStatus={answerStatus}
                            correctAnswer={correctAnswer}
                            setCorrectAnswer={setCorrectAnswer}
                        />
                    ) : null}

                    {/* On mobile, no tooltip for skip button */}
                    {isMobile ? (
                            <Button
                                data-tooltip-target="tooltip-default"
                                type="button"
                                buttonType="custom"
                                className="py-2.5 w-full text-secondary dark:text-primary bg-neutral-50 dark:bg-darkblue-700 hover:shadow-none focus:outline-none"
                                onClick={handleSkip}
                                disabled={isSkipping || isLoading}
                                text={t("game.skip")}
                            >
                                <SkipForward className="w-5 h-5"/>
                            </Button>
                        ) :
                        <Tooltip message={t("game.skipTooltip")}>
                            <Button
                                data-tooltip-target="tooltip-default"
                                type="button"
                                buttonType="custom"
                                className="py-2.5 w-full text-secondary dark:text-primary bg-neutral-50 dark:bg-darkblue-700 hover:shadow-none focus:outline-none"
                                onClick={handleSkip}
                                disabled={isSkipping || isLoading}
                                text={t("game.skip")}
                            >
                                <SkipForward className="w-5 h-5"/>
                            </Button>
                        </Tooltip>
                    }

                </Card>
            </div>

            {/* Tutorial Popup */}
            {showTutorial && (
                <GameTutorialPopup
                    gameMode={gameMode}
                    onClose={handleTutorialClose}
                    onNeverShowAgain={handleNeverShowAgain}
                />
            )}
        </div>
    )
}
