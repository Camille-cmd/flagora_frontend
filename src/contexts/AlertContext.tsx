import {createContext, ReactNode, useContext, useState} from 'react';
import {AlertInfo} from '../interfaces/alert';

interface AlertContextType {
    alertInfo: AlertInfo | undefined;
    setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo | undefined>>;
}
const AlertContext = createContext<AlertContextType>(
    {
        alertInfo: undefined,
        setAlertInfo: () => {}
    } as AlertContextType
);

interface AlertProviderProps {
    children: ReactNode
}

export const AlertProvider: React.FC<AlertProviderProps> = ({children}) => {
    const [alertInfo, setAlertInfo] = useState<AlertInfo>();

    const value = {
        alertInfo,
        setAlertInfo
    }

    return (
        <AlertContext.Provider
            value={value}
        >
            {children}
        </AlertContext.Provider>
    );
};


export const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within a AlertProvider');
    }
    return context;
}

export default AlertContext;
