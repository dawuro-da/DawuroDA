import { LinearProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export interface PageState {
  page?: number;
  pageSize?: number;
}

/**
 *
 * @param DashboardDatagrid takes configured columns and rows.
 * 					- rows should be array
 * 					- has custom pagination and GridToolbar with search and filter fields
 * @returns  a datagrid table with pagination and GridToolbar
 */

interface DashboardDatagridProps {
  columns: GridColDef[];
  rows: any[];
  loading: boolean;
}

const DashboardDatagrid = ({
  columns,
  rows,
  loading,
}: DashboardDatagridProps) => {
  return (
    <DataGrid
      columns={columns}
      loading={loading}
      rows={rows}
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
      onRowClick={(params) => {}}
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
  );
};
export default DashboardDatagrid;

export const datagridStyle = {
  height: "100%",
  width: "100%",
  border: "none",
  paddingBottom: "0px",
  borderRadius: "16px",
  background: "transparent",
  overflowX: "auto",
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 600,
    fontSize: "14px",
    minHeight: "34px",
    display: "none",
  },
  "& .MuiDataGrid-columnHeaders": {
    background: "#ebf2f7",
    borderBottom: "none",
    border: "none",
    borderRadius: "16px",
    display: "none",
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
