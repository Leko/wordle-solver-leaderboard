import { Box, Button } from "@mui/material";
import { DataGrid, DataGridProps, GridEnrichedColDef } from "@mui/x-data-grid";
import { NextLinkComposed } from "./NextLinkComposed";
import styles from "./ScoreBoard.module.css";

type Props = {};

export function rankColumn(): GridEnrichedColDef {
  return {
    width: 16,
    align: "center",
    headerName: "#",
    field: "_rank",
    cellClassName: styles.rank,
    sortable: false,
  };
}

export function wordleIdColumn(): GridEnrichedColDef {
  return {
    width: 16,
    align: "center",
    headerName: "ID",
    field: "wordleId",
    sortable: false,
  };
}

export function userLinkColumn(): GridEnrichedColDef {
  return {
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
  };
}

export function statusColumn(): GridEnrichedColDef {
  return {
    width: 80,
    align: "center",
    headerName: "Status",
    field: "success",
    sortable: false,
    valueFormatter({ value }) {
      return value ? "✅" : "❌";
    },
  };
}

export function turnsColumn(): GridEnrichedColDef {
  return {
    width: 72,
    headerName: "Turns",
    type: "number",
    field: "turns",
    sortable: false,
    valueFormatter: ({ api, id, value }) =>
      api.getRow(id!)?.success ? value : "-",
  };
}

export function durationColumn(): GridEnrichedColDef {
  return {
    headerName: "Duration",
    type: "number",
    field: "duration",
    sortable: false,
    valueFormatter: ({ value }) =>
      typeof value === "number" ? `${(value / 1000).toFixed(3)}s` : "",
  };
}

export function detailLinkColumn(): GridEnrichedColDef {
  return {
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
  };
}

export function ScoreBoard(props: Omit<DataGridProps, "getRowId"> & Props) {
  const { columns, rows } = props;

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
