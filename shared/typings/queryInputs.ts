export interface CreateQuestionInput {
    title: string;
    time: number;
    importance: number | string;
    url: string | null;
    notes: string | null;
}

