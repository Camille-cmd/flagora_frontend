export interface AnswerResultMessage {
    id: number;
    isCorrect: boolean;
    correctAnswer: CorrectAnswer[];
    currentStreak: number;
    bestStreak: number;
    remainingToGuess: number;
}

export interface NewQuestionsMessage {
    questions: Record<number, string>;
}

export interface WebsocketMessage {
    type: string;
    payload: unknown;
}

export interface AcceptUser {
    is_user_authenticated: boolean;
}

export interface CorrectAnswer {
    name: string;
    code: string;
    wikipediaLink: string;
}

export type AnswerStatusTypes = "correct" | "wrong" | "partiallyCorrect";
