import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslation from './public/locales/en/translation.json';
import amTranslation from './public/locales/am/translation.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    am: {
        translation: amTranslation,
    },
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        lng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;