import {
  Add,
  ChevronLeft,
  ChevronRight,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Pagination,
  PaginationItem,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { PAGINITATION_PAGE_SIZE as pageSize } from "@/constants/variables";

export interface PageState {
  page?: number;
  pageSize?: number;
}

/**
 *
 * @param CustomGridToolbar customized grid toolbar with onChange and value prop
 * 					to handle search.
 * @returns toolbar for datagrid
 */

interface CustomGridToolbarProps {
  onChange: () => void;
  value: string;
  onAddClick: () => void;
  onSearchFired: () => void;
  isSmScreen: boolean;
  addBtnTitle: string;
  filter?: () => JSX.Element;
}

function CustomGridToolbar(props: CustomGridToolbarProps) {
  return (
    <GridToolbarContainer
      sx={{
        py: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: props.isSmScreen ? "column-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          fullWidth
          id="navbar-searchfield"
          size="small"
          name="searchText"
          variant="filled"
          value={props.value}
          onChange={props.onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.onSearchFired();
            }
          }}
          hiddenLabel
          placeholder="Search by name or email etc..."
          InputProps={{
            endAdornment: (
              <IconButton
                style={{
                  borderRadius: "8px",
                  borderRight: 20,
                }}
              >
                <SearchOutlined style={{ color: "#009ED3" }} />
              </IconButton>
            ),
            disableUnderline: true,
            sx: {
              width: { md: "100%", lg: 450 },
              color: "#009ED3",
              backgroundColor: "#ebf2f7",
              borderRadius: "8px",
              paddingLeft: 2,
              paddingRight: 0,
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "100%",
            gap: 2,
            marginBottom: props.isSmScreen ? 1 : 0,
          }}
        >
          {props.filter && props.filter()}
          {props.onAddClick && (
            <div
              className={`${
                props.isSmScreen
                  ? "w-full flex flex-row justify-end"
                  : "min-w-fit"
              }`}
            >
              <Button
                onClick={props.onAddClick}
                variant="outlined"
                style={{
                  minWidth: "fit-content",
                  color: "#009ED3",
                  border: "1px solid #009ED3",
                  borderRadius: "8px",
                  boxShadow: "1px 5px 10px rgb(0,0,0,0.2)",
                }}
              >
                <span className="flex flex-row items-center gap-1">
                  <Add />
                  {props.addBtnTitle}
                </span>
              </Button>
            </div>
          )}
        </Box>
      </Box>
    </GridToolbarContainer>
  );
}

const paginationBtnStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  border: "1px solid",
  padding: 0.4,
};

/**
 *
 * @param AuctionDataGrid takes configured columns and rows.
 * 					- rows should be array
 * 					- has custom pagination and GridToolbar with search and filter fields
 * @returns  a datagrid table with pagination and GridToolbar
 */

interface AuctionDataGridProps {
  columns: GridColDef[];
  rows: any[];
  loading: boolean;
  totalCount: number;
  onPageChange: ({ page, pageSize }: PageState) => void;
  onRowClick?: (data: any) => void;
  generateReport?: (data: any) => void;
  generateLoading?: boolean;
}

const AuctionDataGrid = ({
  columns,
  rows,
  loading,
  totalCount,
  onPageChange,
  onRowClick,
  generateReport,
  generateLoading,
}: AuctionDataGridProps) => {
  const [searchText, setSearchText] = useState("");
  const [paginationState, setPaginationState] = useState({
    pageSize: pageSize,
    page: 1,
    count: Math.ceil(totalCount / pageSize),
  });

  useEffect(() => {
    setPaginationState({
      ...paginationState,
      count: Math.ceil(totalCount / pageSize),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, totalCount]);

  function CustomPagination(paginProps: any) {
    return (
      <div className="flex lg:flex-row md:flex-row xl:flex-row flex-col-reverse lg:items-center xl:items-center md:items-center gap-4 justify-between w-full py-6">
        <span/>{/* <Button
          onClick={paginProps.generateReport && paginProps.generateReport}
          variant="contained"
          className="bg-primaryColor text-white px-10 py-2 h-[40px] font-bold min-w-64"
        >
          {generateLoading ? (
            <CircularProgress className="text-white" />
          ) : (
            "Generate Report"
          )}
        </Button> */}
        <Pagination
          {...paginProps}
          shape="rounded"
          sx={{ color: "#34A858" }}
          page={paginationState.page}
          count={paginationState.count}
          onChange={(e, newpage) => {
            setPaginationState({ ...paginationState, page: newpage });
            if (searchText.length < 1) {
              onPageChange({
                page: newpage,
                pageSize: paginationState.pageSize,
              });
            }
          }}
          renderItem={(item) => (
            <PaginationItem
              components={{
                next: () => (
                  <Box sx={paginationBtnStyle}>
                    <ChevronRight />
                  </Box>
                ),
                previous: () => (
                  <Box sx={paginationBtnStyle}>
                    <ChevronLeft />
                  </Box>
                ),
              }}
              {...item}
            />
          )}
        />
      </div>
    );
  }

  return (
    <DataGrid
      columns={columns}
      loading={loading}
      rows={rows}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: paginationState.pageSize,
            page: paginationState.page,
          },
        },
      }}
      slots={{
        // toolbar: () => (
        //   <CustomGridToolbar
        //     value={searchText}
        //     onChange={() => (event: React.ChangeEvent<HTMLInputElement>) => {
        //       setSearchText(event.target.value);
        //       if (event.target.value === "") {
        //         onSearchFired(event.target.value);
        //       }
        //     }}
        //     onSearchFired={() => onSearchFired(searchText)}
        //     onAddClick={onAddClick ? onAddClick : () => {}}
        //     isSmScreen={isSmScreen}
        //     addBtnTitle={addBtnTitle ? addBtnTitle : ""}
        //     filter={filter}
        //   />
        // ),

        pagination: () => {
          return (
            <CustomPagination
              generateReport={generateReport}
              generateLoading={generateLoading}
            />
          );
        },
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
      onRowClick={(params, event) => {
        if (onRowClick) onRowClick(params.row);
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
  );
};
export default AuctionDataGrid;

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
