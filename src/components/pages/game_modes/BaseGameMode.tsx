import {Send} from "lucide-react";
import {Form, Formik, type FormikHelpers} from "formik";
import SearchBar from "../../common/SearchBar.tsx";
import Button from "../../common/Button.tsx";
import {useEffect, useState} from "react";
import type {GameState} from "../../../reducers/gameReducer.tsx"
import {AnswerStatusTypes, CorrectAnswer} from "../../../interfaces/websocket.tsx";
import {useTranslation} from "react-i18next";

export interface GameModeConfig<T = Record<string, any>> {
    // Data loading
    loadOptions: () => Promise<T>
    
    // Extract searchable options for SearchBar
    getSearchOptions: (options: T) => Record<string, any>
    
    // Question display
    renderQuestion: (currentQuestion: string, options: T) => React.ReactNode
    
    // Validation
    validateAnswer: (answer: string, options: T) => string | null
    
    // UI customization
    placeholder: string
    errorKey: string
    fallbackIcon: React.ReactNode
    
    // Answer processing
    getAnswerValue: (answer: string, options: T) => any
}

export interface BaseGameModeProps<T = Record<string, any>> {
    sendJsonMessage: (message: any) => void,
    state: GameState,
    answerStatus: AnswerStatusTypes | null,
    correctAnswer: CorrectAnswer[] | null,
    setCorrectAnswer: (correctAnswer: CorrectAnswer[] | null) => void,
    config: GameModeConfig<T>
}

export default function BaseGameMode<T = Record<string, any>>({
    sendJsonMessage,
    state,
    answerStatus,
    correctAnswer,
    setCorrectAnswer,
    config
}: Readonly<BaseGameModeProps<T>>) {
    const {t, i18n} = useTranslation()
    const [options, setOptions] = useState<T>({} as T)

    const handleSubmit = (
        values: { answer: string }, 
        actions: FormikHelpers<{ answer: string }>
    ) => {
        const questionId = Object.keys(state.questions)[state.currentIndex]

        // Validate answer using config
        const errorMessage = config.validateAnswer(values.answer, options)
        if (errorMessage) {
            actions.setFieldError('answer', t(errorMessage))
            return
        }

        sendJsonMessage({
            type: "answer_submission",
            id: questionId,
            answer: config.getAnswerValue(values.answer, options),
        })

        actions.resetForm()
    }

    // Load options on mount and language change
    useEffect(() => {
        config.loadOptions().then((loadedOptions) => {
            setOptions(loadedOptions)
        })
    }, [i18n.language, config])

    return (
        <>
            {/* Question Display */}
            <div className="relative">
                <div className="mb-6 relative w-full h-56 flex items-center justify-center">
                    {state.currentQuestion ? (
                        config.renderQuestion(state.currentQuestion, options)
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500">
                            {config.fallbackIcon}
                        </div>
                    )}
                </div>
            </div>

            <Formik initialValues={{answer: ""}} onSubmit={handleSubmit}>
                {({values, setFieldValue, submitForm, errors, touched}) => (
                    <Form className="space-y-4 lg:mt-10 md:px-8 pb-4 md:pb-0">
                        {!options || Object.keys(options as Record<string, any>).length === 0 ? (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
                            </div>
                        ) : (
                            <div>
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
                                    placeholder={t(config.placeholder)}
                                    options={config.getSearchOptions(options)}
                                    questionId={state.currentIndex}
                                    className={`w-full p-4 pl-5 pr-12 ${
                                        answerStatus === "correct"
                                            ? "bg-green-300 dark:bg-green-900/90"
                                            : answerStatus === "wrong"
                                                ? "bg-red-600 dark:bg-red-900/90 shake"
                                                : answerStatus === "partiallyCorrect"
                                                    ? "bg-amber-700 decoration-amber-900/90"
                                                    : ""
                                    }`}
                                />
                                {/* Error message display*/}
                                {errors.answer && touched.answer && (
                                    <div className="text-red-500 text-sm mt-1 px-1">
                                        {errors.answer}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                buttonType="primary"
                                className="w-full py-3"
                                text={t("game.submit")}
                                disabled={!options || Object.keys(options as Record<string, any>).length === 0}
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