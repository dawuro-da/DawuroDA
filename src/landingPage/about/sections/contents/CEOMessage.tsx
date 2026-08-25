import { Skeleton } from "@mui/material";
import { AboutContent as AboutContentType } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CEOMessage = () => {
  const { i18n } = useTranslation();
  const isAmharic = Boolean(i18n.language === "am");
  const [content, setContent] = useState<AboutContentType>();
  const [loading, setLoading] = useState(false);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/about/fetch");
      if (res.data.success) {
        const ceoMessage = res.data.value.aboutContents.find(
          (item: AboutContentType) => item.section === "CEO_MESSAGE"
        );
        setContent(ceoMessage);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="font-light">
        <Skeleton variant="rectangular" className="w-full h-[300px] mb-6" />
        <Skeleton className="w-1/2 h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6" />
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="font-light">
      <div className="mb-8">
        {content.image && (
          <Image
            src={content.image}
            height={20}
            unoptimized
            width={20}
            alt=""
            className="w-full mb-6"
          />
        )}
        <p className="font-bold">
          {isAmharic ? content.titleAmharic : content.title}
        </p>
        {(isAmharic ? content.subtitleAmharic : content.subtitle) && (
          <p className="italic">
            {isAmharic ? content.subtitleAmharic : content.subtitle}
          </p>
        )}
      </div>

      <p>{isAmharic ? content.bodyAmharic : content.body}</p>
    </div>
  );
};

export default CEOMessage;
