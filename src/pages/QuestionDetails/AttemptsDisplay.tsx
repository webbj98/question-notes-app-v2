import { AttemptWithoutQuestion } from '../../../shared/typings/model';
import { useDeleteAttempt } from '../../http';
import './QuestionDetailsPage.css';

const AttemptCard: React.FC<{attempt: AttemptWithoutQuestion, onDelete: (id: number) => void }> = ({attempt, onDelete}) => {    
    return (
        <div>
            {/* <p>Date: {attempt.date.toDateString()}</p> */}
            <p>Date: {attempt.date.toLocaleDateString()}</p>
            <p>Time Taken: {attempt.timeTaken}</p>
            <p>Performance: {attempt.performance}</p>
            <p>Suggested Wait Duration: {attempt.suggestedWaitDuration}</p>

            <button onClick={() => onDelete(attempt.id)}>Delete</button>

        </div>
    )
}

// TODO: Fix attempt hook
const AttemptsDisplay: React.FC<{attempts: AttemptWithoutQuestion[], onDelete: (id: number) => void}> = ({attempts, onDelete}) => {
    const attemptsDisplay = attempts.map((attempt) => <AttemptCard attempt={attempt} onDelete={onDelete}/>)

    return (
        <div>
            {attemptsDisplay}
        </div>
    )

}

export default AttemptsDisplay;
