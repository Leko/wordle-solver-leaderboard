import { Box, Button } from "@mui/material";
import { DataGrid, DataGridProps, GridEnrichedColDef } from "@mui/x-data-grid";
import { NextLinkComposed } from "./NextLinkComposed";
import styles from "./ScoreBoard.module.css";

type Props = {
  showWordleId?: boolean;
  showLinkToDetail?: boolean;
};

export function ScoreBoard(
  props: Omit<DataGridProps, "columns" | "getRowId"> & Props
) {
  const { rows, showWordleId = false, showLinkToDetail = false } = props;
  const columns: GridEnrichedColDef[] = [
    {
      width: 16,
      align: "center",
      headerName: "#",
      field: "_rank",
      cellClassName: styles.rank,
      sortable: false,
    },
  ];
  if (showWordleId) {
    columns.push({
      width: 16,
      align: "center",
      headerName: "ID",
      field: "wordleId",
      sortable: false,
    });
  }
  columns.push(
    {
      flex: 1,
      headerName: "Name",
      field: "userName",
      sortable: false,
      renderCell(params) {
        return (
          <Button
            variant="text"
            size="small"
            component={NextLinkComposed}
            to={{
              pathname: `/contestant/[userName]`,
              query: { userName: params.value },
            }}
          >
            {params.value}
          </Button>
        );
      },
    },
    {
      width: 80,
      align: "center",
      headerName: "Status",
      field: "_status",
      sortable: false,
      renderCell(params) {
        return params.row.success ? "✅" : "❌";
      },
    },
    {
      width: 72,
      headerName: "Turns",
      type: "number",
      field: "turns",
      sortable: false,
      valueFormatter: ({ api, id, value }) =>
        api.getRow(id!)?.success ? value : "-",
    },
    {
      headerName: "Duration",
      type: "number",
      field: "duration",
      sortable: false,
      valueFormatter: ({ value }) =>
        typeof value === "number" ? `${(value / 1000).toFixed(3)}s` : "",
    }
  );
  if (showLinkToDetail) {
    columns.push({
      headerName: "Detail",
      width: 72,
      type: "actions",
      field: "_detail",
      renderCell(params) {
        return (
          <Button
            variant="text"
            size="small"
            component={NextLinkComposed}
            to={{
              pathname: `/history/[userName]/[wordleId]`,
              query: {
                userName: params.row.userName,
                wordleId: params.row.wordleId,
              },
            }}
          >
            Detail
          </Button>
        );
      },
    });
  }

  return (
    <Box sx={{ height: 400, width: { xs: "100%", md: 560 } }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            disableColumnMenu
            disableSelectionOnClick
            getRowId={(row) => row.id}
            getRowClassName={() => styles.rankRow}
            columns={columns}
          />
        </div>
      </div>
    </Box>
  );
}
