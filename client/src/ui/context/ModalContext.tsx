import React, {useState} from "react";



const ModalContext = React.createContext({
    isScanModalOpen: false,
    setIsScanModalOpen: (b: boolean) => {},

});

export const ModalState = ({children}: any) => {
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);

    return (<ModalContext.Provider value={
        {
            isScanModalOpen: isScanModalOpen,
            setIsScanModalOpen: setIsScanModalOpen,
        }
    }>
        {children}
    </ModalContext.Provider>);
}


export default ModalContext;