import {DsaPerformance, FrontEndPerformance, QuestionType, Performance} from './model'
import {getDsaPerfomanceMapLabelEntries, getDsaPerformanceLabel, getFrontEndPerfomanceMapLabelEntries, getFrontEndPerformanceLabel} from './mappings';

export function getPerformanceLabelByQuestionType(questionType: QuestionType, performance: Performance) {
    if (questionType === 'dsa') {
        return getDsaPerformanceLabel(performance as DsaPerformance)
    } else if (questionType === 'front-end') {
        return getFrontEndPerformanceLabel(performance as FrontEndPerformance)
    }
}

//TODO: possibly throw an error here
export function getPerformanceMapEntriesByQuestionType(questionType: QuestionType) {
    if (questionType === 'dsa') {
        return getDsaPerfomanceMapLabelEntries()
    } else if (questionType === 'front-end') {
        return getFrontEndPerfomanceMapLabelEntries();
    }
}
