import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';

export type AppState = {
    isAdmin: boolean;
    setIsAdmin: Dispatch<SetStateAction<boolean>>;
    displaySnack: boolean;
    setDisplaySnack: Dispatch<SetStateAction<boolean>>;
    snackMsg: string;
    setSnackMsg: Dispatch<SetStateAction<string>>;
};

const AppContext = createContext<AppState>(
    {isAdmin: false} as AppState,
);
AppContext.displayName = 'AppContext';

export const AppProvider = ({
    children,
}: PropsWithChildren<Record<string, unknown>>) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [displaySnack, setDisplaySnack] = useState(false);
    const [snackMsg, setSnackMsg] = useState('');

    return (
        <AppContext.Provider
            value={{
                isAdmin,
                setIsAdmin,
                displaySnack,
                setDisplaySnack,
                snackMsg,
                setSnackMsg
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppState = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error(
            `useAppState must be used within a AppProvider`,
        );
    }
    return context;
};
