import { DataGrid, DataGridProps } from "@mui/x-data-grid";
import styles from "./ScoreBoard.module.css";

export type Row = {
  wordleId: string;
  userName: string;
  turns: number;
  duration: number;
  success: boolean;
};

export function ScoreBoard(props: Omit<DataGridProps, "columns" | "getRowId">) {
  const { rows } = props;
  return (
    <div style={{ height: 400, width: 480, maxWidth: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            disableColumnMenu
            getRowId={(row) => row.id}
            getRowClassName={() => styles.rankRow}
            columns={[
              {
                width: 16,
                align: "center",
                headerName: "#",
                field: "_1",
                cellClassName: styles.rank,
                sortable: false,
              },
              {
                width: 16,
                headerName: "ID",
                field: "wordleId",
                sortable: false,
              },
              {
                flex: 1,
                headerName: "Name",
                field: "userName",
                sortable: false,
              },
              {
                width: 80,
                align: "center",
                headerName: "Status",
                field: "_2",
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
                  typeof value === "number"
                    ? `${(value / 1000).toFixed(3)}s`
                    : "",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
