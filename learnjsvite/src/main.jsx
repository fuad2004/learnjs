import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import TaskPage from './pages/TaskPage.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'task/:taskId',
        element: <TaskPage />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Layout />,
    children: [
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
