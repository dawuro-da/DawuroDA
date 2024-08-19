"use client";
import { I18nextProvider, useTranslation } from "react-i18next";
import Footer from "../footer/Footer";
import Naviagtion from "../navigation/Navigation";
import i18n from "../../../i18n";
import { useEffect } from "react";
import useLanguageStore from "@/redux/languageStore";

const TermsAndConditions = () => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div>
        <Naviagtion />
        <div className="xl:lg:px-40 md:px-20 px-10 w-full my-12 text-[rgb(0,0,0,0.6)]">
          <h2 className="text-4xl font-bold">Conditions for Use</h2>
          <br />
          <p>
            {`The Gamo Development Association website (the “Website”)
             is published by the Gamo Development Association, Arba Minch Town 
             Adminstration, Gamo zone, (the “GaDA”, or “we”). Please read carefully 
             the following conditions for use before using our website. We may revise 
             these conditions for use from time to time (such conditions for use, as they 
             may be revised from time to time, are hereafter referred to as the “Conditions”), 
             with the revised Conditions taking effect for all users as of the date stated on 
             the posting. Consequently, we invite you to consult the Conditions regularly.
              The Conditions apply to all users of our website. By accessing or using our website,
               you confirm your acceptance of the Conditions and your agreement to be bound by them.`}
          </p>
          <br />
          <h4 className="text-xl font-bold ">Intellectual property rights</h4>
          <p>
            {`Our website has been created by the GaDA and the whole of its contents, including texts, still or moving images, data bases, programmes, etc., may be protected by intellectual property rights, including copyright. Unless otherwise indicated, all intellectual property rights relating to our website are the GaDA’s exclusive property. You are free to share, copy and redistribute all or part of our website for non-commercial use only, provided that (a) no changes are made, (b) the source is acknowledged and (c) you do not suggest that the GaDA.`}
          </p>
          <br />
          <h4 className="text-xl font-bold ">Supply of information</h4>
          <p>
            {`Unless otherwise indicated, the information contained on our website is intended for general information purposes only. We make no undertaking as to whether the information on our website is adapted or available for use on any territory other than that of Ethiopia. Users who decide to access our website from other geographical areas do so at their own risk and are entirely responsible for observance of the local laws and norms in force in this regard.`}
          </p>
          <br />
          <h4 className="text-xl font-bold ">Disclaimer</h4>
          <p>
            {` Although we have made reasonable efforts to ensure that the information on our website is accurate, we do not guarantee the accuracy, correctness, precision, thoroughness or completeness of said information. Under no circumstances whatsoever shall the GaDA be liable for any damage arising out of or in connection with the use of our Website or of the information, pictures and videos provided or displayed on our Website, whether direct or indirect and whether arising in contract, tort or otherwise. Downloading, or loading by any other means, of the contents of our website is performed entirely at your own discretion and at your own risk, and you will be entirely responsible for any possible damage to your computer system or the possible loss of data resulting from the downloading of the aforesaid contents. The terminology used and presentation of information on our website does not entail any formal recognition on the part of the GaDA regarding the legal status of the countries, territories, cities, towns or zones, nor of their authorities, nor of the position of their frontiers. Unless otherwise indicated, the information and statements on our website should not be taken as necessarily representing the official position of the GaDA.`}
          </p>
          <br />
          <h4 className="text-xl font-bold ">Links and linking</h4>
          <p>
            {`Our website may contain links to websites operated by third parties. We do not control these sites and cannot be held responsible for their content or policies. Hence, you access and use such websites at your own risk.`}
          </p>
          <br />
          <h4 className="text-xl font-bold ">Personal data protection</h4>
          <p>
            {`With in the framework of the collection and processing of personal data, the GaDA is bound by Ethiopian legislation on data protection. For further information, please consult our Privacy Policy.`}
          </p>
          <br />
          <h4 className="text-xl font-bold ">
            Applicable law and jurisdiction
          </h4>
          <p>
            {`The Conditions as well as the use of our Website shall be exclusively governed by Ethiopian law without regard to its conflicts of laws rules. The competent courts of FDRE shall have exclusive jurisdiction over any disputes arising out of or in connection with the Conditions or the use of our Website. The English version of the Conditions is provided for information only.`}
          </p>
          <br />
        </div>
        <Footer />
      </div>
    </I18nextProvider>
  );
};

export default TermsAndConditions;
