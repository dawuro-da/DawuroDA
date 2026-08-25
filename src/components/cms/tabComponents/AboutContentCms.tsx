import { CircularProgress, IconButton } from "@mui/material";
import { AboutContent } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import AboutContentEdit from "./AboutContentEdit";

const SECTIONS = [
  { section: "OUR_STORY", label: "Our Story" },
  { section: "CEO_MESSAGE", label: "CEO Message" },
  { section: "MISSION", label: "Mission" },
  { section: "VISION", label: "Vision" },
  { section: "OBJECTIVE", label: "Objective" },
];

const AboutContentCms = () => {
  const [refetch, setRefetch] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [aboutContents, setAboutContents] = useState<AboutContent[]>();
  const [selectedSection, setSelectedSection] = useState<string>();

  const fetchAboutContents = async () => {
    setFetchLoading(true);
    const result = await axios.post("/api/cms/about/fetch");

    if (result.data.success) {
      setAboutContents(result.data.value.aboutContents);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchAboutContents();
  }, [refetch]);

  const selectedContent = aboutContents?.find(
    (item) => item.section === selectedSection
  );

  return (
    <div className="flex flex-row flex-1 mt-2 text-[#7C7C7C] h-full w-full min-w-fit">
      <div className="h-full flex flex-col max-w-[400px] min-w-[300px] border-r-[1px] border-[#d1d1d1]">
        <div className="lg:pl-[40px] md:pl-[40px] pl-[20px] py-4 pr-6 flex flex-col border-[1px] gap-4 border-[#d1d1d1] border-r-0 h-[140px] justify-center">
          <span className="font-bold text-xl">About Page Content</span>
          <span className="text-sm">
            Manage the content shown on the public About page.
          </span>
        </div>
        <div className="flex-1 px-4 mt-6 flex flex-col gap-4 overflow-y-auto hiddenscrollbar">
          {fetchLoading ? (
            <CircularProgress />
          ) : (
            SECTIONS.map((item) => {
              const content = aboutContents?.find(
                (c) => c.section === item.section
              );
              return (
                <div
                  key={item.section}
                  onClick={() => setSelectedSection(item.section)}
                  className={`relative w-full h-[50px] flex flex-row items-center ${
                    selectedSection === item.section && "bg-[#e5e5e6]"
                  } gap-2 hover:bg-[#e5e5e6] cursor-pointer px-2`}
                >
                  <span className="overflow-clip text-ellipsis text-nowrap flex-1 max-w-[70%]">
                    {item.label}
                  </span>
                  <IconButton className="absolute right-0">
                    <Image
                      src={
                        content && !content.isDraft
                          ? "/icons/uploadGreen.svg"
                          : "/icons/draft.svg"
                      }
                      alt=""
                      width={20}
                      height={20}
                    />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedSection ? (
        <AboutContentEdit
          section={selectedSection}
          label={
            SECTIONS.find((item) => item.section === selectedSection)
              ?.label ?? selectedSection
          }
          selectedContent={selectedContent}
          refetch={refetch}
          setRefetch={setRefetch}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AboutContentCms;
