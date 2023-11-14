import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "./RepoRow.module.scss";
import { formatDate } from "../../utils/formatDate";
import { ISortedData, IEdge } from "../../utils/types";

interface RepoRowProps {
  selectedRepo: IEdge | null;
  repo: ISortedData;
  handleRowClick: (cursor: string) => void;
}

function RepoRow({ selectedRepo, repo, handleRowClick }: RepoRowProps) {
    return (
      <TableRow
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        onClick={() => handleRowClick(repo?.cursor)}
        className={
          repo.cursor === selectedRepo?.cursor
            ? styles.activeRow
            : styles.row
        }
      >
        <TableCell component="th" scope="row">
          {repo.name}
        </TableCell>
        <TableCell>{repo.language}</TableCell>
        <TableCell>{repo.forksNumber}</TableCell>
        <TableCell>{repo.starsNumber}</TableCell>
        <TableCell>{formatDate(repo.date)}</TableCell>
      </TableRow>
    );
  };
  
export default RepoRow;