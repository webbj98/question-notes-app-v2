import { FormEvent, useState } from "react";
import './CreateQuestionPage.css';
import ErrorBox from "../../components/Alert";
import Alert from "../../components/Alert";
import { Importance } from "../../../typings/model";
import { getImportanceMapEntries } from '../../../typings/mappings'
import CreateAttempt from "../QuestionDetails/CreateAttempt";

const CreateQuestionPage: React.FC = () => {

    const [title, setTtile] = useState('');
    const [time, setTime] = useState(0);

    //COme back andd change type and make it more definiive 
    const [type, setType] = useState('');
    const [importance, setImportance] = useState<Importance>();
    const [url, setUrl] = useState('');
    // const [notes, setNotes] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false);


    const handleChangeType = (curType: string) => {
        setType(curType)
    }

    const handleChangeImportance = (importanceStr: string) => {
        // We know the string value will be a valid importance value
        setImportance(Number(importanceStr) as Importance);
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        async function createQuestion() {
            try {
                const response = await fetch('http://localhost:3000/questions' , {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: title,
                        time: time,
                        type: type,
                        importance: importance,
                        url: url,
                        // notes: notes,
                    })
                })

                if (response.ok) {
                    const res = await response.json();
                    console.log('res: ', res);
                    setSubmitSuccess(true);

                } else {
                    const errorRes = await response.json()
                    console.log('error from request: ', errorRes)
                    setErrorMsg(errorRes)
                    
                }
                
            } catch (error) {
                console.log('error: ', error)
                console.log('error type: ', typeof error)
                // setErrorMsg(error)
                // setErrorMsg(errorMsg);
            }
        }
        setSubmitSuccess(false);

        await createQuestion();
        setTtile('');
        setTime(0);
        setType('');
        setImportance(undefined);
        setUrl('');
    }

    const importanceOptions = [...getImportanceMapEntries()].map(([importanceKey, label]) => <option key={importanceKey} value={importanceKey}>{importanceKey} - {label}</option> )
    
    return (
        <div>
            <h1>Create Question</h1>

            {errorMsg && <Alert message={errorMsg} type="error"/>}
            {submitSuccess && <Alert message="Successfully created question" type="success"/>}

            <form onSubmit={handleSubmit}>
                <div className="section">
                    <label htmlFor="title">Title</label>
                    <input id="title" value={title} required onChange={(event) => setTtile(event.target.value)} />
                </div>

                <div className="section">
                    <label htmlFor="time">Time</label>
                    <input id="time" type="number" required value={time} onChange={(event) => setTime(Number(event.target.value))} min={0}></input>
                </div>

                <div className="section">
                    <label htmlFor="type">Type</label>
                    <select required onChange={(event) => handleChangeType(event.target.value)}>
                        <option value="1">Test type 1</option>
                        <option value="2">Test type 2</option>
                    </select>
                    {/* <input id="type" type="number" min={0}></input> */}
                </div>

                <div className="section">
                    <label htmlFor="importance">Importance</label>
                    <select onChange={(event) => handleChangeImportance(event.target.value)}>
                        <option selected disabled hidden ></option>
                        {importanceOptions}
                    </select>
                </div>

                <div>
                    <label htmlFor="url">Url</label>
                    <input id="url" type='url' value={url} onChange={(event) => setUrl(event.target.value) } />
                </div>

                <button type="submit">Submit</button>

            </form>
        </div>
    )

}

export default CreateQuestionPage;