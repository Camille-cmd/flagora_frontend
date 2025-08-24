import {Star} from "lucide-react";
import {useTranslation} from "react-i18next";


interface ScoreProps {
    score: number;
}

/**
 * Score component
 * @constructor
 *
 * Renders the score of the user within the game card
 */
export default function Score({score}: Readonly<ScoreProps>) {
    const {t} = useTranslation();

    return (
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center">
            <Star className="text-green-600 mr-2"/>
            <span className="text-gray-600 dark:text-gray-300">{t("score.streak")}: {score}</span>
        </div>
    )
}
