import Image from "next/image";
import { useTranslation } from "react-i18next";

const AboutContent = () => {
  const { t } = useTranslation();
  return (
    <div className="font-light">
      <p>{t("about.about_description")}</p>
      <br />
      <Image
        src={"/images/arbaminch.jpg"}
        height={20}
        unoptimized
        width={20}
        alt=""
        className="w-full"
      />
    </div>
  );
};

export default AboutContent;
