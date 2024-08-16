"use client";
import { Member, MembershipType } from "@prisma/client";
import IndividualMemberProfile from "./components/IndividualMemberProfile";
import InstitutionMemberProfile from "./components/InstitutionMemberProfile";
import Naviagtion from "@/landingPage/navigation/Navigation";
import { I18nextProvider, useTranslation } from "react-i18next";
import useLanguageStore from "@/redux/languageStore";
import { useEffect } from "react";
import i18n from "../../i18n";

const MemberProfile = ({ member }: { member: Member }) => {
  const { i18n: i18nn } = useTranslation();
  const { language } = useLanguageStore();

  useEffect(() => {
    i18nn.changeLanguage(language);
  }, [language, i18nn]);

  return (
    <I18nextProvider i18n={i18n}>
      <div>
        <Naviagtion bg="bg-white" />

        <div className="xl:lg:px-40 md:px-20 px-10 w-full">
          {member.membershipType === MembershipType.Individual ? (
            <IndividualMemberProfile member={member} />
          ) : (
            <InstitutionMemberProfile member={member} />
          )}
        </div>
      </div>
    </I18nextProvider>
  );
};

export default MemberProfile;
