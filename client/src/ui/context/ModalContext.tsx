import React, {useState} from "react";

const ModalContext = React.createContext({
    isUploadModalOpen: false,
    setIsUploadModalOpen: (b: boolean) => {},

});

export const ModalState = ({children}: any) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    return (<ModalContext.Provider value={
        {
            isUploadModalOpen: isUploadModalOpen,
            setIsUploadModalOpen: setIsUploadModalOpen,
        }
    }>
        {children}
    </ModalContext.Provider>);
}


export default ModalContext;