import { FormEvent, useState, useEffect} from 'react';

import './QuestionDetailsPage.css';
import Alert from '../../components/Alert';
import { getDsaPerfomanceMapLabelEntries } from '../../../shared/typings/mappings';
import { AlertTypes, Attempt } from '../../../shared/typings/model';

const CreateAttempt: React.FC<{questionId: number, onCreateAttempt: () => void}> = ({questionId, onCreateAttempt}) => {
    const [date, setDate] = useState('');
    const [timeTaken, setTimeTaken] = useState<number>();
    // performance
    const [performance, setPerformance] = useState<Performance>()
    const [suggestedWaitDuration, setSuggestedWaitDuration] = useState<number>();
    const [submitSuccess, setSubmitSucess] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitSucess(false);
        try {
            const response = await fetch('http://localhost:3000/attempts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: date,
                    timeTaken: timeTaken,
                    performance: performance,
                    questionId: questionId,
                    suggestedWaitDuration: suggestedWaitDuration
                })

            })

            if (response.ok) {
                const res = await response.json();
                console.log('res: ', res);
                const newAttempt = res.newAttempt as Attempt;
                console.log('this is the newAttempt: ', newAttempt)
                console.log('creating date: ', new Date(newAttempt.date))
                newAttempt.date = new Date(newAttempt.date)
                setSubmitSucess(true);
                onCreateAttempt();
                // onCreateAttempt(res.newAttempt as Attempt)
            } else {
                console.log('error from response: ', response);
            }
            
        } catch (error) {
            console.log('error: ', error)
            
        }

    }

    const performanceCategoryDisplay = [...getDsaPerfomanceMapLabelEntries()].map(([performanceKey, label]) => <option value={performanceKey}>{label}</option>)
    return (
        <div>
            <h2>Create Attempt</h2>
            {submitSuccess && <Alert message='Attempt creation successful' type={AlertTypes.Success}/>}
            <form onSubmit={handleSubmit}>
                <div className="section">
                    <label htmlFor="date">Date</label>
                    <input id="date" type='date' value={date} required onChange={(event) => setDate(event.target.value)} />
                </div>

                <div className="section">
                    <label htmlFor="timeTaken">Time Taken</label>
                    <input id="timeTaken" type='number' value={timeTaken} min={0} required onChange={(event) => setTimeTaken(Number(event.target.value))} />
                </div>

                <div className="section">
                    <label htmlFor="performance">Performance</label>
                    <select onChange={(event) => setPerformance(event.target.value)}>
                        {performanceCategoryDisplay}
                    </select>
                </div>

                <div className="section">
                    <label htmlFor="suggestedWaitDuration">Suggested Wait Duration</label>
                    <input id="suggestedWaitDuration" type='number' value={suggestedWaitDuration} onChange={(event) => setSuggestedWaitDuration(Number(event.target.value))} />
                </div>

                <button>Submit</button>
            </form>

        </div>
    )
}

export default CreateAttempt;