import Button from "../common/Button.tsx";
import {X} from "lucide-react";
import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {useTranslation} from "react-i18next";

interface GameCompletedPopupProps {
    score: number;
    totalQuestions: number;
    bestStreak: number | null;
    onRestart: () => void;
    onExit: () => void;
}

export function GameCompletedPopup({score, totalQuestions, bestStreak, onRestart, onExit}: Readonly<GameCompletedPopupProps>) {
    const {t} = useTranslation();

    return (
        <Dialog open={true} onClose={onExit} className="relative z-50">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-6">
                <DialogPanel className="mx-auto max-w-xl w-full rounded-3xl bg-white dark:bg-darkblue-600 p-10 shadow-2xl text-center relative">
                    <Button
                        onClick={onExit}
                        text={<X className="w-6 h-6"/>}
                        buttonType="raspberry"
                        size="small"
                        aria-label="Close popup"
                        className="absolute top-5 right-5"
                    >
                    </Button>

                    <DialogTitle className="text-4xl font-extrabold mb-6 text-secondary dark:text-primary">
                        {t("popup.gameCompleted.title")}
                    </DialogTitle>

                    <p className="text-xl mb-4">
                        {t("popup.gameCompleted.congratulations")}
                    </p>

                    <p className="text-lg mb-4">
                        {t("popup.gameCompleted.questionsCompleted", {current: totalQuestions, total: totalQuestions})}
                    </p>

                    <p className="text-xl mb-4">
                        {t("popup.gameCompleted.yourScore")}{" "}
                        <span className="font-bold text-1xl">{score}</span>
                    </p>

                    {bestStreak && (
                        <p className="text-lg mb-6">
                            {t("popup.gameCompleted.bestStreak")}{" "}
                            <span className="font-semibold">{bestStreak}</span>
                        </p>
                    )}

                    <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                        {t("popup.gameCompleted.encouragement")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            type="button"
                            buttonType="raspberry"
                            onClick={onRestart}
                            text={t("popup.gameCompleted.restart")}
                        />
                        <Button
                            type="button"
                            buttonType="custom"
                            onClick={onExit}
                            text={t("popup.gameCompleted.exit")}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        />
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
