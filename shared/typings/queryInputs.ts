import { Importance, QuestionType } from "./model.ts";

export interface CreateQuestionInput {
    title: string;
    time: number;
    type: QuestionType;
    importance: Importance | null;
    url: string | null;
}

export interface EditQuestionInput {
    title: string | null;
    time: number | null;
    type: QuestionType | null;
    importance: Importance | null;
    url: string | null;
    notes: string | null;
}

// I made this general interface as I wanted to keep with theme of typing query inputs
export interface GetByIdInput {
    id: number;
}

export interface CreateAttemptInput {
    date: Date;
    timeTaken: number;
    performance: Performance;
    questionId: number;
    suggestedWaitDuration: number | null;
}


