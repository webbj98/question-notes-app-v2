export interface Question {
    id: number;
    title: string;
    time: number;
    type: string;
    importance: Importance | null;
    url: string | null;
    notes: string | null;
}

export interface Attempt {
    id: number;
    // TODO: change to date
    date: string;
    timeTaken: number;
    performance: string;
    questionId: number;
    suggestedWaitDuration: number;
}

export type Importance = 1 | 2 | 3| 4 | 5;

// opt means 'optimal'
export type DsaPerformance = 'noIdea' | 'nonOptTrivial' | 'partialOpt' | 'nonOptAccepted' | 'opt' | 'optConfident' | 'mastered';

// Will be a combination of all perforamnce types
export type Performance = DsaPerformance;

