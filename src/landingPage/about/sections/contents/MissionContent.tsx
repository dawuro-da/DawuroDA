import { useTranslation } from "react-i18next";

const MissionContent = () => {
  const { t } = useTranslation();
  return (
    <div className="font-light">
      <h1 className="text-2xl font-bold">{t("about.vision_heading")}</h1>
      <br />
      <p>{t("about.vision_description")}</p>
      <br />

      <h1 className="text-2xl font-bold">{t("about.mission_heading")}</h1>
      <br />
      <p>{t("about.mission_description")}</p>

      <br />
      <h1 className="font-bold text-2xl">{t("about.goals")}</h1>
      <br />
      <ul className="list-disc mx-6">
        <li>{t("about.goal_1")}</li>
        <li>{t("about.goal_2")}</li>
        <li>{t("about.goal_3")}</li>
        <li>{t("about.goal_4")}</li>
        <li>{t("about.goal_5")}</li>
        <li>{t("about.goal_6")}</li>
        <li>{t("about.goal_7")}</li>
        <li>{t("about.goal_8")}</li>
        <li>{t("about.goal_9")}</li>
        <li>{t("about.goal_10")}</li>
        <li>{t("about.goal_11")}</li>
      </ul>
    </div>
  );
};

export default MissionContent;
