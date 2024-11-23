import { AttemptWithoutQuestion } from '../../../shared/typings/model';
import './QuestionDetailsPage.css';

const AttemptCard: React.FC<{attempt: AttemptWithoutQuestion, onDelete: (id: number) => void }> = ({attempt, onDelete}) => {    
    return (
        <div className='attempt-card'>
            {/* <p>Date: {attempt.date.toDateString()}</p> */}
            <p>Date: {attempt.date.toLocaleDateString()}</p>
            <p>Time Taken: {attempt.timeTaken} minutes</p>
            <p>Performance: {attempt.performance}</p>
            <p>Suggested Wait Duration: {attempt.suggestedWaitDuration} {(attempt.suggestedWaitDuration) ? 'days' : ''}</p>

            <button onClick={() => onDelete(attempt.id)}>Delete</button>
        </div>
    )
}

// TODO: Fix attempt hook
const AttemptsDisplay: React.FC<{attempts: AttemptWithoutQuestion[], onDelete: (id: number) => void}> = ({attempts, onDelete}) => {
    const attemptsDisplay = attempts.map((attempt) => <AttemptCard key={attempt.id} attempt={attempt} onDelete={onDelete}/>)

    return (
        <div className='attempts-display'>
            {attemptsDisplay}
        </div>
    )

}

export default AttemptsDisplay;
