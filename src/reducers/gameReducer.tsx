export type GameState = {
    questions: Record<number, string>;
    currentIndex: number;
    currentQuestion: string;
    score: number;  // Score keep track of strikes
};

type GameAction =
    | { type: "new_questions"; questions: Record<number, string> }
    | { type: "next_question" }
    | { type: "update_score", new_streak: number, }

export default function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case "new_questions":
            const firstKey = Number(Object.keys(action.questions)[0]);
            const firstQuestion = action.questions[firstKey];
            return {
                questions: {...state.questions, ...action.questions},
                currentIndex: state.currentIndex || 0,
                currentQuestion: state.currentQuestion || firstQuestion,
                score: state.score || 0,
            };
        case "next_question": {
            const nextIndex = state.currentIndex + 1;
            return {
                ...state,
                currentIndex: nextIndex,
                currentQuestion: state.questions[nextIndex],
            };
        }
        case "update_score":
            const newScore = action.new_streak;
            return {
                ...state,
                score: newScore,
            }
        default:
            return state;
    }
}
