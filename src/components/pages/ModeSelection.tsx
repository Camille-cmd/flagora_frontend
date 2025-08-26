import {Link} from "react-router-dom";
import {Flag, GraduationCap, MapPin, Zap} from "lucide-react";
import {PageTitle} from "../common/PageTitle.tsx";
import Card from "../common/Card/Card.tsx";
import Alert from "../common/Alert/Alert.tsx";
import {useAuth} from "../../services/auth/useAuth.tsx";
import {useTranslation} from "react-i18next";

export default function ModeSelection() {
    const {isAuthenticated} = useAuth();
    const {t} = useTranslation();

    return (
        <main className="flex flex-col items-center justify-center px-6 py-2">
            {/* Title */}
            <PageTitle title={t("modeSelection.title")}/>

            {/* Warning */}
            {!isAuthenticated && (
                <div className="p-4 mb-10 w-full max-w-md">
                    <Alert
                        type="warning"
                        title={t("modeSelection.guestWarning.title")}
                        dismissible={true}
                        message={
                            <>
                                {t("modeSelection.guestWarning.message.part1")}{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline underline-offset-2"
                                >
                                    {t("modeSelection.guestWarning.message.link")}
                                </Link>{" "}
                                {t("modeSelection.guestWarning.message.part2")}
                            </>
                        }
                    />
                </div>
            )}

            {/* Mode Selection Cards */}
            {/*Training Cards*/}
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl w-full">

                {/* Training Flag Card (only for authenticated users) */}
                {isAuthenticated && (
                    <Link to="/game/countries/training-infinite"
                          className="group relative overflow-hidden no-underline rounded-xl shadow-lg hover:shadow-xl">
                        <Card color1="blue"
                              color2="yellow"
                              childrenClassName={"p-5"}>
                            <div className="p-3 mb-4 flex flex-col items-center text-center">
                                <div className="mb-4 p-3 bg-white dark:bg-blue-800 rounded-full shadow-md">
                                    <Flag className="w-10 h-10 text-blue-600 dark:text-blue-400"/>
                                </div>
                                <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2 flex items-center">
                                    <GraduationCap className="mr-2"/>
                                    {t("modeSelection.cards.flag.title")}
                                </h2>
                                <h3 className="font-bold text-secondary dark:text-primary mb-2">
                                    ({t("modeSelection.cards.training")})
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {t("modeSelection.cards.flag.description")}
                                </p>
                            </div>
                        </Card>
                    </Link>
                )}


                {/* Challenge Flag Card */}
                <Link to="/game/countries/challenge-combo"
                      className="group relative overflow-hidden no-underline rounded-xl shadow-lg hover:shadow-xl">
                    <Card color1="blue"
                          color2="yellow"
                          childrenClassName={"p-5"}
                          bgClassName={"bg-neutral-200 dark:bg-darkblue-800"}>
                        <div className="p-3 mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-white dark:bg-red-800 rounded-full shadow-md">
                                <Flag className="w-10 h-10 text-red-600 dark:text-red-400"/>
                            </div>
                            <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2 flex items-center">
                                <Zap className="mr-2"/>
                                {t("modeSelection.cards.flag.title")}
                            </h2>
                            <h3 className="font-bold text-secondary dark:text-primary mb-2">
                                ({t("modeSelection.cards.challenge")})
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t("modeSelection.cards.flag.descriptionChallenge")}
                            </p>
                        </div>
                    </Card>
                </Link>

                {/* Training Cities Card (only for authenticated users) */}
                {isAuthenticated && (
                    <Link to="/game/cities/training-infinite"
                          className="group relative overflow-hidden no-underline rounded-xl shadow-lg hover:shadow-xl">
                        <Card color1="green" color2="raspberry" childrenClassName={"p-5"}>
                            <div className="p-3 mb-4 flex flex-col items-center text-center">
                                <div className="mb-4 p-3 bg-white dark:bg-green-800 rounded-full shadow-md">
                                    <MapPin className="w-10 h-10 text-green-600 dark:text-green-400"/>
                                </div>
                                <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2 flex items-center">
                                    <GraduationCap className="mr-2"/>
                                    {t("modeSelection.cards.cities.title")}
                                </h2>
                                <h3 className="font-bold text-secondary dark:text-primary mb-2">
                                    ({t("modeSelection.cards.training")})
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {t("modeSelection.cards.cities.description")}
                                </p>
                            </div>
                        </Card>
                    </Link>
                )}

                {/* Challenge Cities Card */}
                <Link to="/game/cities/challenge-combo"
                      className="group relative overflow-hidden no-underline rounded-xl shadow-lg hover:shadow-xl">
                    <Card color1="green"
                          color2="raspberry"
                          childrenClassName={"p-5"}
                          bgClassName={"bg-neutral-200 dark:bg-darkblue-800"}>
                        <div className="p-3 mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 p-3 bg-white dark:bg-red-800 rounded-full shadow-md">
                                <MapPin className="w-10 h-10 text-red-600 dark:text-red-400"/>
                            </div>
                            <h2 className="text-2xl font-bold text-secondary dark:text-primary mb-2 flex items-center">
                                <Zap className="mr-2"/>
                                {t("modeSelection.cards.cities.title")}
                            </h2>
                            <h3 className="font-bold text-secondary dark:text-primary mb-2">
                                ({t("modeSelection.cards.challenge")})
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t("modeSelection.cards.cities.descriptionChallenge")}
                            </p>
                        </div>
                    </Card>
                </Link>

            </div>
        </main>
    );
}
