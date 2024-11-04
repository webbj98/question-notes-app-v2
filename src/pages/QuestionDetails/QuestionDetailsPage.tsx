import {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';
import {Question, Attempt} from '../../../shared/typings/model';
import './QuestionDetailsPage.css'
import CreateAttempt from './CreateAttempt';
import AttemptDisplay from './AttemptsDisplay';
import { getQuestionTypeLabel } from '../../../shared/typings/mappings';
const QuestionDetailsPage: React.FC = () => {
    const [question, setQuestion] = useState<Question | null>(null)
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [successSubmit, setSuccessSubmit] = useState(false)
    const {id} = useParams();

    const handleCreateAttempt = (attempt: Attempt) => {
        setAttempts((prevAttempts) => {
            return [...prevAttempts, attempt]
        })
    }

    useEffect(() => {
        async function getQuestionAndAttempts() {
            console.log('hello')
            try {
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
                    const attemptsData = result.attemptsData;
                    const attemptsWithDatesObj = attemptsData.map((attempt) => {
                        const dateObj = new Date(attempt.date)
                        console.log('dateObj: ', dateObj)
                        return {
                            ...attempt,
                            date: dateObj
                        }
    
                    })
                    // console.log("attemptsDat: e: ", attemptsData)
                    // console.log(new Date(attemptsDate[0]));
    
                    
                    setAttempts(attemptsWithDatesObj)
                    console.log('set attempts: ')
                }
                
            } catch (error) {
                console.log('error: ', error)
                setErrorMsg(error)
                
            }
            
            
        }

        getQuestionAndAttempts();
    }, [id])

    console.log('attempts: ', attempts)
    

    return (
        <div>
            <h1>Question Details</h1>

            <h2>Title: {question?.title} </h2>

            <button> <Link to='edit'>Edit Button</Link></button>

            <div className='details'>
                <label>Time: {question?.time} minutes</label>
                <label>Type: {getQuestionTypeLabel(question?.type)}</label>
                <label>Url: {question?.url}</label>
            </div>

            <AttemptDisplay attempts={attempts} />
            
            {id && <CreateAttempt questionId={Number(id)} onCreateAttempt={handleCreateAttempt} />}

            

        </div>
    )

}

export default QuestionDetailsPage;