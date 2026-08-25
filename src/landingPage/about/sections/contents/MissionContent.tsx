import { Skeleton } from "@mui/material";
import { AboutContent as AboutContentType } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MissionContent = () => {
  const { i18n } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [contents, setContents] = useState<AboutContentType[]>();
  const [loading, setLoading] = useState(false);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/about/fetch");
      if (res.data.success) {
        setContents(res.data.value.aboutContents);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContents();
  }, []);

  if (loading) {
    return (
      <div className="font-light">
        <Skeleton className="w-1/3 h-8 mb-4" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-8" />
        <Skeleton className="w-1/3 h-8 mb-4" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-8" />
        <Skeleton className="w-1/3 h-8 mb-4" />
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="w-full h-6 mb-2" />
        ))}
      </div>
    );
  }

  const vision = contents?.find((item) => item.section === "VISION");
  const mission = contents?.find((item) => item.section === "MISSION");
  const objective = contents?.find((item) => item.section === "OBJECTIVE");

  const objectiveItems =
    (isAmharic ? objective?.itemsAmharic : objective?.items) ?? [];

  return (
    <div className="font-light">
      {vision && (
        <>
          <h1 className="text-2xl font-bold">
            {isAmharic ? vision.titleAmharic : vision.title}
          </h1>
          <br />
          <p>{isAmharic ? vision.bodyAmharic : vision.body}</p>
          <br />
        </>
      )}

      {mission && (
        <>
          <h1 className="text-2xl font-bold">
            {isAmharic ? mission.titleAmharic : mission.title}
          </h1>
          <br />
          <p>{isAmharic ? mission.bodyAmharic : mission.body}</p>
          <br />
        </>
      )}

      {objective && (
        <>
          <h1 className="font-bold text-2xl">
            {isAmharic ? objective.titleAmharic : objective.title}
          </h1>
          <br />
          <ul className="list-disc mx-6">
            {objectiveItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MissionContent;
