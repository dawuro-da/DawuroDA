import AdminSettingHeader from "./AdminSettingHeader";

const Settings = () => {
  return (
    <div className="flex flex-col w-full h-screen bg-[#f5f5f5] ">
      <AdminSettingHeader />
      <div className=" h-full w-full flex flex-col items-center ">
        <div className="max-w-[700px] mt-20">
          <span>hello there</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
