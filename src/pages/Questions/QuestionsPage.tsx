import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './QuestionsPage.css';
import { getDsaPerformanceLabel, getDsaPerformanceRating, getQuestionTypeLabel } from "../../../shared/typings/mappings";
import Alert from "../../components/Alert";
import { AlertTypes, DsaPerformance } from "../../../shared/typings/model";
import { useFetchQuestionsWithLastAttempt } from "../../http";
import { computeRetakeDate } from "../../util";

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

const QuestionsPage: React.FC = () => {

    // const [questions, setQuestions] = useState([]);
    // const [errorMsg, setErrorMsg] = useState('');
    const {questionsWithLastAttempt, error, isLoading} = useFetchQuestionsWithLastAttempt()
    const [sortColumn, setSortColumn] = useState('title')
    const [sortDir, setSortDir] = useState(SORT_DIR.ASC)

    const sortQuestions = () => {
        questionsWithLastAttempt.sort((a,b) => {
            // is there a better way to sort? The two tiered structure makes it hard to sort with params
            // TODO: maybe use a flat struct with question and attempt combined
            const sorDirSign = (sortDir === SORT_DIR.ASC) ? 1 : -1;

            if (sortColumn === 'title') {
                const compareResult = a.question.title.localeCompare(b.question.title)
                return  compareResult * sorDirSign;
            } else if (sortColumn === 'date') {
                console.log('sort by date')
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
                const aRetakeDate = computeRetakeDate(a.lastAttempt.date, a.lastAttempt.suggestedWaitDuration);
                const bRetakeDate = computeRetakeDate(b.lastAttempt.date, b.lastAttempt.suggestedWaitDuration);

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
    console.log('sort column: ', sortColumn)

    sortQuestions()

    const sortColumnOptions = Array.from(sortColumns.entries()).map(([key, value]) => {
        console.log('key: ', key)
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

    const questionRowDisplay = questionsWithLastAttempt?.map(({question, lastAttempt}) => {
        let retakeDate: Date | null = null;
        if (lastAttempt?.date && lastAttempt.suggestedWaitDuration) {
            retakeDate = computeRetakeDate(lastAttempt.date, lastAttempt.suggestedWaitDuration)
        }
        
        // retakeDate?.setDate(retakeDate.getDate() + question?.suggestedWaitDuration)

        // console.log('question wait time: ', question.suggestedWaitDuration)

        return (
            <tr>
                <td><Link to={`${question.id}`}>{question.title}</Link></td>
                <td>{lastAttempt && getDsaPerformanceLabel(lastAttempt?.performance)}</td>
                <td>{lastAttempt?.date.toLocaleDateString()}</td>
                <td>{lastAttempt?.timeTaken} / {question.time}</td>
                <td>{getQuestionTypeLabel(question.type)}</td>
                <td>{question.importance}</td>
                <td>{question.url}</td>
                <td>{lastAttempt?.suggestedWaitDuration}</td>
                <td>{retakeDate?.toLocaleDateString()}</td>
                
            </tr>
        )
    })

    

    console.log('error: ', error)

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Questions</h1>
 
            {error && <Alert message={error.message} type={AlertTypes.Error} />}

            <div>
                <select onChange={(event) => setSortColumn(event.target.value)}>
                    {sortColumnOptions}   
                    
                </select>

                <button onClick={handleChangeSortDirection}>
                    {sortDir}
                </button>

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
