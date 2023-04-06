import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { AlertColor } from '@mui/material/Alert/Alert';

interface SnackMsg {
    msg: string;
    severity: AlertColor;
}

export type AppState = {
    isAdmin: boolean;
    setIsAdmin: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    displaySnack: boolean;
    setDisplaySnack: Dispatch<SetStateAction<boolean>>;
    snackMsg: SnackMsg;
    setSnackMsg: Dispatch<SetStateAction<SnackMsg>>;
    displayAdminDialog: boolean;
    setDisplayAdminDialog: Dispatch<SetStateAction<boolean>>;
};

const AppContext = createContext<AppState>(
    {isAdmin: false} as AppState,
);
AppContext.displayName = 'AppContext';

export const AppProvider = ({
    children,
}: PropsWithChildren<Record<string, unknown>>) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [displaySnack, setDisplaySnack] = useState(false);
    const [displayAdminDialog, setDisplayAdminDialog] = useState(false);
    const [snackMsg, setSnackMsg] = useState<SnackMsg>({msg: '', severity: 'success'});

    return (
        <AppContext.Provider
            value={{
                isAdmin,
                setIsAdmin,
                loading,
                setLoading,
                displaySnack,
                setDisplaySnack,
                snackMsg,
                setSnackMsg,
                displayAdminDialog,
                setDisplayAdminDialog
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
