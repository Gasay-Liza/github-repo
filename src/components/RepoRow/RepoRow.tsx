import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "./RepoRow.module.scss";
import { formatDate } from "../../utils/formatDate";
import { IEdge } from "../../utils/types";

interface RepoRowProps {
  selectedRepo: IEdge | null;
  repo: IEdge;
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
          {repo.node.name}
        </TableCell>
        <TableCell>{repo?.node.primaryLanguage?.name}</TableCell>
        <TableCell>{repo.node.forkCount}</TableCell>
        <TableCell>{repo.node.stargazerCount}</TableCell>
        <TableCell>{formatDate(repo.node.updatedAt)}</TableCell>
      </TableRow>
    );
  };
  
export default RepoRow;