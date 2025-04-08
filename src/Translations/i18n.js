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
                    "About": "About",
                    "Profile": "Profile",
                    "Reviews": "Reviews",
                    "Achievements": "Achievements",
                    "Itinerary": "Itinerary",
                    "Contact": "Contact",
                    "LOGIN": "Login",
                    "SIGNOUT": "Sign Out"
                }
            },
            es: {
                translation: {
                    "Welcome": "Bienvenido",
                    "Home": "Inicio",
                    "About": "Acerca de",
                    "Profile": "Perfil",
                    "Reviews": "Reseñas",
                    "Achievements": "Logros",
                    "Itinerary": "Itinerario",
                    "Contact": "Contacto",
                    "LOGIN": "Iniciar sesión",
                    "SIGNOUT": "Cerrar sesión"
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

