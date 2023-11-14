import React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { StyledEngineProvider } from "@mui/material/styles";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import styles from "./TableHeader.module.scss";
import { HeadCell, ISortedData } from "../../utils/types";

interface TableHeaderProps {
  headCells: HeadCell[];
  order: "asc" | "desc";
  orderBy: keyof ISortedData;
  createSortHandler: (
    property: keyof ISortedData
  ) => (event: React.MouseEvent<unknown>) => void;
}

function TableHeader({
  headCells,
  order,
  orderBy,
  createSortHandler,
}: TableHeaderProps) {
  return (
    <StyledEngineProvider injectFirst>
      <TableHead className={styles.tableHead}>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              className={styles.tableCell}
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                className={styles.tableSortLabel}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    </StyledEngineProvider>
  );
}

export default TableHeader;
