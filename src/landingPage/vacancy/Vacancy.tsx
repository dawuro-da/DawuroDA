"use client";
import { I18nextProvider, useTranslation } from "react-i18next";
import VacancySection from "./sections/VacancySection";
import useLanguageStore from "@/redux/languageStore";
import { useEffect } from "react";
import i18n from "../../../i18n";

const Vacancy = () => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);
  return (
    <I18nextProvider i18n={i18n}>
      <div>
        <VacancySection />
      </div>{" "}
    </I18nextProvider>
  );
};

export default Vacancy;
