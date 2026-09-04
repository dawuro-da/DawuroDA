"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { BankAccount } from "@prisma/client";
import { FieldValues, useForm } from "react-hook-form";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Add, Close, Delete, Edit } from "@mui/icons-material";
import DeleteModal from "../shared/DeleteModal";

const BankAccounts = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount>();
  const [deletingAccount, setDeletingAccount] = useState<BankAccount>();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/bankAccount/fetch");
      if (res.data.success) setAccounts(res.data.value);
    } catch (err) {
      console.warn(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openCreateForm = () => {
    setEditingAccount(undefined);
    reset({
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      logo: "",
      sortOrder: accounts.length,
      isActive: true,
    });
    setFormOpen(true);
  };

  const openEditForm = (account: BankAccount) => {
    setEditingAccount(account);
    reset({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolderName: account.accountHolderName ?? "",
      logo: account.logo ?? "",
      sortOrder: account.sortOrder,
      isActive: account.isActive,
    });
    setFormOpen(true);
  };

  const handleSave = async (values: FieldValues) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("bankName", values.bankName);
      formData.append("accountNumber", values.accountNumber);
      formData.append("accountHolderName", values.accountHolderName ?? "");
      formData.append("sortOrder", String(Number(values.sortOrder) || 0));
      formData.append("isActive", String(Boolean(values.isActive)));
      formData.append(
        "logo",
        typeof values.logo === "string" ? values.logo : values.logo?.[0]
      );

      const res = editingAccount
        ? await axios.post(
            `/api/cms/bankAccount/edit/${editingAccount.id}`,
            formData
          )
        : await axios.post("/api/cms/bankAccount/create", formData);

      if (res.data.success) {
        dispatch(
          showToastAction({ message: "Successfully saved", type: "success" })
        );
        setFormOpen(false);
        fetchAccounts();
      }
    } catch (err: any) {
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "Unable to save",
          type: "error",
        })
      );
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deletingAccount) return;
    try {
      const res = await axios.post(
        `/api/cms/bankAccount/delete/${deletingAccount.id}`
      );
      if (res.data.success) {
        dispatch(
          showToastAction({ message: "Bank account deleted", type: "success" })
        );
        fetchAccounts();
      }
    } catch (err: any) {
      dispatch(
        showToastAction({
          message: err?.response?.data?.error ?? "Unable to delete",
          type: "error",
        })
      );
    }
    setDeletingAccount(undefined);
  };

  const columns: GridColDef[] = [
    { field: "sortOrder", headerName: "Order", width: 80 },
    {
      field: "logo",
      headerName: "Logo",
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Avatar src={params.value ?? undefined} variant="rounded">
          {!params.value && (params.row.bankName?.[0] ?? "?")}
        </Avatar>
      ),
    },
    { field: "bankName", headerName: "Bank", flex: 1, minWidth: 150 },
    {
      field: "accountNumber",
      headerName: "Account Number",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "accountHolderName",
      headerName: "Account Holder",
      flex: 1,
      minWidth: 170,
      renderCell: (params) => params.value || "—",
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 90,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-row items-center gap-1">
          <IconButton
            size="small"
            onClick={() => openEditForm(params.row)}
            title="Edit"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setDeletingAccount(params.row)}
            title="Delete"
          >
            <Delete fontSize="small" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="p-10 flex flex-col gap-6">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-titleColor font-bold text-3xl">
              Bank Accounts
            </span>
            <span className="text-[#7C7C7C] text-sm max-w-xl">
              These accounts are shown to members who choose to pay by bank
              transfer instead of Chapa. Deactivate an account instead of
              deleting it if members might still have money in transit to it.
            </span>
          </div>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateForm}
            className="bg-primaryColor shadow-none capitalize"
          >
            Add Bank Account
          </Button>
        </div>

        <div className="bg-white rounded-lg" style={{ height: 500 }}>
          <DataGrid
            rows={accounts}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            hideFooter={accounts.length <= 100}
          />
        </div>
      </div>

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex flex-row items-center justify-between">
          {editingAccount ? "Edit Bank Account" : "New Bank Account"}
          <IconButton onClick={() => setFormOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent className="flex flex-col gap-4">
            <TextField
              label="Bank Name"
              {...register("bankName", { required: "Bank name is required" })}
              error={Boolean(errors.bankName)}
              helperText={errors.bankName?.message?.toString()}
              fullWidth
            />
            <TextField
              label="Account Number"
              {...register("accountNumber", {
                required: "Account number is required",
              })}
              error={Boolean(errors.accountNumber)}
              helperText={errors.accountNumber?.message?.toString()}
              fullWidth
            />
            <TextField
              label="Account Holder Name"
              {...register("accountHolderName")}
              helperText="Optional — shown to members alongside the account number"
              fullWidth
            />
            <div className="flex flex-col gap-3">
              <span className="text-titleColor text-sm font-bold">
                Bank Logo
              </span>
              <span className="relative flex flex-row items-center px-6 border-2 border-dashed rounded-[3px] py-2 cursor-pointer h-[65px]">
                <span className="flex flex-row items-center px-2 gap-2 text-titleColor cursor-pointer">
                  <Image
                    src={"/icons/greyGallery.svg"}
                    alt=""
                    height={20}
                    width={20}
                  />
                  <span>
                    {typeof watch("logo") === "string"
                      ? watch("logo")
                        ? watch("logo").slice(0, 40)
                        : "Optional — upload a logo"
                      : watch("logo")?.[0]?.name ?? "Optional — upload a logo"}
                  </span>
                </span>
                <input
                  id="logo"
                  {...register("logo", {
                    validate: {
                      fileSize: (value: any) => {
                        if (!(typeof value === "string") && value && value[0]) {
                          if (value[0].size > 1048576) {
                            dispatch(
                              showToastAction({
                                message: `Image size must be less than 1MB`,
                                type: "error",
                              })
                            );
                            return "Image size must be less than 1MB";
                          }
                          return value[0].size < 1048576;
                        }
                        return true;
                      },
                    },
                  })}
                  accept="image/*"
                  type="file"
                  placeholder=""
                  className="z-10 absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="flex flex-row items-center justify-center outline-none z-0 gap-2 absolute bg-white text-titleColor right-4 px-4 py-2 cursor-pointer">
                  <Image
                    src={"/icons/uploadIcon.svg"}
                    alt=""
                    height={20}
                    width={20}
                  />
                  <span>Upload</span>
                </Button>
              </span>
              <span className="text-xs text-red-500">
                {errors.logo && errors.logo.message?.toString()}
              </span>
            </div>
            <TextField
              label="Sort Order"
              type="number"
              {...register("sortOrder")}
              helperText="Lower numbers appear first"
              fullWidth
            />
            <div className="flex flex-row items-center gap-2">
              <Switch
                checked={Boolean(watch("isActive"))}
                onChange={(e) => setValue("isActive", e.target.checked)}
              />
              <span>Active (visible to members)</span>
            </div>
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={() => setFormOpen(false)} className="capitalize">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              className="bg-primaryColor shadow-none capitalize"
            >
              {saving ? <CircularProgress size={20} /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DeleteModal
        open={Boolean(deletingAccount)}
        onClose={() => setDeletingAccount(undefined)}
        onRemove={handleDelete}
        nameTobeDeleted={deletingAccount?.bankName ?? ""}
        itemName="bank account"
      />
    </div>
  );
};

export default BankAccounts;
