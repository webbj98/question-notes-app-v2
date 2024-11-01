import {DsaPerformance, Importance, QuestionType} from './model'

// const importanceMap: Record<Importance, string> = {
//     1: 'Top',
//     2: 'High',
//     3: 'Medium',
//     4: 'Low',
//     5: 'Bottom',
// }

const importanceMap = new Map<Importance, string>([
    [5, 'Top'],
    [4, 'High'],
    [3, 'Medium'],
    [2, 'Low'],
    [1, 'Bottom'],
])

export function getImportanceLabel(value: Importance) {
    return importanceMap.get(value)
}

export function getImportanceMapEntries() {
    return importanceMap.entries();
}

const dsaPerformanceMapRatings = new Map<DsaPerformance, number>([
    ['noIdea', 1],
    ['nonOptTrivial', 2],
    ['partialOpt', 3],
    ['nonOptAccepted', 4],
    ['opt', 5],
    ['optConfident', 6],
    ['mastered', 7],
]);

export function getDsaPerformanceRating(value: DsaPerformance) {
    return dsaPerformanceMapRatings.get(value);
}

const dsaPerformanceMapLabels = new Map<DsaPerformance, string>([
    ['noIdea', 'No idea'],
    ['nonOptTrivial', 'Non-Optimal Trivial Solution'],
    ['partialOpt', 'Partial Optimal Solution'],
    ['nonOptAccepted', 'Accepted Non-Optimal Solution'],
    ['opt', 'Optimal Solution'],
    ['optConfident', 'Confident in Optimal Solution'],
    ['mastered', 'Mastered Solution'],
]);

export function getDsaPerformanceLabel(value: DsaPerformance) {
    return dsaPerformanceMapLabels.get(value);
}

export function getDsaPerfomanceMapLabelEntries() {
    return dsaPerformanceMapLabels.entries();
}

const questionTypeLabelMap = new Map<QuestionType, string>([
    ['dsa', 'DSA'],
    ['front-end', 'Front-End']
])

export function getQuestionTypeLabel(value: QuestionType) {
    return questionTypeLabelMap.get(value);
}

export function getQuestionTypeLabelEntries() {
    return questionTypeLabelMap.entries();
}