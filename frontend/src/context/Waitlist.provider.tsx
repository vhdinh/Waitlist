import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';

export type WaitlistState = {
};

const WaitlistContext = createContext<WaitlistState>(
    {} as WaitlistState,
);
WaitlistContext.displayName = 'WaitlistContext';

export const WaitlistProvider = ({
    children,
}: PropsWithChildren<Record<string, unknown>>) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userAccepted, setUserAccepted] = useState<boolean>(false);

    // Add to wait list

    // Remove from wait list

    // notify from wait list


    return (
        <WaitlistContext.Provider
            value={{}}
        >
            {children}
        </WaitlistContext.Provider>
    );
};

export const useWaitlistState = () => {
    const context = useContext(WaitlistContext);
    if (!context) {
        throw new Error(
            `useWaitlistState must be used within a WaitlistProvider`,
        );
    }
    return context;
};
