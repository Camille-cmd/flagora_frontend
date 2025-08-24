export interface AnswerResultMessage {
    id: number;
    isCorrect: boolean;
    correctAnswer: string;
    currentStreak: number;
    bestStreak: number;
    code: string;
    wikipediaLink: string
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
    link: string;
}
