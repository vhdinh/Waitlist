import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import WaitlistPage from './waitlist/WaitlistPage';
import { AppProvider } from './context/App.provider';
import { WaitlistProvider } from './context/Waitlist.provider';
import CalendarPage from './calendar/CalendarPage';
import { CalendarProvider } from './context/Calendar.provider';
import LogsPage from "./logs/LogsPage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AppProvider>
                <WaitlistProvider>
                    <CalendarProvider>
                        <App/>
                    </CalendarProvider>
                </WaitlistProvider>
            </AppProvider>
        ),
        children: [
            {
                path: "/",
                element: <WaitlistPage />,
            },
            {
                path: "/reservations",
                element: <CalendarPage />,
            },
            {
                path: '/logs',
                element: <LogsPage />,
            }
        ],
    },
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
