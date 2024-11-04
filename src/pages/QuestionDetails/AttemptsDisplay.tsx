import { Attempt } from '../../../shared/typings/model';
import { formateDate } from '../../util';
import './QuestionDetailsPage.css';

const AttemptCard: React.FC<{attempt: Attempt}> = ({attempt}) => {
    console.log('attempt date: ', typeof attempt.date)
    
    return (
        <div>
            {/* <p>Date: {attempt.date.toDateString()}</p> */}
            <p>Date: {attempt.date.toLocaleDateString()}</p>
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
