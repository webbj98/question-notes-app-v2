import { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import QuestionsPage from './pages/Questions/QuestionsPage'
import CreateQuestionPage from './pages/CreateQuestion/CreateQuestionPage';
import QuestionDetailsPage from './pages/QuestionDetails/QuestionDetailsPage';

function App() {
  const [count, setCount] = useState(0)

  const router = createBrowserRouter([
    
    {
      path: '/',
      element: <QuestionsPage />
    },
    {
      path: '/questions/new',
      element: <CreateQuestionPage />
    },
  {
    path: 'questions/:id',
    element: <QuestionDetailsPage />,
  }

  ])

  const testSend = async () => {
    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
      if (response.ok) {
        const res = await response.json();

        console.log('res: ', res.message);
      } else {
        const blah = await response.json();
        console.log('blah: ', blah)

      }
      
    } catch (error) {
      console.log('error: ', error)
    }
    


  }

  return (
    <RouterProvider router={router} />



  )
}

export default App
