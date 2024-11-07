import { useState, useEffect, FormEvent } from "react";
import { AlertTypes, DsaPerformance, Importance, Question, QuestionType } from "../../../shared/typings/model";
import Alert from "../../components/Alert";
import { getImportanceMapEntries, getQuestionTypeLabelEntries } from "../../../shared/typings/mappings";
import {API_ROUTES} from '../../../shared/routes';
import { useParams } from "react-router-dom";


const EditQuestionPage: React.FC = () => {

    const [origQuestion, setOrigQuestion] = useState();

    const [title, setTtile] = useState('');
    const [time, setTime] = useState(0);

    //COme back andd change type and make it more definiive 
    const [type, setType] = useState<QuestionType>();
    const [importance, setImportance] = useState<DsaPerformance>();
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const {id} = useParams()


    const handleChangeType = (curType: string) => {
        setType(curType)
    }

    const handleChangeImportance = (importanceStr: string) => {
        // We know the string value will be a valid importance value
        setImportance(Number(importanceStr) as Importance);
    }

    

    const importanceOptions = [...getImportanceMapEntries()].map(([importanceKey, label]) => <option key={importanceKey} value={importanceKey}>{importanceKey} - {label}</option> )
    
    useEffect(() => {

        
        

    }, [])

    

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        async function createQuestion() {
            try {
                const response = await fetch(API_ROUTES.backendOrigin + `/questions/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        time: time,
                        type: type,
                        importance: importance,
                        url: url,
                        notes: notes,
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
        setType(undefined);
        setImportance(undefined);
        setUrl('');
        setNotes('')
    }

    const questionTypeOptions = [...getQuestionTypeLabelEntries()].map(([typeKey, label]) => <option key={typeKey} value={typeKey}>{label}</option>)

    return (
        <div>
            <h1>Edit Question</h1>

            {errorMsg && <Alert message={errorMsg} type={AlertTypes.Error}/>}
            {submitSuccess && <Alert message="Successfully edited question" type={AlertTypes.Success}/>}

            <form onSubmit={handleSubmit}>
                <div className="section">
                    <label htmlFor="title">Title</label>
                    <input id="title" value={title} onChange={(event) => setTtile(event.target.value)} />
                </div>

                <div className="section">
                    <label htmlFor="time">Time</label>
                    <input id="time" type="number" value={time} onChange={(event) => setTime(Number(event.target.value))} min={0}></input>
                </div>

                <div className="section">
                    <label htmlFor="type">Type</label>
                    <select onChange={(event) => handleChangeType(event.target.value)}>
                    <option selected disabled hidden defaultChecked ></option>
                        {questionTypeOptions}
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

                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value) } />
                </div>

                <button type="submit">Submit</button>

            </form>
        </div>
    )

}

export default EditQuestionPage;
