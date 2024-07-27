import { Button, Checkbox, TextField } from "@mui/material";
import Image from "next/image";
import { SmsMemberData } from "./SMS";
import { useState } from "react";
import axios from "axios";
import { showToastAction } from "@/redux/actions";
import { useDispatch } from "react-redux";

interface SmsTableProps {
  selectedList: string[];
  setSelectedList: (value: string[]) => void;
  messageToSend: string;
  setMessageToSend: (value: string) => void;
  members: SmsMemberData[];
  loading: boolean;
}

const SmsTable = ({
  selectedList,
  setSelectedList,
  loading,
  members,
  messageToSend,
  setMessageToSend,
}: SmsTableProps) => {
  const dispatch = useDispatch();
  const [selectedCheck, setSelectedCheck] = useState<string>();
  const checkIfSelected = (phone: string) => {
    if (selectedList.includes(phone)) {
      return true;
    }
    return false;
  };

  const onSelectAll = (value: boolean) => {
    if (value) {
      setSelectedCheck("all");
      setSelectedList(members.map((member) => member.phone));
    } else {
      setSelectedCheck(undefined);
      setSelectedList([]);
    }
  };
  const onSelectPaid = (value: boolean) => {
    if (value) {
      setSelectedCheck("paid");
      const paidMember = members.filter((member) => member.hasPaid);
      setSelectedList(paidMember.map((member) => member.phone));
    } else {
      setSelectedCheck(undefined);
      setSelectedList([]);
    }
  };

  const onSelectUnpaid = (value: boolean) => {
    if (value) {
      setSelectedCheck("unpaid");
      const paidMember = members.filter((member) => !member.hasPaid);
      setSelectedList(paidMember.map((member) => member.phone));
    } else {
      setSelectedCheck(undefined);
      setSelectedList([]);
    }
  };

  const onSelectOrDeselect = (value: string) => {
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((item) => item !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };

  const onSendMessage = async () => {
    if (!selectedList.length) {
      dispatch(
        showToastAction({ message: "Please Select Members", type: "error" })
      );
      return;
    } else if (!messageToSend) {
      dispatch(
        showToastAction({ message: "Please write message", type: "error" })
      );
      return;
    }
    try {
      const res = await axios.post("/api/sms/sendMessage", {
        phones: selectedList,
        message: messageToSend,
      });
      if (res.status === 200) {
        dispatch(
          showToastAction({ message: "Successfully Sent", type: "success" })
        );
        setSelectedList([]);
        setMessageToSend("");
        setSelectedCheck("")
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({
          message: err?.response?.data?.error,
          type: "error",
        })
      );
    }
  };
  return (
    <>
      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-row items-center gap-1 text-titleColor bg-white pr-4 rounded-xl">
          <Checkbox
            name="selector"
            checked={selectedCheck === "all"}
            onChange={(e, checked) => onSelectAll(checked)}
          />
          <span>All</span>
        </div>
        <div className="flex flex-row items-center gap-1 text-titleColor bg-white pr-4 rounded-xl">
          <Checkbox
            name="selector"
            checked={selectedCheck === "paid"}
            onChange={(e, checked) => onSelectPaid(checked)}
          />
          <span>Paid</span>
        </div>
        <div className="flex flex-row items-center gap-1 text-titleColor bg-white pr-4 rounded-xl">
          <Checkbox
            name="selector"
            checked={selectedCheck === "unpaid"}
            onChange={(e, checked) => onSelectUnpaid(checked)}
          />
          <span>Unpaid</span>
        </div>
      </div>
      <div className="flex-1 min-h-[400px] max-h-[600px] gap-6 flex flex-col overflow-y-auto hiddenscrollbar">
        {members?.map((member, index) => (
          <div
            key={index}
            className="flex flex-row items-center min-w-full w-fit bg-white gap-10 p-2 rounded-xl"
          >
            <div className="flex flex-row items-center gap-4 flex-1">
              <Checkbox
                checked={checkIfSelected(member.phone)}
                onChange={() => {
                  // if phone is in the list it removes it
                  // otherwise it adds the phone to the list
                  onSelectOrDeselect(member.phone);
                }}
              />
              <span>{member.memberId}</span>
            </div>
            <span className="flex-1">{member.name}</span>
            <span className="flex-1">{member.phone}</span>
          </div>
        ))}
      </div>
      <div className="h-fit flex flex-row gap-2 w-full">
        <div className="bg-white flex-1">
          <TextField
            fullWidth
            id="navbar-searchfield"
            size="small"
            multiline
            name="messageToSend"
            variant="outlined"
            rows={5}
            value={messageToSend}
            onChange={(e) => {
              setMessageToSend(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // setRefetch(!refetch);
              }
            }}
            inputProps={{
              disableUnderline: true,
              sx: {
                width: "100%",
                color: "#555555",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: 1,
                maxWidth: "800px",
              },
            }}
            hiddenLabel
            placeholder="Enter message to be sent"
          />
        </div>
        <div className="h-full flex flex-row items-center justify-center">
          <Button
            variant="outlined"
            onClick={onSendMessage}
            className="flex bg-primaryColor hover:bg-primaryColor flex-row items-center justify-center border-none rounded-full h-[100px] w-[100px] hover:cursor-pointer"
          >
            <Image
              src={"/icons/send.svg"}
              alt=""
              height={60}
              width={60}
              className="h-full ml-3"
            />
          </Button>
        </div>
      </div>
    </>
  );
};
export default SmsTable;
