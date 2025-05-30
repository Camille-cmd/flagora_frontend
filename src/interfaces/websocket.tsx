export interface AnswerResultMessage {
    id: number;
    isCorrect: boolean;
    correctAnswer: string;
}
export interface NewQuestionsMessage {
    questions: Record<number, string>;
}

export interface WebsocketMessage {
    type: string;
    payload: unknown;
}
