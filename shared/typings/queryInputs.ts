import { QuestionType } from "./model.ts";

export interface CreateQuestionInput {
    title: string;
    time: number;
    type: QuestionType;
    importance: number | null;
    url: string | null;
}

// I made this general interface as I wanted to keep with theme of typing query inputs
export interface GetByIdInput {
    id: number;
}
