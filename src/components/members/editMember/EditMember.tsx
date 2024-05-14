"use client";

import {
  Button,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import PageHeader from "../../shared/PageHeader";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import IndividualMember from "./IndividualMember";
import InstitutionMember from "./InstitutionMember";
import { Member, MembershipType } from "@prisma/client";

const EditMember = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [member, setMember] = useState<Member>();
  const [membershipType, setMembershipType] = useState<string>(
    member?.membershipType ? member.membershipType : MembershipType.Individual
  );
  const { register, handleSubmit, watch } = useForm({
    defaultValues: async () => {
      const res = await axios.get(`/api/member/fetch/${id}`);

      if (res?.status === 200) {
        setMember(res.data.value);
      }
      return res.data.value;
    },
  });

  // const fetchSingleMember = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(`/api/member/fetch/${id}`);

  //     if (res?.status === 200) {
  //       setMember(res.data.value);
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //     dispatch(
  //       showToastAction({
  //         message: err?.response?.data?.error ?? "something went wrong",
  //         type: "error",
  //       })
  //     );
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    if (member?.membershipType) {
      setMembershipType(member?.membershipType);
    }
  }, [member]);
  // console.log("hap++++++++++++++++++++++", watch("hasPaid"));
  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/member/register", {
        ...values,
      });

      if (res?.status === 200) {
        router.push("/admin/dashboard/members");
      }
    } catch (err: any) {
      console.error(err);
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "something went wrong",
          type: "error",
        })
      );
    }
    setLoading(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto">
      <PageHeader />
      <div className="px-[40px] w-full flex flex-col mt-10">
        <span className="text-titleColor font-bold text-3xl">
          Edit Member Registration Form
        </span>
        <form onSubmit={handleSubmit(handleRegister)} className="mb-12">
          <div className="flex flex-col w-full my-10">
            <RadioGroup
              value={membershipType}
              className="flex flex-row items-center gap-6 mb-6"
            >
              <span className="font-bold">Membership Type</span>
              <FormControlLabel
                value={MembershipType.Individual}
                control={<Radio size="small" />}
                label={MembershipType.Individual}
                className="text-titleColor"
              />
              <FormControlLabel
                value={MembershipType.Company}
                control={<Radio size="small" />}
                label={MembershipType.Company}
                className="text-titleColor"
              />
            </RadioGroup>
            {member?.membershipType === MembershipType.Individual ? (
              <IndividualMember register={register} watch={watch} />
            ) : (
              <InstitutionMember register={register} watch={watch} />
            )}
            <div className="flex flex-row items-center justify-between gap-6 my-4">
              <span className="font-bold flex flex-row items-center gap-6">
                <span>Payment</span>
                <Switch
                  defaultChecked={watch("hasPaid") === "true" ? true : false}
                  {...register("hasPaid")}
                />
              </span>
              <div className="border-b-[1px] flex-1 border-b-titleColor opacity-25" />
            </div>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="text-titleColor text-sm">
              <strong>NB:</strong> I endorse that{" "}
              {watch("firstName")
                ? watch("firstName")
                : watch("institutionName")}{" "}
              has paid his monthly contribution.
            </span>
            <Button
              type="submit"
              variant="contained"
              className="bg-primaryColor text-white px-10 py-4 font-bold w-[250px] h-[60px]"
            >
              {loading ? <CircularProgress className="text-white" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMember;
