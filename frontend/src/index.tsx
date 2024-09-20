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
import Entry from "./Entry";
import TillCounter from "./till-counter/TillCounter";

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
                path: '/',
                element: <Entry />,
            },
            {
                path: "/brick/waitlist",
                element: <WaitlistPage location={'brick'} />,
            },
            {
                path: "/brick/reservations",
                element: <CalendarPage location={'brick'} />,
            },
            {
                path: "/brick/reservations/:date",
                element: <CalendarPage location={'brick'} />,
            },
            {
                path: '/brick/logs-waitlist',
                element: <LogsPage />,
            },
            {
                path: '/brick/logs-reservations',
                element: <>Reservations Logs</>,
            },
            // KUMA,
            {
                path: "/kuma/waitlist",
                element: <WaitlistPage location={'kuma'} />,
            },
            {
                path: "/kuma/reservations",
                element: <CalendarPage location={'kuma'} />,
            },
            {
                path: "/kuma/reservations/:date",
                element: <CalendarPage location={'kuma'} />,
            },
            // 1988,
            {
                path: "/eight/waitlist",
                element: <WaitlistPage location={'eight'} />,
            },
            {
                path: "/eight/reservations",
                element: <CalendarPage location={'eight'} />,
            },
            {
                path: "/eight/reservations/:date",
                element: <CalendarPage location={'eight'} />,
            },
        ],
    },
    // TILL COUNTER
    {
        path: '/till-counter',
        element: <TillCounter />
    }
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
