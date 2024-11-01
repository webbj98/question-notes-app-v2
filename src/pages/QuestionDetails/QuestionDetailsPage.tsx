import {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';
import {Question, Attempt} from '../../../shared/typings/model';
import './QuestionDetailsPage.css'
import CreateAttempt from './CreateAttempt';
import AttemptDisplay from './AttemptsDisplay';
const QuestionDetailsPage: React.FC = () => {
    const [question, setQuestion] = useState<Question | null>(null)
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const {id} = useParams();

    const handleCreateAttempt = (attempt: Attempt) => {
        setAttempts((prevAttempts) => {
            return [...prevAttempts, attempt]
        })
    }

    useEffect(() => {
        async function getQuestionAndAttempts() {
            
            const response = await fetch(`http://localhost:3000/questions/${id}/with-attempts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.log('error with response: ', response)

            } else {
                const result = await response.json();
                console.log('result: ', result.attemptsData)
                setQuestion(result.questionData)
                
                setAttempts(result.attemptsData)
                console.log('set attempts: ')
            }
        }

        getQuestionAndAttempts();
    }, [id])

    

    return (
        <div>
            <h1>Question Details</h1>

            <h2>Title: {question?.title} </h2>

            <button> <Link to='edit'>Edit Button</Link></button>

            <div className='details'>
                <label>Time: {question?.time} minutes</label>
                <label>Type: {question?.type}</label>
                <label>Url: {question?.url}</label>
            </div>

            <AttemptDisplay attempts={attempts} />
            
            {id && <CreateAttempt questionId={Number(id)} onCreateAttempt={handleCreateAttempt} />}

            

        </div>
    )

}

export default QuestionDetailsPage;