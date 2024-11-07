import {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom';
import {Question, Attempt, AttemptWithoutQuestion} from '../../../shared/typings/model';
import './QuestionDetailsPage.css'
import CreateAttempt from './CreateAttempt';
import AttemptDisplay from './AttemptsDisplay';
import { getQuestionTypeLabel } from '../../../shared/typings/mappings';
import { useFetchQuestionAndAttempts } from '../../http';
const QuestionDetailsPage: React.FC = () => {
    // const [question, setQuestion] = useState<Question | null>(null)
    // const [attempts, setAttempts] = useState<Attempt[]>([]);
    // const [errorMsg, setErrorMsg] = useState('');
    const [successSubmit, setSuccessSubmit] = useState(false)

    
    const {id} = useParams();
    const { question, attempts, error, isLoading, setAttempts } = useFetchQuestionAndAttempts(id)

    const handleCreateAttempt = (attempt: AttemptWithoutQuestion) => {
        setAttempts((prevAttempts) => {
            return [...prevAttempts, attempt]
        })
    }

    // useEffect(() => {
    //     async function getQuestionAndAttempts() {
    //         try {
    //             const response = await fetch(`http://localhost:3000/questions/${id}/with-attempts`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 }
    //             });
    
    //             if (!response.ok) {
    //                 const errResponse = await response.json();
    //                 throw new Error(errResponse);
    
    //             } else {
    //                 const result = await response.json();
    
    //                 setQuestion(result.data.question)
    //                 const attemptsData = result.data.attempts;
    //                 const attemptsWithDatesObj = attemptsData.map((attempt) => {
    //                     const dateObj = new Date(attempt.date)
    //                     return {
    //                         ...attempt,
    //                         date: dateObj
    //                     }
    
    //                 })
                    
    //                 setAttempts(attemptsWithDatesObj)
    //             }
                
    //         } catch (error) {
    //             console.log('error: ', error)
    //             setErrorMsg(error)
                
    //         }
            
            
    //     }

    //     getQuestionAndAttempts();
    // }, [id])

    console.log('question notes: ', question?.notes)
    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>

            
            <h1>Question Details</h1>

            <h2>Title: {question?.title} </h2>

            <button> <Link to='edit'>Edit Button</Link></button>

            <div className='details'>
                <label>Time: {question?.time} minutes</label>
                <label>Type: {getQuestionTypeLabel(question?.type)}</label>
                <label>Url: {question?.url}</label>
                <label>Notes</label>
                <p>{question?.notes}</p>
            </div>

            <AttemptDisplay attempts={attempts} />
            
            {id && <CreateAttempt questionId={Number(id)} onCreateAttempt={handleCreateAttempt} />}

            

        </div>
    )

}

export default QuestionDetailsPage;