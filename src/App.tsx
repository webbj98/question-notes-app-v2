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
import EditQuestionPage from './pages/EditQuestion/EditQuestionPage';
import HomePage from './pages/Home/HomePage';

function App() {
  const router = createBrowserRouter([
    
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/questions',
      element: <QuestionsPage />
    },
    {
      path: '/questions/new',
      element: <CreateQuestionPage />
    },
  {
    path: 'questions/:id',
    element: <QuestionDetailsPage />,
  },
  {
    path: 'questions/:id/edit',
    element: <EditQuestionPage />
  }

  ])

  return (
    <RouterProvider router={router} />



  )
}

export default App
