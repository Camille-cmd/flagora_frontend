import Button from "../common/Button.tsx";
import {X} from "lucide-react";
import {CorrectAnswer} from "../../interfaces/websocket.tsx";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {useTranslation} from "react-i18next";
import {countryCodeEmoji} from "../../utils/common.tsx";
import {Link} from "react-router-dom";

interface GameLostPopupProps {
    score: number;
    correctAnswer: Array<CorrectAnswer> | null;
    bestStreak: number | null;
    triggerNextQuestion: () => void;
}

export function GameLostPopup({score, correctAnswer, bestStreak, triggerNextQuestion}: Readonly<GameLostPopupProps>) {
    const {t} = useTranslation();

    const onClose = () => {
        window.location.href = "/mode-selection"
    }

    const onRetry = () => {
        triggerNextQuestion();
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-6">
                <DialogPanel className="mx-auto max-w-xl w-full rounded-3xl bg-white dark:bg-darkblue-600 p-10 shadow-2xl text-center relative">
                    <Button
                        onClick={onClose}
                        text={<X className="w-6 h-6"/>}
                        buttonType="raspberry"
                        size="small"
                        aria-label="Close popup"
                        className="absolute top-5 right-5"
                    >
                    </Button>

                    <DialogTitle className="text-4xl font-extrabold mb-6 text-secondary dark:text-primary">
                        {t("popup.gameOver.title")}
                    </DialogTitle>

                    <p className="text-xl mb-4">
                        {t("popup.gameOver.yourScore")}{" "}
                        <span className="font-bold text-1xl">{score}</span>
                    </p>

                    {bestStreak && (
                        <p className="text-lg mb-6">
                            {t("popup.gameOver.bestStreak")}{" "}
                            <span className="font-semibold">{bestStreak}</span>
                        </p>
                    )}

                    {/* Correct answer is a list of possible correct answers*/}
                    {correctAnswer && correctAnswer.length > 0 && (
                        <p className="text-lg mb-6">
                            {t("popup.gameOver.correctAnswer")}{" "}
                            {correctAnswer.map((correctAnswer, i) => (
                                <Link to={correctAnswer.wikipediaLink}
                                      key={i}
                                      className="font-semibold text-secondary dark:text-primary">{correctAnswer.name} {countryCodeEmoji(correctAnswer.code)}</Link>
                            ))}
                        </p>
                    )}

                    <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                        {t("popup.gameOver.encouragement")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            type="button"
                            buttonType="raspberry"
                            onClick={onRetry}
                            text={t("popup.gameOver.retry")}
                        />
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
