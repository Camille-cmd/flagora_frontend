export type GameState = {
    questions: Record<number, string>;
    currentIndex: number;
    currentQuestion: string;
    score: number;  // Score keep track of strikes
};

type GameAction =
    | { type: "new_questions"; questions: Record<number, string> }
    | { type: "next_question" }
    | { type: "update_score", add_up: number, reset: boolean }

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
            if (action.reset) {
                return {
                    ...state,
                    score: 0,
                }
            }
            const newScore = state.score + action.add_up;
            return {
                ...state,
                score: newScore,
            }
        default:
            return state;
    }
}
