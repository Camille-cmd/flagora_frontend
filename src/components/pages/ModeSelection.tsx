import { useNavigate, Link } from "react-router-dom";
import { Flag, GraduationCap, MapPin, Zap } from "lucide-react";
import { PageTitle } from "../common/PageTitle.tsx";
import Card from "../common/Card/Card.tsx";
import Alert from "../common/Alert/Alert.tsx";
import { useAuth } from "../../services/auth/useAuth.tsx";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { CONTINENTS, ContinentCode } from "../../interfaces/continents.tsx";
import { GameModes } from "../../interfaces/gameModes.tsx";
import Button from "../common/Button.tsx";

export default function ModeSelection() {
	const { isAuthenticated } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [selectedContinents, setSelectedContinents] = useState<ContinentCode[]>(CONTINENTS.map((c) => c.code));
	const [selectedMode, setSelectedMode] = useState<GameModes | null>(null);

	const handleContinentToggle = (code: ContinentCode) => {
		setSelectedContinents((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
	};

	const handleSelectAll = () => {
		if (selectedContinents.length === CONTINENTS.length) {
			setSelectedContinents([]);
		} else {
			setSelectedContinents(CONTINENTS.map((c) => c.code));
		}
	};

	const handleStartGame = () => {
		if (!selectedMode) return;

		// Build continent parameter: comma-separated list or "all"
		const continentParam =
			selectedContinents.length === 0 || selectedContinents.length === CONTINENTS.length
				? "all"
				: selectedContinents.join(",");

		// Navigate based on game mode
		if (selectedMode === "GCFF_TRAINING_INFINITE") {
			navigate(`/game/countries/training-infinite?continent=${continentParam}`);
		} else if (selectedMode === "GCFF_CHALLENGE_COMBO") {
			navigate(`/game/countries/challenge-combo?continent=${continentParam}`);
		} else if (selectedMode === "GCFC_TRAINING_INFINITE") {
			navigate(`/game/cities/training-infinite?continent=${continentParam}`);
		} else if (selectedMode === "GCFC_CHALLENGE_COMBO") {
			navigate(`/game/cities/challenge-combo?continent=${continentParam}`);
		}
	};

	const isAllSelected = selectedContinents.length === CONTINENTS.length;
	const canStartGame = selectedMode !== null;

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
					{/* Step 1: Continent Selection */}
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

					{/* Step 2: Game Mode Selection */}
					<div className="mb-6 sm:mb-8">
						<h2 className="text-lg sm:text-xl font-bold text-secondary dark:text-primary mb-4 sm:mb-6 text-center">
							🎮 {t("modeSelection.mode.title")}
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
							{/* Flag Modes */}
							<div className="space-y-2 sm:space-y-3">
								<h3 className="font-bold text-base sm:text-lg text-secondary dark:text-primary flex items-center justify-center mb-3 sm:mb-4">
									<Flag className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
									{t("modeSelection.cards.flag.title")}
								</h3>

								<button
									onClick={() => isAuthenticated && setSelectedMode("GCFF_TRAINING_INFINITE")}
									disabled={!isAuthenticated}
									className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
										selectedMode === "GCFF_TRAINING_INFINITE"
											? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 shadow-lg"
											: "bg-white dark:bg-darkblue-800 border-gray-200 dark:border-darkblue-600"
									}
										${!isAuthenticated ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
									`}
								>
									<div className="flex items-center justify-center">
										<GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
										<span className="text-sm sm:text-base font-semibold text-secondary dark:text-primary">
											{t("modeSelection.cards.training")}
										</span>
									</div>
								</button>

								<button
									onClick={() => setSelectedMode("GCFF_CHALLENGE_COMBO")}
									className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
										selectedMode === "GCFF_CHALLENGE_COMBO"
											? "bg-red-100 dark:bg-red-900/30 border-red-500 shadow-lg"
											: "bg-white dark:bg-darkblue-800 border-gray-200 dark:border-darkblue-600"
									}`}
								>
									<div className="flex items-center justify-center">
										<Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-red-600 dark:text-red-400" />
										<span className="text-sm sm:text-base font-semibold text-secondary dark:text-primary">
											{t("modeSelection.cards.challenge")}
										</span>
									</div>
								</button>
							</div>

							{/* Cities Modes */}
							<div className="space-y-2 sm:space-y-3">
								<h3 className="font-bold text-base sm:text-lg text-secondary dark:text-primary flex items-center justify-center mb-3 sm:mb-4">
									<MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
									{t("modeSelection.cards.cities.title")}
								</h3>

								<button
									onClick={() => isAuthenticated && setSelectedMode("GCFC_TRAINING_INFINITE")}
									disabled={!isAuthenticated}
									className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all
										${
											selectedMode === "GCFC_TRAINING_INFINITE"
												? "bg-green-100 dark:bg-green-900/30 border-green-500 shadow-lg"
												: "bg-white dark:bg-darkblue-800 border-gray-200 dark:border-darkblue-600"
										}
										${!isAuthenticated ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
									`}
								>
									<div className="flex items-center justify-center">
										<GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-green-600 dark:text-green-400" />
										<span className="text-sm sm:text-base font-semibold text-secondary dark:text-primary">
											{t("modeSelection.cards.training")}
										</span>
									</div>
								</button>

								<button
									onClick={() => setSelectedMode("GCFC_CHALLENGE_COMBO")}
									className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all ${
										selectedMode === "GCFC_CHALLENGE_COMBO"
											? "bg-red-100 dark:bg-red-900/30 border-red-500 shadow-lg"
											: "bg-white dark:bg-darkblue-800 border-gray-200 dark:border-darkblue-600"
									}`}
								>
									<div className="flex items-center justify-center">
										<Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-red-600 dark:text-red-400" />
										<span className="text-sm sm:text-base font-semibold text-secondary dark:text-primary">
											{t("modeSelection.cards.challenge")}
										</span>
									</div>
								</button>
							</div>
						</div>
					</div>

					{/* Step 3: Start Button */}
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
