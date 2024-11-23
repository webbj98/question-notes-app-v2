
// export async function fetchQuestionById(id: number) {
//     const response = await fetch('http://localhost:3000/')

import {useState, useEffect} from 'react';
import { AttemptWithoutQuestion, Question, QuestionWithLastAttempt } from "../shared/typings/model";
import { API_ROUTES } from '../shared/routes';

export function useFetchQuestionsWithLastAttempt() {
    const [questionsWithLastAttempt, setQuestionsWithLastAttempt] = useState<QuestionWithLastAttempt[]>([]);
    const [error, setError] = useState<unknown>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function getQuestionsWithLastAttempt() {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_ROUTES.backendOrigin}${API_ROUTES.questionsWithLastAttempt}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    // TODO: type this
                    
                    const questionsLastAttemptRes: QuestionWithLastAttempt[] = result.questionsLastAttempt;
                    const questionAttemptsWithDate = questionsLastAttemptRes?.map(({question, lastAttempt}) => {
                        
                        if (lastAttempt) {
                            //Date should really be a string here
                            const strToDate = new Date(lastAttempt?.date)
                            lastAttempt.date = strToDate;
                        }
                        
                        return {
                            question,
                            lastAttempt,
                        }
                    })
                    setQuestionsWithLastAttempt(questionAttemptsWithDate);
                } else {
                    const errResponse = await response.json();
                    throw new Error(errResponse)
                }
            } catch (error) {
                console.log('error: ', )
                setError(error);
                
            } finally {
                setIsLoading(false)

            }

        }
        
        getQuestionsWithLastAttempt()
    }, [])

    return {
        questionsWithLastAttempt,
        error,
        isLoading,
    }
}

export function useFetchQuestionAndAttempts(id: number) {
    const [question, setQuestion] = useState<Question>();
    const [attempts, setAttempts] = useState<AttemptWithoutQuestion[]>([]);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);


    const getQuestionAndAttempts = async(id: number) => {
        console.log('passed id: ', id)
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/questions/${id}/with-attempts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errResponse = await response.json();
                throw new Error(errResponse);

            } else {
                const result = await response.json();
                console.log('result: ', result)

                setQuestion(result.data.question)
                const attemptsData = result.data.attempts;
                const attemptsWithDatesObj = attemptsData.map((attempt) => {
                    const dateObj = new Date(attempt.date)
                    return {
                        ...attempt,
                        date: dateObj
                    }
                })
                
                console.log('attemptsWithDatesObj: ', attemptsWithDatesObj)
                setAttempts(attemptsWithDatesObj)
            }
            
        } catch (error) {
            console.log('error: ', error)
            setError(error);
            
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getQuestionAndAttempts(id);
    }, [id])

    return {
        question,
        attempts,
        error,
        isLoading,
        refetch: getQuestionAndAttempts,
    }
}

export function useDeleteQuestion(id: number) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSuccess, setIsSuccess] = useState(false)
    const deleteQuestion = async () => {
        try {
            setIsLoading(true);
            // setError();
            // TODO: use the enum for first part
            const response = await fetch(`http://localhost:3000/questions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errResponse = await response.json();
                throw new Error(errResponse);
            }             
        } catch (error) {
            setError(error)
        } finally {
            setIsLoading(false);
        }
    }

    return {
        deleteQuestion,
        isLoading,
        error
    }
}

export function useDeleteAttempt() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const deleteAttempt = async (id: number) => {
        try {
            setIsLoading(true);

            const response = await fetch(`http://localhost:3000/attempts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errResponse = await response.json();
                throw new Error(errResponse);
            }     
            
        } catch (error) {
            setError(error)
            
        } finally {
            setIsLoading(false)

        }
    }

    return {
        deleteAttempt,
        isLoading,
        error
    }
}