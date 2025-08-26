import {AlertCircle, Crown, Trophy, Zap} from "lucide-react"
import {CityOut, CountryOut, UserStatsByGameMode} from "../../interfaces/userStats.tsx";
import UserService from "../../services/UserService.tsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {PageTitle} from "../common/PageTitle.tsx";

export default function UserStats() {
    const {t} = useTranslation()
    const [stats, setStats] = useState<UserStatsByGameMode[]>([]);

    useEffect(() => {
        UserService.getStats().then(
            (stats) => {
                setStats(stats)
            }
        )
    }, []);


    const renderItem = (item: CountryOut | CityOut) => {
        if ("iso2Code" in item && item.flag) {
            return (
                <div className="flex items-center">
                    <div className="relative h-6 mr-3 border border-gray-300 dark:border-gray-600 overflow-hidden">
                        <img
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(item.flag)}`}
                            alt={`${item.name} flag`}
                            className="max-w-[120%] md:max-w-full max-h-full"
                        />
                    </div>
                    <span className="text-secondary dark:text-primary font-medium">{item.name}</span>
                </div>
            )
        } else {
            const cityNames = Array.isArray(item.name) ? item.name.join(", ") : item.name
            return (
                <div className="flex items-center">
                    <div className="relative h-6 mr-3 border border-gray-300 dark:border-gray-600 overflow-hidden">
                        {"country" in item && item.country && (
                            <img
                                src={`data:image/svg+xml;utf8,${encodeURIComponent(item.country.flag)}`}
                                alt={`${item.country.name} flag`}
                                className="max-w-[120%] md:max-w-full max-h-full"
                            />
                        )}
                    </div>
                    <div>
                        <span className="text-secondary dark:text-primary font-medium">{cityNames}</span>
                        {"country" in item && item.country && (
                            <p className="text-xs text-gray-600 dark:text-gray-300">{item.country.name}</p>
                        )}
                    </div>
                </div>
            )
        }
    }

    return (
        <>
            {stats && stats.length > 0 ? (
                <div className="min-h-screen bg-primary dark:bg-darkblue-700 flex flex-col transition-colors duration-300">

                    <div className="container mx-auto p-6">
                        <PageTitle title={t("stats.pageTitle")}></PageTitle>

                        <div className="space-y-6">
                            {stats.map((gameModeStats) => (
                                <div key={gameModeStats.gameMode} className="space-y-4">
                                    {/* Game Mode Header */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-raspberry-600 rounded-full flex items-center justify-center">
                                            {gameModeStats.gameMode.includes("GCFF") ? (
                                                <span className="text-white text-sm">🏳️</span>
                                            ) : (
                                                <span className="text-white text-sm">📍</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-secondary dark:text-primary">
                                            {t(`gameModes.${gameModeStats.gameMode}`)}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                                        {/* Success Rate */}
                                        <div className="bg-white dark:bg-darkblue-600 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-medium text-secondary dark:text-primary flex items-center">
                                                    <Crown size={20} className="mr-2 text-green-500"/>
                                                    {t("stats.successRateTitle")}
                                                </h4>
                                            </div>
                                            <div className="text-lg font-semibold text-raspberry-600 mt-2">
                                                {gameModeStats.stats.successRate}{t("stats.successRate")}
                                            </div>
                                        </div>

                                        {/* Most Strikes */}
                                        {gameModeStats.gameMode.includes("CHALLENGE") && (
                                            <div className="bg-white dark:bg-darkblue-600 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-medium text-secondary dark:text-primary flex items-center">
                                                        <Zap size={20} className="mr-2 text-raspberry-600"/>
                                                        {t("stats.maxStreak")}
                                                    </h4>
                                                </div>
                                                <div className="text-3xl font-bold text-raspberry-600 mb-2">{gameModeStats.stats.mostStrikes}</div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{t("stats.maxStreakDescription")}</p>
                                            </div>
                                        )}

                                        {/* Most Correctly Guessed */}
                                        <div className="bg-white dark:bg-darkblue-600 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-medium text-secondary dark:text-primary flex items-center">
                                                    <Trophy size={20} className="mr-2 text-green-500"/>
                                                    {t("stats.maxCorrect")}
                                                </h4>
                                            </div>
                                            <div className="space-y-2">{renderItem(gameModeStats.stats.mostCorrectlyGuessed)}</div>
                                            <div className="text-lg font-semibold text-raspberry-600 mt-2">
                                                {gameModeStats.stats.mostCorrectlyGuessed.successRate}{t("stats.successRate")}
                                            </div>
                                        </div>

                                        {/* Most Failed */}
                                        <div className="bg-white dark:bg-darkblue-600 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-medium text-secondary dark:text-primary flex items-center">
                                                    <AlertCircle size={20} className="mr-2 text-red-500"/>
                                                    {t("stats.maxFails")}
                                                </h4>
                                            </div>
                                            <div className="space-y-2">{renderItem(gameModeStats.stats.mostFailed)}</div>
                                            <div className="text-lg font-semibold text-raspberry-600 mt-2">
                                                {gameModeStats.stats.mostFailed.successRate}{t("stats.successRate")}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen bg-primary dark:bg-darkblue-700 flex items-center justify-center transition-colors duration-300">
                    <p className="text-lg font-semibold text-secondary dark:text-primary">
                        {t("stats.noStats")}
                    </p>
                </div>
            )}
        </>
    )
}
