import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';

export type WaitlistState = {
    reloadList: boolean;
    setReloadList: Dispatch<SetStateAction<boolean>>;
    openAddToListModal: boolean;
    setOpenAddToListModal: Dispatch<SetStateAction<boolean>>;
};

const WaitlistContext = createContext<WaitlistState>(
    {} as WaitlistState,
);
WaitlistContext.displayName = 'WaitlistContext';

export const WaitlistProvider = ({
    children,
}: PropsWithChildren<Record<string, unknown>>) => {
    const [openAddToListModal, setOpenAddToListModal] = useState(false);
    const [userAccepted, setUserAccepted] = useState<boolean>(false);
    const [reloadList, setReloadList] = useState(false);

    // Add to wait list

    // Remove from wait list

    // notify from wait list


    return (
        <WaitlistContext.Provider
            value={{
                reloadList,
                setReloadList,
                openAddToListModal,
                setOpenAddToListModal
            }}
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
