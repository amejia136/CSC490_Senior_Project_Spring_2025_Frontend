import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // default to English

    useEffect(() => {
        const storedLanguage = localStorage.getItem('appLanguage') || sessionStorage.getItem('appLanguage');
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, []);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
