import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import {Question, Attempt} from '../../../shared/typings/model';
import './QuestionDetailsPage.css'
import CreateAttempt from './CreateAttempt';
import AttemptDisplay from './AttemptsDisplay';
const QuestionDetailsPage: React.FC = () => {
    const [question, setQuestion] = useState<Question | null>(null)
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const {id} = useParams();

    useEffect(() => {
        async function getQuestionAndAttempts() {
            
            const response = await fetch(`http://localhost:3000/questions/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.log('error with response: ', response)

            } else {
                const result = await response.json();
                console.log('result: ', result)
                setQuestion(result.questionData)
                setAttempts(result.attemptsData)
            }
        }

        getQuestionAndAttempts();

    }, [])

    

    return (
        <div>
            <h1>Question Details</h1>

            <h2>Title: {question?.title} </h2>

            <div className='details'>
                <label>Time: {question?.time} minutes</label>
                <label>Type: {question?.type}</label>
                <label>Url: {question?.url}</label>
            </div>

            <AttemptDisplay attempts={attempts} />
            
            {question?.id && <CreateAttempt questionId={question?.id} />}

            

        </div>
    )

}

export default QuestionDetailsPage;