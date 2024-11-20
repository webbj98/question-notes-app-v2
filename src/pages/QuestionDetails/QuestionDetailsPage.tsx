import {useState, useEffect} from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import {Question, Attempt, AttemptWithoutQuestion} from '../../../shared/typings/model';
import './QuestionDetailsPage.css'
import CreateAttempt from './CreateAttempt';
import AttemptDisplay from './AttemptsDisplay';
import { getQuestionTypeLabel } from '../../../shared/typings/mappings';
import { useDeleteAttempt, useDeleteQuestion, useFetchQuestionAndAttempts } from '../../http';
import Alert from '../../components/Alert';
const QuestionDetailsPage: React.FC = () => {
    // const [question, setQuestion] = useState<Question | null>(null)
    // const [attempts, setAttempts] = useState<Attempt[]>([]);
    // const [errorMsg, setErrorMsg] = useState('');

    const {id} = useParams();
    const { question, attempts, error, isLoading, setAttempts } = useFetchQuestionAndAttempts(id)
    const { deleteQuestion, isLoading: deleteIsLoading, error: deleteError } = useDeleteQuestion(id)
    const {deleteAttempt, isLoading: deleteAttemptIsLoading, error: deleteAttemptError } = useDeleteAttempt()
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();


    const handleCreateAttempt = (attempt: AttemptWithoutQuestion) => {
        setAttempts((prevAttempts) => {
            return [...prevAttempts, attempt]
        })
    }

    const handleDeleteQuestion = async () => {
        await deleteQuestion(id);
        navigate(-1)
        
        console.log('can DELETE');
    } 

    console.log('question notes: ', question?.notes)
    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Question Details</h1>

            <h2>Title: {question?.title} </h2>

            <button> <Link to='edit'>Edit Question</Link></button>
            <button onClick={handleDeleteQuestion}>Delete Question</button>

            <div className='details'>
                <label>Time: {question?.time} minutes</label>
                <label>Type: {getQuestionTypeLabel(question?.type)}</label>
                <label>Url: {question?.url}</label>
                <label>Notes</label>
                <p>{question?.notes}</p>
            </div>

            <AttemptDisplay attempts={attempts} onDelete={deleteAttempt}/>
            
            {id && <CreateAttempt questionId={Number(id)} onCreateAttempt={handleCreateAttempt} />}
        </div>
    )

}

export default QuestionDetailsPage;