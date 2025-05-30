"use client"

import {Flag, Send, SkipForward, Star, XCircle} from "lucide-react"
import Button from "../common/Button.tsx"
import Card from "../common/Card/Card.tsx"
import useWebSocket from "react-use-websocket"
import {useEffect, useReducer, useState} from "react"
import {Form, Formik, type FormikHelpers} from "formik"
import gameReducer from "../../reducers/gameReducer.tsx"
import type {AnswerResultMessage, NewQuestionsMessage, WebsocketMessage} from "../../interfaces/websocket.tsx"
import {useTranslation} from "react-i18next"
import SearchBar from "../common/SearchBar.tsx"
import CountryService from "../../services/CountryService.tsx"
import type {Country} from "../../interfaces/country.tsx"

export default function Game() {
    const {t} = useTranslation()
    const [state, dispatch] = useReducer(gameReducer, {
        questions: [],
        currentIndex: 0,
        currentQuestion: "",
        score: 0,
    })
    const [countries, setCountries] = useState<Country[]>([])
    const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null)
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
    const [isSkipping, setIsSkipping] = useState(false)

    const {sendJsonMessage, lastJsonMessage} = useWebSocket(`${import.meta.env.VITE_WS_URL}/`, {
        shouldReconnect: () => true,
        reconnectAttempts: 10,
    })

    const handleSubmit = (values: { answer: string }, actions: FormikHelpers<{ answer: string }>) => {
        const questionId = Object.keys(state.questions)[state.currentIndex]
        sendJsonMessage({
            type: "answer_submission",
            id: questionId,
            answer: values.answer,
        })

        actions.resetForm()
    }

    const handleSkip = () => {
        // Prevent multiple rapid skips
        if (isSkipping) return

        setIsSkipping(true)

        const questionId = Object.keys(state.questions)[state.currentIndex]

        // Register the skip as a false answer
        sendJsonMessage({
            type: "question_skipped",
            id: questionId,
            answer: "", // Empty answer to indicate a false answer
        })

        // Move to next question
        dispatch({type: "next_question"})

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
            case "new_questions":
                payload = response.payload as NewQuestionsMessage
                dispatch({type: "new_questions", questions: payload.questions})
                break

            case "answer_result":
                payload = response.payload as AnswerResultMessage
                if (payload.isCorrect) {
                    dispatch({type: "next_question"})
                    setAnswerStatus("correct")
                    setCorrectAnswer(null) // Clear any previous correct answer

                    // Request more questions if only 2 remaining
                    const remainingQuestions = Object.keys(state.questions).length - state.currentIndex - 1
                    if (remainingQuestions <= 2) {
                        sendJsonMessage({
                            type: "request_questions",
                        })
                    }
                } else {
                    setAnswerStatus("wrong")
                    // Set the correct answer if provided (yes when question is skipped)
                    if (payload.correctAnswer) {
                        setCorrectAnswer(payload.correctAnswer)
                    }
                }

                // Reset answer status after short delay to allow UI to reflect color
                setTimeout(() => setAnswerStatus(null), 500)
                break
        }
    }, [lastJsonMessage])

    // on mount
    useEffect(() => {
        CountryService.getCountries().then((countries) => {
            setCountries(countries)
        })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center p-2 md:p-6">
            <div className="w-full xl:max-w-xl">
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
                            disabled={isSkipping || countries.length === 0}
                            text={t("game.skip")}
                        >
                            <SkipForward className="w-5 h-5"/>
                        </Button>
                    </div>

                    {/* Flag Image */}
                    <div className="relative">
                        <div className="mb-6 relative w-full h-56 flex items-center justify-center">
                            {state.currentQuestion ? (
                                <img
                                    src={`data:image/svg+xml;utf8,${encodeURIComponent(state.currentQuestion)}`}
                                    alt="Flag"
                                    className="max-w-[120%] md:max-w-full max-h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500">
                                    <Flag className="w-16 h-16"/>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Formik Form */}
                    <Formik initialValues={{answer: ""}} onSubmit={handleSubmit}>
                        {({values, setFieldValue, submitForm}) => (
                            <Form className="space-y-4 lg:mt-10 md:px-8 pb-4 md:pb-0">
                                {/* Correct Answer Message */}
                                {correctAnswer && (
                                    <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg animate-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center space-x-2">
                                            <XCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"/>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                <span className="font-medium">{t("game.alerts.oops")}</span> {t("game.alerts.correctAnswer")}{" "}
                                                <span className="font-semibold text-blue-900 dark:text-blue-100">{correctAnswer}</span>
                                                <span className="ml-1">🤔</span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {countries.length === 0 ? (
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <SearchBar
                                            value={values.answer}
                                            onChange={(value) => {
                                                setFieldValue("answer", value)
                                                // Clear correct answer message when user starts typing
                                                if (correctAnswer && value.length > 0) {
                                                    setCorrectAnswer(null)
                                                }
                                            }}
                                            onSubmit={submitForm}
                                            placeholder={t("game.answer.placeholder")}
                                            options={countries}
                                            className={`w-full p-4 pl-5 pr-12 ${
                                                answerStatus === "correct"
                                                    ? "bg-green-300 dark:bg-green-900/90"
                                                    : answerStatus === "wrong"
                                                        ? "bg-red-600 dark:bg-red-900/90 shake"
                                                        : ""
                                            }`}
                                        />
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Button
                                        type="submit"
                                        buttonType="primary"
                                        className="w-full py-3"
                                        text={t("game.submit")}
                                        disabled={countries.length === 0}
                                    >
                                        <Send className="w-5 h-5"/>
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        </div>
    )
}
