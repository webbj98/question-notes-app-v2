export interface Question {
    id: number;
    title: string;
    time: number;
    type: QuestionType;
    importance: Importance | null;
    url: string | null;
    notes: string | null;
}

export interface Attempt {
    id: number;
    // TODO: change to date
    date: Date;
    timeTaken: number;
    performance: Performance;
    questionId: number;
    suggestedWaitDuration: number;
}

export type Importance = 1 | 2 | 3| 4 | 5;

// opt means 'optimal'
// Also, we can just export the array cause it's read-only
export const DsaPerformances = ['noIdea', 'nonOptTrivial', 'partialOpt', 'nonOptAccepted', 'opt', 'optConfident', 'mastered'] as const;
export type DsaPerformance = typeof DsaPerformances[number];

export const FrontEndPerformances = ['noIdea', 'someFeatures', 'coreFeatures', 'confidentCoreFeatures', 'polish', 'confidentPolish'] as const; 
export type FrontEndPerformance =  typeof FrontEndPerformances[number];

// Will be a combination of all perforamnce types
export type Performance = DsaPerformance | FrontEndPerformance;

export const QuestionTypes = ['dsa', 'front-end'] as const;
export type QuestionType = typeof QuestionTypes[number];

export enum AlertTypes {
    Success = 'success',
    Error = 'error',
}

export type AttemptWithoutQuestion = Omit<Attempt, 'questionId'>;

export interface QuestionWithLastAttempt {
    question: Question;
    lastAttempt: AttemptWithoutQuestion | null;
}

export interface QuestionWithAttempts {
    question: Question;
    // We don't use the above definition because we don't want to have an array of null values 
    attempts: AttemptWithoutQuestion[];
}