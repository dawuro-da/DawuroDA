import { Dawuro_Branches } from "@/constants/datas";
import { international_phone_regex } from "@/constants/regex";
import { showToastAction } from "@/redux/actions";
import { Close, RemoveRedEyeOutlined } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  LinearProgress,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Gender, User, UserRole } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { PhoneNumberInput } from "../shared/PhoneNumberInput";

const AdminManagement = () => {
  const session = useSession();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const dispatch = useDispatch();
  const [adminUsers, setAdminUsers] = useState<User[]>();
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const handleRegister = async (values: FieldValues) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/user/register`, {
        ...values,
      });

      if (res?.status === 200) {
        dispatch(
          showToastAction({
            message: "Successfully Updated",
            type: "success",
          })
        );
        setRefetch(!refetch);
        reset();
        setShowForm(false);
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

  const fetchAdminUsers = async () => {
    setFetchLoading(true);
    try {
      const res = await axios.get(`/api/user/fetch`);

      if (res?.status === 200) {
        setAdminUsers(res.data.value);
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
    setFetchLoading(false);
  };

  useEffect(() => {
    fetchAdminUsers();
  }, [refetch]);

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/user/delete/${id}`);

      if (res?.status === 200) {
        dispatch(
          showToastAction({ message: "Successfully Deleted", type: "success" })
        );
        setSelectedUser(undefined);
        setRefetch(!refetch);
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
    setFetchLoading(false);
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex flex-row items-center gap-3">
          <Avatar
            src={params.row.profilePic ?? ""}
            style={{ width: 30, height: 30 }}
          />
          <span className="capitalize">
            {params.row.firstName} {params.row.lastName}
          </span>
        </div>
      ),
    },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    {
      field: "branch",
      headerName: "Branch",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 200,
      flex: 1,
      renderCell: (params: any) => (
        <span className="capitalize text-xs bg-[rgb(0,0,0,0.09)] px-2 p-1 rounded-lg">
          {params.row.role}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 150,
      flex: 1,
      renderCell: (params: any) => (
        <div className="h-full items-center flex flex-row ">
          <span
            onClick={() => {
              if (session.data?.user?.id !== params.row.id) {
                setSelectedUser(params.row);
              }
            }}
            className={`bg-[#F7DEDE] cursor-pointer text-red-500 
            ${
              session.data?.user?.id === params.row.id &&
              "bg-[#f7f7f7] text-[#000000]"
            }
            flex flex-row items-center gap-2 p-1 px-3 max-h-[40px] rounded-lg capitalize`}
          >
            {session.data?.user?.id !== params.row.id && (
              <Image
                src={"/icons/minusOutlined.svg"}
                alt=""
                height={20}
                width={20}
              />
            )}
            <span>
              {session.data?.user?.id === params.row.id
                ? "current admin"
                : "Remove"}
            </span>
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <div className="flex flex-row items-center justify-between gap-6 w-full mb-4">
        <span className="font-bold">Admins List</span>
        <Button
          onClick={() => setShowForm(true)}
          variant="contained"
          className="bg-white hover:bg-white shadow-none  text-[#555555] capitalize flex flex-row items-center gap-2"
        >
          <span className="text-xl font-bold">+</span>
          <span>Add New Admin</span>
        </Button>
      </div>
      {showForm && (
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col items-center justify-center"
        >
          <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>First Name</label>
              <TextField
                {...register("firstName", {
                  required: "First Name is required",
                })}
                variant="outlined"
                error={Boolean(!!errors.firstName)}
                helperText={
                  !!errors.firstName && errors.firstName.message?.toString()
                }
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Last Name</label>
              <TextField
                {...register("lastName", { required: "Last Name is required" })}
                variant="outlined"
                error={Boolean(!!errors.lastName)}
                helperText={
                  !!errors.lastName && errors.lastName.message?.toString()
                }
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Phone Number</label>
              <PhoneNumberInput
                size="small"
                {...register("phone", {
                  required: "Phone Number is required",
                  pattern: {
                    message: "Phone is not valid",
                    value: international_phone_regex,
                  },
                })}
                variant="outlined"
                inputProps={{ style: { padding: 10, borderRadius: "6px" } }}
                value={watch("phone")}
                onChange={(value) =>
                  setValue("phone", value.replace(/\s+/g, ""))
                }
                type="text"
                placeholder=""
                error={Boolean(!!errors.phone)}
                helperText={!!errors.phone && errors.phone.message?.toString()}
              />
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Email Address</label>
              <TextField
                {...register("email", { required: "Email is required" })}
                variant="outlined"
                error={Boolean(!!errors.email)}
                helperText={!!errors.email && errors.email.message?.toString()}
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Gender</label>
              <TextField
                size="small"
                {...register("gender", {
                  required: "Gender is required",
                })}
                select
                variant="outlined"
                error={Boolean(!!errors.gender)}
                helperText={
                  !!errors.gender && errors.gender.message?.toString()
                }
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              >
                <MenuItem value={Gender.Male}>Male</MenuItem>
                <MenuItem value={Gender.Female}>Female</MenuItem>
              </TextField>
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Branch</label>
              <TextField
                size="small"
                {...register("branch", {
                  required: "Branch is required",
                })}
                select
                variant="outlined"
                error={Boolean(!!errors.branch)}
                helperText={
                  !!errors.branch && errors.branch.message?.toString()
                }
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              >
                {Dawuro_Branches.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <div className="flex flex-col gap-2 text-[#555555] h-full w-[300px]">
              <label>Role</label>
              <TextField
                size="small"
                {...register("role", {
                  required: "Role is required",
                })}
                select
                defaultValue={UserRole.Admin}
                variant="outlined"
                error={Boolean(!!errors.role)}
                helperText={!!errors.role && errors.role.message?.toString()}
                inputProps={{
                  style: {
                    padding: 10,
                    borderRadius: "6px",
                  },
                }}
              >
                <MenuItem value={UserRole.Owner}>Owner</MenuItem>
                <MenuItem value={UserRole.SuperAdmin}>Super Admin</MenuItem>
                <MenuItem value={UserRole.Admin}>Admin</MenuItem>
              </TextField>
            </div>
            <div className="flex flex-col gap-[7px] text-[#555555] h-full w-[300px]">
              <label className="flex flex-row items-center justify-between">
                <span>Password</span>

                {showPassword ? (
                  <Image
                    onClick={() => setShowPassword(!showPassword)}
                    src={"/icons/hideEye.svg"}
                    alt=""
                    className="cursor-pointer"
                    height={20}
                    width={20}
                  />
                ) : (
                  <RemoveRedEyeOutlined
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer"
                    style={{ height: 20, width: 20 }}
                  />
                )}
              </label>
              <TextField
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "password must be at least 6 chars",
                  },
                })}
                autoComplete="false"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                error={Boolean(!!errors.password)}
                helperText={
                  !!errors.password
                    ? errors.password.message?.toString()
                    : "password must be at least 6 chars"
                }
                inputProps={{
                  style: {
                    padding: 9,
                    borderRadius: "6px",
                  },
                }}
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="contained"
            className="w-full gap-2 font-bold h-[40px] text-lg mt-6 text-white capitalize p-2 bg-primaryColor shadow-none px-10"
          >
            {loading ? (
              <CircularProgress className="h-[80%] text-white" />
            ) : (
              <>Register</>
            )}
          </Button>
        </form>
      )}
      <div className="border-b-2 w-full h-1 my-6" />
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          columns={columns}
          loading={fetchLoading}
          rows={adminUsers ?? []}
          slots={{
            pagination: () => <></>,
            loadingOverlay: () => (
              <LinearProgress
                color="info"
                sx={{
                  marginRight: "15px",
                  marginLeft: "15px",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#009ED3",
                  },
                }}
              />
            ),
          }}
          disableDensitySelector
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          sx={{
            ...datagridStyle,
            "&, [class^=MuiDataGrid]": { border: "none", borderBottom: "none" },
          }}
          pagination
          getRowClassName={() => "paxton-table--row"}
        />
      </div>
      <Dialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(undefined)}
      >
        <div className="flex flex-col items-center max-w-[600px] p-6">
          <div className="w-full flex flex-row justify-end">
            <Close
              onClick={() => {
                setSelectedUser(undefined);
              }}
              className="cursor-pointer"
            />
          </div>
          <div className="flex flex-col items-center gap-6 px-12 py-6">
            <span className="font-bold text-3xl">
              Are you sure you want to remove this Admin?
            </span>
            <span className="capitalize flex flex-row items-center gap-2">
              <span>{selectedUser?.role}</span>
              <span className="flex flex-row items-center gap-2 bg-[#f1f1f1] px-2 p-1 rounded-[5px]">
                <Avatar
                  src="/icons/list.png"
                  style={{ width: 30, height: 30 }}
                />
                <span>
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </span>
              </span>
            </span>
            <div className="flex flex-row gap-6 items-center mt-10">
              <Button
                variant="outlined"
                className="text-black border-black"
                onClick={() => setSelectedUser(undefined)}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                className="bg-red-700 border-red-700 hover:bg-red-700 hover:border-red-700 text-white"
                onClick={async () => {
                  if (selectedUser) await handleDelete(selectedUser.id);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminManagement;

const datagridStyle = {
  height: "100%",
  width: "100%",
  border: "none",
  paddingBottom: "0px",
  borderRadius: "0px",
  background: "transparent",
  overflowX: "auto",
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    fontSize: "14px",
    minHeight: "34px",
  },
  "& .MuiDataGrid-columnHeaders": {
    background: "#000000",
    borderBottom: "none",
    borderRadius: "0px",
  },
  "& .MuiDataGrid-cell": {
    color: "#757575",
    borderBottom: "none",
    outline: "none !important",
    alignItems: "center",
  },
  "& .MuiPaginationItem-root": {
    borderRadius: 0,
  },
  // Datagrid Row Styling
  "& .paxton-table--row": {
    marginBottom: 1,
    marginTop: 2,
    borderRadius: "16px",
    cursor: "pointer",
    background: "white",
  },
  // remove borders and separators
  "& .paxton-table--cell": {
    border: "none",
  },
};
