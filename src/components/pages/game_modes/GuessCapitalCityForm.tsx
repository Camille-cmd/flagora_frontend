import {Globe, Send} from "lucide-react";
import {Form, Formik, type FormikHelpers} from "formik";
import SearchBar from "../../common/SearchBar.tsx";
import Button from "../../common/Button.tsx";
import {useEffect, useState} from "react";
import type {City} from "../../../interfaces/city.tsx";
import GameService from "../../../services/GameService.tsx";
import type {GameState} from "../../../reducers/gameReducer.tsx"
import {CorrectAnswer} from "../../../interfaces/websocket.tsx";
import {useTranslation} from "react-i18next";

interface GuessCapitalCityFormProps {
    sendJsonMessage: (message: any) => void,
    state: GameState,
    answerStatus: "correct" | "wrong" | null,
    correctAnswer: CorrectAnswer | null,
    setCorrectAnswer: (correctAnswer: CorrectAnswer | null) => void,
}

export default function GuessCapitalCityForm(
    {
        sendJsonMessage,
        state,
        answerStatus,
        correctAnswer,
        setCorrectAnswer,
    }: Readonly<GuessCapitalCityFormProps>) {
    const {t} = useTranslation()

    const [cities, setCities] = useState<City[]>([])

    const handleSubmit = (
        values: { answer: string }, actions: FormikHelpers<{ answer: string }>
    ) => {
        const questionId = Object.keys(state.questions)[state.currentIndex]
        sendJsonMessage({
            type: "answer_submission",
            id: questionId,
            answer: values.answer,
        })

        actions.resetForm()
    }

    // on mount
    useEffect(() => {
        GameService.getCities().then((cities) => {
            setCities(cities)
        })
    }, [])

    return (
        <>
            {/* Country Name Display */}
            <div className="relative">
                <div className="mb-6 relative w-full h-32 flex items-center justify-center">
                    {state.currentQuestion ? (
                        <div className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200">
                            {state.currentQuestion}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500">
                            <Globe className="w-12 h-12"/>
                        </div>
                    )}
                </div>
            </div>

            <Formik initialValues={{answer: ""}} onSubmit={handleSubmit}>
                {({values, setFieldValue, submitForm}) => (
                    <Form className="space-y-4 lg:mt-10 md:px-8 pb-4 md:pb-0">
                        {cities.length === 0 ? (
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
                                    placeholder={t("game.answer.city_placeholder")}
                                    options={cities}
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
                                disabled={cities.length === 0}
                            >
                                <Send className="w-5 h-5"/>
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}
