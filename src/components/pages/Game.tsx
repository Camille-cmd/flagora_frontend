import {Flag, Send, Star} from "lucide-react"
import Button from "../common/Button.tsx"
import Card from "../common/Card/Card.tsx"
import {CardHeader} from "../common/Card/CardHeader.tsx"
import Input from "../common/Input.tsx"
import useWebSocket from "react-use-websocket"
import {useEffect, useReducer, useState} from "react"
import {Field, Form, Formik, FormikHelpers} from "formik"
import gameReducer from "../../reducers/gameReducer.tsx";
import {AnswerResultMessage, NewQuestionsMessage, WebsocketMessage} from "../../interfaces/websocket.tsx";
import {useTranslation} from "react-i18next";


export default function Game() {
    const {t} = useTranslation();
    const [state, dispatch] = useReducer(gameReducer, {
        questions: [],
        currentIndex: 0,
        currentQuestion: '',
        score: 0,
    });

    const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);

    const {sendJsonMessage, lastJsonMessage} = useWebSocket(
        `${import.meta.env.VITE_WS_URL}/`,
        {
            shouldReconnect: () => true,
            reconnectAttempts: 10,
        },
    )

    const handleSubmit = (
        values: { answer: string }, actions: FormikHelpers<{ answer: string }>
    ) => {

        const questionId = Object.keys(state.questions)[state.currentIndex];
        sendJsonMessage({
            type: "answer_submission",
            id: questionId,
            answer: values.answer,
        });

        actions.resetForm()

    };


    useEffect(() => {
        if (!lastJsonMessage) return;

        const response = lastJsonMessage as WebsocketMessage;

        let payload;
        switch (response.type) {
            case "new_questions":
                payload = response.payload as NewQuestionsMessage;
                dispatch({type: "new_questions", questions: payload.questions});
                break;

            case "answer_result":
                payload = response.payload as AnswerResultMessage;
                if (payload.isCorrect) {
                    dispatch({type: "next_question"});
                    setAnswerStatus("correct")

                    // Request more questions if only 2 remaining
                    const remainingQuestions = Object.keys(state.questions).length - state.currentIndex - 1;
                    if (remainingQuestions <= 2) {
                        sendJsonMessage({
                            type: "request_questions"
                        });
                    }
                } else {
                    setAnswerStatus("wrong")
                }

                // Reset after short delay to allow UI to reflect color
                setTimeout(() => setAnswerStatus(null), 500);
                break;
        }
    }, [lastJsonMessage]);


    return (
        <div className="flex flex-col items-center justify-center p-2">
            <div className="w-full max-w-xl">
                <Card color1="yellow" color2="blue">
                    <div className="relative p-8">
                        <CardHeader
                            className="mb-6"
                            title={"Quel est ce pays?"}
                            icon={
                                <div className="p-3 bg-white dark:bg-blue-800 rounded-full shadow-md mr-4">
                                    <Flag className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
                                </div>
                            }
                        />

                        {/* Flag Image */}
                        <div className="mb-8 transform transition-all duration-300 hover:scale-[1.02] relative">
                            <div className="relative w-full h-64 border-4 border-white dark:border-gray-700 rounded-lg overflow-hidden shadow-md">
                                <img
                                    src={`data:image/svg+xml;utf8,${encodeURIComponent(state.currentQuestion)}`}
                                    alt="Drapeau"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Formik Form */}
                        <Formik
                            initialValues={{answer: ""}}
                            onSubmit={handleSubmit}
                        >
                            {() => (
                                <Form className="space-y-6">
                                    <div className="relative">
                                        <Field
                                            name="answer"
                                            as={Input}
                                            type="text"
                                            className={`w-full p-4 pl-5 pr-12 ${
                                                answerStatus === "correct" ? "bg-green-300 dark:bg-green-900/90" :
                                                answerStatus === "wrong" ? "bg-red-600 dark:bg-red-900/90  shake" : ""
                                            }`}
                                            placeholder={t("game.answer.placeholder")}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        buttonType="primary"
                                        className="w-full py-4 px-6"
                                        text={t("game.submit")}
                                    >
                                        <Send className="w-5 h-5"/>
                                    </Button>
                                </Form>
                            )}
                        </Formik>
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
        </div>
    )
}
