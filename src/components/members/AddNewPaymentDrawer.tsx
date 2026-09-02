import { showToastAction } from "@/redux/actions";
import { getMinimumContribution } from "@/util/helper";
import { useMembershipLevels } from "@/util/useMembershipLevels";
import { Close } from "@mui/icons-material";
import { Button, Drawer, MenuItem, Select, TextField } from "@mui/material";
import { ContributionSystem, Member } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface AddNewPaymentProps {
  member: Member;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}
const AddNewPaymentDrawer = ({
  member,
  open,
  onClose,
  onRefresh,
}: AddNewPaymentProps) => {
  const [contributionSystem, setContributionSystem] =
    useState<ContributionSystem>(member.contributionSystem);
  const [amount, setAmount] = useState<string>();
  const [minimumAmount, setMinimumAmount] = useState<Number>();
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const { levels } = useMembershipLevels();

  useEffect(() => {
    if (member && contributionSystem && levels.length) {
      const minAmount = getMinimumContribution({
        membershipType: member.membershipType,
        contributionSystem: contributionSystem
          ? contributionSystem
          : member.contributionSystem,
        membershipLevel: member.membershipLevel,
        levels,
      });
      setMinimumAmount(minAmount);
      if (amount && minAmount > parseFloat(amount)) {
        setError(`Contribution Amount should be above ${minAmount}`);
      } else {
        setError("");
      }
    }
  }, [member, amount, contributionSystem, levels]);

  const handleAddPayment = async () => {
    if (!contributionSystem && !amount && !member.id) {
      setError("amount is required");
    }
    const res = await axios.post("/api/contribution/add", {
      contributionSystem,
      contributionAmount: amount,
      memberId: member.id,
    });
    if (res.status === 200) {
      dispatch(
        showToastAction({ message: "Successfully Added", type: "success" })
      );
      onRefresh()
      onClose();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="gap-6 flex flex-col p-10">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row justify-center gap-2 items-center text-titleColor cursor-pointer font-bold text-xl">
            Add New Payment
          </div>
          <Close onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="flex flex-col gap-2 mt-10">
          <span className="text-titleColor text-sm font-bold">
            Contribution system
          </span>
          <div className="min-w-[130px]">
            <Select
              className="w-full p-[1px]"
              defaultValue={member.contributionSystem}
              size="small"
              onChange={(e) =>
                setContributionSystem(e.target.value as ContributionSystem)
              }
            >
              <MenuItem value={ContributionSystem?.Yearly}>
                {ContributionSystem?.Yearly}
              </MenuItem>
              <MenuItem value={ContributionSystem?.Quarterly}>
                {ContributionSystem?.Quarterly}
              </MenuItem>
              <MenuItem value={ContributionSystem?.Monthly}>
                {ContributionSystem?.Monthly}
              </MenuItem>
            </Select>
          </div>{" "}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-titleColor text-sm font-bold">
            Contribution Amount
          </span>
          <TextField
            size="small"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            type="number"
            placeholder=""
            className="border-2 rounded-[16px] "
            inputProps={{ style: { padding: 10 } }}
            helperText={`As per your ${member.membershipLevel} Level membership, the contribution amount is >=${minimumAmount}`}
            error={Boolean(error)}
          />
        </div>
        <Button
          variant="contained"
          className="px-10 mt-4"
          onClick={handleAddPayment}
        >
          Submit
        </Button>
      </div>
    </Drawer>
  );
};

export default AddNewPaymentDrawer;
