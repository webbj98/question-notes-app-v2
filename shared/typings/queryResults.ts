import { Importance, QuestionType, Performance } from "./model.ts";

export interface GetQuestionsWithAttemptQueryResult {
    id: number;
    title: string;
    time: number;
    type: QuestionType;
    importance: Importance | null;
    url: string | null;
    notes: string | null;
    attempt_id: number;
    date: string;
    time_taken: number;
    performance: Performance;
    suggested_wait_duration: number;
}

// export interface GetQuestionsByIdWithAttemptsQueryResult {
//     id: number;
//     title: string;
//     time: number;
//     type: QuestionType;
//     importance: Importance | null;
//     url: string | null;
//     notes: string | null;
//     attempt_id: number;
//     date: string;
//     time_taken: number;
//     performance: Performance;
//     suggested_wait_duration: number;

// }