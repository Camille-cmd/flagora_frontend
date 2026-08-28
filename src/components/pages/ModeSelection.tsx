import { useNavigate, Link } from "react-router-dom";
import { Flag, GraduationCap, Hash, MapPin, Zap } from "lucide-react";
import { PageTitle } from "../common/PageTitle.tsx";
import Card from "../common/Card/Card.tsx";
import Alert from "../common/Alert/Alert.tsx";
import { useAuth } from "../../services/auth/useAuth.tsx";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CONTINENTS, ContinentCode } from "../../interfaces/continents.tsx";
import { GameModes } from "../../interfaces/gameModes.tsx";
import Button from "../common/Button.tsx";

type Category = "GCFF" | "GCFC" | "GDFN";
type Difficulty = "training" | "challenge";

const MODE_BY_CATEGORY_DIFFICULTY: Record<
  Category,
  Record<Difficulty, GameModes>
> = {
  GCFF: {
    training: "GCFF_TRAINING_INFINITE",
    challenge: "GCFF_CHALLENGE_COMBO",
  },
  GCFC: {
    training: "GCFC_TRAINING_INFINITE",
    challenge: "GCFC_CHALLENGE_COMBO",
  },
  GDFN: {
    training: "GDFN_TRAINING_INFINITE",
    challenge: "GDFN_CHALLENGE_COMBO",
  },
};

const URL_BY_GAME_MODE: Partial<Record<GameModes, string>> = {
  GCFF_TRAINING_INFINITE: "/game/countries/training-infinite",
  GCFF_CHALLENGE_COMBO: "/game/countries/challenge-combo",
  GCFC_TRAINING_INFINITE: "/game/cities/training-infinite",
  GCFC_CHALLENGE_COMBO: "/game/cities/challenge-combo",
  GDFN_TRAINING_INFINITE: "/game/departments/training-infinite",
  GDFN_CHALLENGE_COMBO: "/game/departments/challenge-combo",
};

export default function ModeSelection() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedContinents, setSelectedContinents] = useState<ContinentCode[]>(
    CONTINENTS.map((c) => c.code),
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);

  const handleContinentToggle = (code: ContinentCode) => {
    setSelectedContinents((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSelectAll = () => {
    if (selectedContinents.length === CONTINENTS.length) {
      setSelectedContinents([]);
    } else {
      setSelectedContinents(CONTINENTS.map((c) => c.code));
    }
  };

  const handleStartGame = () => {
    if (!selectedCategory || !selectedDifficulty) return;

    const gameMode =
      MODE_BY_CATEGORY_DIFFICULTY[selectedCategory][selectedDifficulty];
    const url = URL_BY_GAME_MODE[gameMode];
    if (!url) return;

    // Departments do not use continents; country-based categories keep the query param.
    if (selectedCategory === "GDFN") {
      navigate(url);
      return;
    }

    const continentParam =
      selectedContinents.length === 0 ||
      selectedContinents.length === CONTINENTS.length
        ? "all"
        : selectedContinents.join(",");

    navigate(`${url}?continent=${continentParam}`);
  };

  const isAllSelected = selectedContinents.length === CONTINENTS.length;
  const canStartGame = selectedCategory !== null && selectedDifficulty !== null;

  const categories: {
    code: Category;
    icon: typeof Flag;
    title: string;
  }[] = [
    {
      code: "GCFF",
      icon: Flag,
      title: t("modeSelection.cards.flag.title"),
    },
    {
      code: "GCFC",
      icon: MapPin,
      title: t("modeSelection.cards.cities.title"),
    },
    {
      code: "GDFN",
      icon: Hash,
      title: t("modeSelection.cards.departments.title"),
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center px-6 py-2">
      {/* Title */}
      <PageTitle title={t("modeSelection.title")} />

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

      <div className="w-full max-w-4xl">
        <Card color1="blue" color2="yellow" childrenClassName="p-4 sm:p-6">
          {/* Step 1: Category Selection */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-secondary dark:text-primary mb-4 sm:mb-6 text-center">
              {t("modeSelection.category.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map(({ code, icon: Icon, title }) => (
                <button
                  key={code}
                  onClick={() => setSelectedCategory(code)}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all ${
                    selectedCategory === code
                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 shadow-lg"
                      : "bg-white dark:bg-darkblue-800 border-gray-200 dark:border-darkblue-600 hover:shadow-md"
                  }`}
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                  <div className="text-base sm:text-lg font-bold text-secondary dark:text-primary text-center">
                    {title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Scope Selection (continents) — only for country-based categories */}
          {selectedCategory && selectedCategory !== "GDFN" && (
            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-secondary dark:text-primary mb-4 sm:mb-6 text-center">
                🌍 {t("modeSelection.continents.title")}
              </h2>

              {/* Select All */}
              <div className="mb-4 sm:mb-6 flex justify-center">
                <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2.5 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-300">
                    {t("modeSelection.continents.all")}
                  </span>
                </label>
              </div>

              {/* Continent Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {CONTINENTS.map((continent) => (
                  <label
                    key={continent.code}
                    className="flex items-center space-x-2 cursor-pointer p-2.5 sm:p-3 rounded-lg border-2 border-gray-200 dark:border-darkblue-600 bg-white dark:bg-darkblue-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedContinents.includes(continent.code)}
                      onChange={() => handleContinentToggle(continent.code)}
                      className="w-4 h-4 flex-shrink-0 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm font-medium text-secondary dark:text-primary">
                      {t(`modeSelection.continents.${continent.code}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Difficulty Selection */}
          {selectedCategory && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-secondary dark:text-primary mb-4 sm:mb-6 text-center">
                🎮 {t("modeSelection.mode.title")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <button
                  onClick={() =>
                    isAuthenticated && setSelectedDifficulty("training")
                  }
                  disabled={!isAuthenticated}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    selectedDifficulty === "training"
                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 shadow-lg"
                      : "bg-white dark:bg-darkblue-800 border-gray-200 dark:border-darkblue-600"
                  }
									${!isAuthenticated ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                >
                  <div className="flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm sm:text-base font-semibold text-secondary dark:text-primary">
                      {t("modeSelection.cards.training")}
                    </span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                    {t("modeSelection.cards.trainingDescription")}
                  </div>
                </button>

                <button
                  onClick={() => setSelectedDifficulty("challenge")}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    selectedDifficulty === "challenge"
                      ? "bg-red-100 dark:bg-red-900/30 border-red-500 shadow-lg"
                      : "bg-white dark:bg-darkblue-800 border-gray-200 dark:border-darkblue-600 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-red-600 dark:text-red-400" />
                    <span className="text-sm sm:text-base font-semibold text-secondary dark:text-primary">
                      {t("modeSelection.cards.challenge")}
                    </span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                    {t("modeSelection.cards.challengeDescription")}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Start Button */}
          <Button
            buttonType="primary"
            onClick={handleStartGame}
            disabled={!canStartGame}
            className="w-full py-2.5 sm:py-3 text-base sm:text-lg mb-5"
            text={t("modeSelection.start")}
          />
        </Card>
      </div>
    </main>
  );
}
