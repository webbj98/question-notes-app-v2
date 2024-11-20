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
export type DsaPerformance = 'noIdea' | 'nonOptTrivial' | 'partialOpt' | 'nonOptAccepted' | 'opt' | 'optConfident' | 'mastered';

export type FrontEndPerformance = 'noIdea' | 'someFeatures' | 'coreFeatures' | 'confidentCoreFeatures' | 'polish' | 'confidentPolish';

// Will be a combination of all perforamnce types
export type Performance = DsaPerformance | FrontEndPerformance;



export type QuestionType = 'dsa' |  'front-end';



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