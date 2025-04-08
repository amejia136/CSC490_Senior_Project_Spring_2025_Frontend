import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "Welcome": "Welcome",
                    "Home": "Home",
                    "Profile": "Profile",
                    "Login": "Login",
                    // 👆 Add all your text keys (match words already in your app)
                }
            },
            es: {
                translation: {
                    "Welcome": "Bienvenido",
                    "Home": "Inicio",
                    "Profile": "Perfil",
                    "Login": "Iniciar sesión",
                    // 👆 Same keys but Spanish values
                }
            }
        },
        lng: "en", // default language
        fallbackLng: "en",

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
