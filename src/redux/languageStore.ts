import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import en from '../../public/locales/en/translation.json'
import am from '../../public/locales/am/translation.json'

type SupportedLanguage = "en" | "am";

type LanguageStore = {
    language: SupportedLanguage;
    t: typeof en | typeof am;
    setLanguage: (language: SupportedLanguage) => void;
}

const useLanguageStore = create(
    persist<LanguageStore>((set) => ({
        language: "en",
        t: en || am,
        setLanguage(language: SupportedLanguage) {
            set(() => ({
                language,
                t: language === "en" ? en : am,
            }));
        }
 }),
        {
            name: "lang",
        }
    )
);
export default useLanguageStore;