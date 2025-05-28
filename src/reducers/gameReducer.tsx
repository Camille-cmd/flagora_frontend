
type GameState = {
    questions: Record<number, string>;
    currentIndex: number;
    currentQuestion: string;
    score: number;
};

type GameAction =
    | { type: "new_questions"; questions: Record<number, string> }
    | { type: "next_question" }

export default function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case "new_questions":
            console.log(state.currentQuestion || action.questions[0])
            return {
                questions: {...state.questions, ...action.questions},
                currentIndex: state.currentIndex || 0,
                currentQuestion: state.currentQuestion || action.questions[0],
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
        default:
            return state;
    }
}
