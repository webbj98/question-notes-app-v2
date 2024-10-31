import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './QuestionsPage.css';

const QuestionsPage: React.FC = () => {

    const [questions, setQuestions] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function getQuestions() {
            try {
                //TODO: make a home screen and put question here
                const response = await fetch('http://localhost:3000/questions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('result: ', result)
                    setQuestions(result.data);
                } else {
                    console.log('response not ok: ', response)
                }
            } catch (error) {
                console.log('error: ', error)
                // setErrorMsg()
            }
        }

        getQuestions()

    }, [])

    console.log('questinos: ', questions)
    const questionRowDisplay = questions?.map((question) => {
        return (
            <tr>
                <td><Link to={`questions/${question.id}`}>{question.title}</Link></td>
                <td>{question.time}</td>
                <td>{question.type}</td>
                <td>{question.importance}</td>
                <td>{question.url}</td>
            </tr>
        )
    })

    return (
        <div>
            <h1>Questions</h1>

            <table>
                <thead>
                    <tr className="table-row">
                        <th>Title</th>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Importance</th>
                        <th>Url</th>
                    </tr>

                </thead>
                <tbody>
                    {questionRowDisplay}

                </tbody>
            </table>
            <Link to={'questions/new'}>
                <button>Create Question</button>
            </Link>
            
        </div>

    )
}

export default QuestionsPage;

//Move to separatef ile

const QuestionsTable: React.FC = () => {


    return (
        <table>

        </table>
    )
}