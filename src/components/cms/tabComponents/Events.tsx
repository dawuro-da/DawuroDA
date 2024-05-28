import { Edit, SearchOutlined } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import { useState } from "react";

const Events = () => {
  const [searching, setSearching] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  return (
    <div className="flex flex-row flex-1 mt-2 text-[#7C7C7C] h-full">
      <div className="h-full">
        <div className="lg:pl-[40px] md:pl-[40px] pl-[20px] py-4 pr-6 flex flex-col border-[1px] gap-4 border-[#d1d1d1] border-r-0 h-[140px]">
          <div className="flex flex-row justify-between items-center">
            <span className="font-bold text-xl">Events</span>
            <span>
              <Edit />
              <span className="rotate-90 font-bold text-xl">...</span>
            </span>
          </div>
          <TextField
            fullWidth
            id="navbar-searchfield"
            size="small"
            name="searchText"
            variant="filled"
            value={searchText}
            onChange={(e) => {
              if (e.target.value === "") {
                setSearching(!searching);
              }
              setSearchText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearching(!searching);
              }
            }}
            hiddenLabel
            placeholder="Search by name, id, phone..."
            InputProps={{
              startAdornment: (
                <IconButton
                  style={{
                    borderRadius: "16px",
                    borderLeft: 20,
                  }}
                  onClick={() => {
                    setSearching(!searching);
                  }}
                >
                  <SearchOutlined style={{ color: "#555555" }} />
                </IconButton>
              ),
              disableUnderline: true,
              sx: {
                width: { md: "100%", lg: 300 },
                color: "#555555",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                paddingLeft: 0,
                paddingRight: 2,
              },
            }}
          />
        </div>
      </div>
      <div className="border-[1px] border-[#d1d1d1] gap-4 flex-1 overflow-y-auto h-full">
        <div className="h-[139px] w-full border-b-[1px] border-[#d1d1d1] lg:pr-[40px] md:pr-[40px] pr-[20px] pl-6 flex flex-row items-center">
          Charitable Donations to boost productivity as a whole
        </div>
      </div>
    </div>
  );
};

export default Events;
