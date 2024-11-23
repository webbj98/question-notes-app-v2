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
    const {id} = useParams();
    const { question, attempts, error, isLoading, refetch: refetchQuestionsAndAttempts } = useFetchQuestionAndAttempts(id)
    const { deleteQuestion, isLoading: deleteIsLoading, error: deleteError } = useDeleteQuestion(id)
    const {deleteAttempt, isLoading: deleteAttemptIsLoading, error: deleteAttemptError } = useDeleteAttempt()
    // const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleCreateAttempt = async () => {
        console.log('before handle ')
        await refetchQuestionsAndAttempts(id)
    }

    const handleDeleteQuestion = async () => {
        await deleteQuestion(id);
        navigate(-1)
    }

    const handleDeleteAttempt = async(attemptId: number) => {
        await deleteAttempt(attemptId);
        await refetchQuestionsAndAttempts(id);
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>Question Details</h1>

            <h2>Title: {question?.title} </h2>

            <button> <Link to='edit'>Edit Question</Link></button>
            <button onClick={handleDeleteQuestion} disabled={attempts.length > 0}>Delete Question</button>

            <div className='details'>
                <label>Time: {question?.time} minutes</label>
                <label>Type: {getQuestionTypeLabel(question?.type)}</label>
                <label>Url: {question?.url}</label>
                <label>Notes</label>
                <p>{question?.notes}</p>
            </div>

            <AttemptDisplay attempts={attempts} onDelete={handleDeleteAttempt}/>
            
            {question && <CreateAttempt question={question} onCreateAttempt={handleCreateAttempt} />}
        </div>
    )

}

export default QuestionDetailsPage;