import { Attempt } from '../../../shared/typings/model';
import './QuestionDetailsPage.css';

const AttemptCard: React.FC<{attempt: Attempt}> = ({attempt}) => {
    return (
        <div>
            <p>Date: {attempt.date}</p>
            <p>Time Taken: {attempt.timeTaken}</p>
            <p>Performance: {attempt.performance}</p>
            <p>Suggested Wait Duration: {attempt.suggestedWaitDuration}</p>

        </div>
    )
}

const AttemptsDisplay: React.FC<{attempts: Attempt[]}> = ({attempts}) => {
    
    const attemptsDisplay = attempts.map((attempt) => <AttemptCard attempt={attempt}/>)

    return (
        <div>
            {attemptsDisplay}
        </div>
    )

}

export default AttemptsDisplay;
