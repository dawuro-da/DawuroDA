import Image from "next/image";
import { useTranslation } from "react-i18next";

const CEOMessage = () => {
  const { t } = useTranslation();
  return (
    <div className="font-light">
      <div className="mb-8">
        <Image
          src={"/images/president.svg"}
          height={20}
          unoptimized
          width={20}
          alt=""
          className="w-full mb-6"
        />
        <p>
          {t("about.CEO_info")}{" "}
          <span className="font-bold">{t("about.CEO_info2")}</span>
        </p>
        <p className="italic">{t("about.CEO_message_date")}</p>
      </div>

      <p>{t("about.CEO_message_description")}</p>
    </div>
  );
};

export default CEOMessage;
