import { useState } from "react";
import { Link } from "react-router-dom";
import './QuestionsPage.css';
import { getDsaPerformanceRating, getQuestionTypeLabel } from "../../../shared/typings/mappings";
import Alert from "../../components/Alert";
import { AlertTypes, DsaPerformance, QuestionType, QuestionTypes, QuestionWithLastAttempt } from "../../../shared/typings/model";
import { useFetchQuestionsWithLastAttempt } from "../../http";
import { addNumDays } from "../../util";
import { NUM_DAYS_TIL_LATE} from "../../config"
import {getPerformanceLabelByQuestionType} from '../../../shared/typings/typeUtil'
const sortColumns = new Map([
    ['title', {label: 'Title', dataType: 'string'}],
    ['date', {label: 'Date', dataType: 'Date'}],
    ['retakeDate', {label: 'Retake Date', dataType: 'Date'}],
    ['importance', {label: 'Importance', dataType: 'Importance'}],
    ['performance', {label: 'Performance', dataType: 'Perfomance'}],
])

enum SORT_DIR {
    ASC = 'asc',
    DESC = 'desc'
}

// TODO: replace with gettin actual QUestion types dynamically
const QUESTION_TYPE_LIST: QuestionType[] = ['dsa', 'front-end']

const QuestionsPage: React.FC = () => {
    const {questionsWithLastAttempt, error, isLoading} = useFetchQuestionsWithLastAttempt()
    const [sortColumn, setSortColumn] = useState('title');
    const [sortDir, setSortDir] = useState(SORT_DIR.ASC);
    const [searchText, setSearchText] = useState('');
    const [questionTypeFilters, setQuestionTypeFilters] = useState(new Set([...QuestionTypes]))

    const searchedQuestionsWithLastAttempt = questionsWithLastAttempt.filter((questionLastAttempt) => questionLastAttempt.question.title.includes(searchText))
 
    const sortQuestions = (inputQuestionsWithLastAttempt: QuestionWithLastAttempt[]) => {
        
        inputQuestionsWithLastAttempt.sort((a,b) => {
            // is there a better way to sort? The two tiered structure makes it hard to sort with params
            // TODO: maybe use a flat struct with question and attempt combined
            const sorDirSign = (sortDir === SORT_DIR.ASC) ? 1 : -1;

            if (sortColumn === 'title') {
                const compareResult = a.question.title.localeCompare(b.question.title)
                return  compareResult * sorDirSign;
            } else if (sortColumn === 'date') {
                if (!(a.lastAttempt?.date)) {
                    return 1
                }

                if (!(b.lastAttempt?.date)) {
                    return -1
                }

                if (a.lastAttempt.date > b.lastAttempt.date) {
                    return 1 * sorDirSign
                } else if (a.lastAttempt.date < b.lastAttempt.date) {
                    return -1 * sorDirSign;
                } else {
                    return 0;
                }
 
            } else if (sortColumn === 'retakeDate') {
                if (!(a.lastAttempt?.date && a.lastAttempt.suggestedWaitDuration)) {
                    return 1
                }

                if (!(b.lastAttempt?.date && b.lastAttempt.suggestedWaitDuration)) {
                    return -1
                }

                // TODO: Compute retake date somwhere else and so don't compute it each comparison
                const aRetakeDate = addNumDays(a.lastAttempt.date, a.lastAttempt.suggestedWaitDuration);
                const bRetakeDate = addNumDays(b.lastAttempt.date, b.lastAttempt.suggestedWaitDuration);

                if (aRetakeDate > bRetakeDate) {
                    return 1 * sorDirSign
                } else if (aRetakeDate < bRetakeDate) {
                    return -1 * sorDirSign;
                } else {
                    return 0;
                }

            } else if (sortColumn === 'importance') {
                if (!(a.question.importance)) {
                    return 1;
                }

                if (!(b.question.importance)) {
                    return -1;
                }

                const compareResult = a.question.importance - b.question.importance

                return compareResult * sorDirSign;

            } else if (sortColumn === 'performance') {
                if (!(a.lastAttempt?.performance)) {
                    return 1;
                }

                if (!(b.lastAttempt?.performance)) {
                    return -1;
                }

                //TODO: change this with another performance thing
                const aPerformanceVal = getDsaPerformanceRating(a.lastAttempt!.performance as DsaPerformance ) 
                const bPerformanceVal = getDsaPerformanceRating(b.lastAttempt!.performance as DsaPerformance) 

                return (aPerformanceVal! - bPerformanceVal!) * sorDirSign

            } else {
                return 0;
            }
            
        })
    }

    sortQuestions(searchedQuestionsWithLastAttempt);

    const sortColumnOptions = Array.from(sortColumns.entries()).map(([key, value]) => {
        return (
            <option key={key} value={key}>{value.label}</option>

        )
    } )

    const handleChangeSortDirection = () => {
        if (sortDir === SORT_DIR.ASC) {
            setSortDir(SORT_DIR.DESC)
        } else {
            setSortDir(SORT_DIR.ASC)
        }
    }

    const questionRowDisplay = searchedQuestionsWithLastAttempt?.map(({question, lastAttempt}) => {
        let retakeDate: Date | null = null;
        console.log('lastAttempt: ', lastAttempt)
        if (lastAttempt?.date && !isNaN(lastAttempt.suggestedWaitDuration)) {
            console.log('lastAttempt.suggestedWaitDuration: ', lastAttempt.suggestedWaitDuration)
            retakeDate = addNumDays(lastAttempt.date, lastAttempt.suggestedWaitDuration)
        }

        let retakeDateColor = '';

        
        if (retakeDate) {
            const retakeDateTime = retakeDate?.getTime();
            const curDate = Date.now()
            const retakeDateLateStart = addNumDays(retakeDate, NUM_DAYS_TIL_LATE).getTime()
            if (curDate > retakeDateLateStart) {
                retakeDateColor = 'red';
            } else if (curDate < retakeDateLateStart && curDate > retakeDateTime ) {
                retakeDateColor = 'green'
            }
        } 
        
        return (
            <tr key={question.id}>
                <td><Link to={`${question.id}`}>{question.title}</Link></td>
                <td>{lastAttempt && getPerformanceLabelByQuestionType(question.type, lastAttempt?.performance)}</td>
                <td>{lastAttempt?.date.toLocaleDateString()}</td>
                <td>{lastAttempt?.timeTaken} / {question.time}</td>
                <td>{getQuestionTypeLabel(question.type)}</td>
                <td>{question.importance}</td>
                <td>{question.url}</td>
                <td>{lastAttempt?.suggestedWaitDuration}</td>
                <td style={{color: retakeDateColor}}>{retakeDate?.toLocaleDateString()}</td>
                
            </tr>
        )
    })

    const handleToggleFilter = (filterName) => {
        setQuestionTypeFilters((prevQuestionTypeFilters) => {

            const newFilters = prevQuestionTypeFilters
        })


    }


    const questionTypeFilterOptions = QuestionTypes.map((questionType) => {
        return (
            <option>

            </option>
        )
    })

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Questions</h1>
 
            {error && <Alert message={error.message} type={AlertTypes.Error} />}

            <div className="search-filter-bar">

                <input value={searchText} onChange={(event) => setSearchText(event.target.value)} />
                <select onChange={(event) => setSortColumn(event.target.value)}>
                    {sortColumnOptions}   
                    
                </select>

                <button className='sort-dir-button' onClick={handleChangeSortDirection}>
                    {sortDir}
                </button>

                {/* <select value={}>
                    
                </select> */}

            </div>
            
            <table>
                <thead>
                    <tr className="table-row">
                        <th>Title</th>
                        <th>Performance</th>
                        <th>Date</th>
                        <th>Time Taken / Total Time (minutes)</th>
                        <th>Type</th>
                        <th>Importance</th>
                        <th>Url</th>
                        <th>Wait Time (days)</th>
                        <th>Retake Date</th>
                        
                    </tr>

                </thead>
                <tbody>
                    {questionRowDisplay}

                </tbody>
            </table>
            <Link to={'new'}>
                <button>Create Question</button>
            </Link>
            
        </div>

    )
}

export default QuestionsPage;

//Move to separatef ile
