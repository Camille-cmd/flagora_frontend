import {Hash} from "lucide-react";
import GameService from "../../../../services/GameService";
import type {GameModeConfig} from "../BaseGameMode";
import type {DepartmentType} from "../../../../interfaces/department";

export const guessDepartmentConfig: GameModeConfig<DepartmentType> = {
    loadOptions: (): Promise<DepartmentType> => {
        return GameService.getDepartments()
    },

    getSearchOptions: (options: DepartmentType) => options || {},

    renderQuestion: (currentQuestion: string) => (
        <div className="text-5xl md:text-6xl font-bold text-center text-gray-800 dark:text-gray-200">
            {currentQuestion}
        </div>
    ),

    validateAnswer: (answer: string, options: DepartmentType): string | null => {
        if (!options || !options[answer]) {
            return 'game.error.invalidDepartment'
        }
        return null
    },

    placeholder: "game.answer.departmentPlaceholder",
    errorKey: "game.error.invalidDepartment",
    fallbackIcon: <Hash className="w-12 h-12"/>,

    getAnswerValue: (answer: string) => {
        return answer
    }
}
