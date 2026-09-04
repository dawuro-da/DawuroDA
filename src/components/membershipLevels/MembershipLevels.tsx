"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showToastAction } from "@/redux/actions";
import { MembershipLevelConfig } from "@prisma/client";
import { FieldValues, useForm } from "react-hook-form";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Close, Edit } from "@mui/icons-material";

// Add/delete are disabled for now (see openCreateForm/handleDelete below,
// commented out rather than removed) — only editing the contribution amount
// of the 5 existing levels is allowed. Re-enable by uncommenting the button,
// the actions-column delete icon, and the two handlers.
const MembershipLevels = () => {
  const dispatch = useDispatch();
  const [levels, setLevels] = useState<MembershipLevelConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<MembershipLevelConfig>();
  // const [deletingLevel, setDeletingLevel] = useState<MembershipLevelConfig>();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/cms/membershipLevel/fetch");
      if (res.data.success) setLevels(res.data.value);
    } catch (err) {
      console.warn(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // const openCreateForm = () => {
  //   setEditingLevel(undefined);
  //   reset({
  //     name: "",
  //     nameAmharic: "",
  //     sortOrder: levels.length,
  //     individualMonthly: 0,
  //     companyMonthly: 0,
  //     idTemplateImage: "",
  //     isActive: true,
  //   });
  //   setFormOpen(true);
  // };

  const openEditForm = (level: MembershipLevelConfig) => {
    setEditingLevel(level);
    reset({
      individualMonthly: Math.round(level.individualYearlyMin / 12),
      companyMonthly: Math.round(level.companyYearlyMin / 12),
    });
    setFormOpen(true);
  };

  const individualMonthly = Number(watch("individualMonthly")) || 0;
  const companyMonthly = Number(watch("companyMonthly")) || 0;

  const handleSave = async (values: FieldValues) => {
    if (!editingLevel) return;
    setSaving(true);
    try {
      const payload = {
        individualYearlyMin: (Number(values.individualMonthly) || 0) * 12,
        companyYearlyMin: (Number(values.companyMonthly) || 0) * 12,
      };
      const res = await axios.post(
        `/api/cms/membershipLevel/edit/${editingLevel.id}`,
        payload
      );

      if (res.data.success) {
        dispatch(
          showToastAction({ message: "Successfully saved", type: "success" })
        );
        setFormOpen(false);
        fetchLevels();
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

  // const handleDelete = async () => {
  //   if (!deletingLevel) return;
  //   try {
  //     const res = await axios.post(
  //       `/api/cms/membershipLevel/delete/${deletingLevel.id}`
  //     );
  //     if (res.data.success) {
  //       dispatch(
  //         showToastAction({ message: "Level deleted", type: "success" })
  //       );
  //       fetchLevels();
  //     }
  //   } catch (err: any) {
  //     dispatch(
  //       showToastAction({
  //         message: err?.response?.data?.error ?? "Unable to delete",
  //         type: "error",
  //       })
  //     );
  //   }
  //   setDeletingLevel(undefined);
  // };

  const columns: GridColDef[] = [
    { field: "sortOrder", headerName: "Order", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 130 },
    {
      field: "nameAmharic",
      headerName: "Amharic Name",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => params.value || "—",
    },
    {
      field: "individualYearlyMin",
      headerName: "Individual Min (ETB/yr)",
      flex: 1,
      minWidth: 170,
      renderCell: (params) => params.value.toLocaleString(),
    },
    {
      field: "companyYearlyMin",
      headerName: "Company Min (ETB/yr)",
      flex: 1,
      minWidth: 170,
      renderCell: (params) => params.value.toLocaleString(),
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
          {/* <IconButton
            size="small"
            onClick={() => setDeletingLevel(params.row)}
            title="Delete"
          >
            <Delete fontSize="small" />
          </IconButton> */}
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
              Membership Levels
            </span>
            <span className="text-[#7C7C7C] text-sm max-w-xl">
              Update the minimum monthly contribution for each level — the
              yearly amount is calculated automatically. Adding, removing, or
              renaming levels is disabled for now.
            </span>
          </div>
          {/* <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateForm}
            className="bg-primaryColor shadow-none capitalize"
          >
            Add Level
          </Button> */}
        </div>

        <div className="bg-white rounded-lg" style={{ height: 500 }}>
          <DataGrid
            rows={levels}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            hideFooter={levels.length <= 100}
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
          Edit {editingLevel?.name} Amount
          <IconButton onClick={() => setFormOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <TextField
                label="Individual Monthly Amount (ETB/month)"
                type="number"
                {...register("individualMonthly", {
                  required: "Required",
                  min: { value: 0, message: "Must be 0 or more" },
                })}
                error={Boolean(errors.individualMonthly)}
                helperText={errors.individualMonthly?.message?.toString()}
                fullWidth
              />
              <span className="text-[#7C7C7C] text-sm pl-1">
                Yearly: {(individualMonthly * 12).toLocaleString()} ETB/year
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <TextField
                label="Company Monthly Amount (ETB/month)"
                type="number"
                {...register("companyMonthly", {
                  required: "Required",
                  min: { value: 0, message: "Must be 0 or more" },
                })}
                error={Boolean(errors.companyMonthly)}
                helperText={errors.companyMonthly?.message?.toString()}
                fullWidth
              />
              <span className="text-[#7C7C7C] text-sm pl-1">
                Yearly: {(companyMonthly * 12).toLocaleString()} ETB/year
              </span>
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

      {/* <DeleteModal
        open={Boolean(deletingLevel)}
        onClose={() => setDeletingLevel(undefined)}
        onRemove={handleDelete}
        nameTobeDeleted={deletingLevel?.name ?? ""}
        itemName="membership level"
      /> */}
    </div>
  );
};

export default MembershipLevels;
