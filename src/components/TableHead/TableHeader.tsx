import React from 'react';
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from "@mui/material/Box";
import { visuallyHidden } from '@mui/utils';
import { ISortedData} from "../../utils/types";

interface HeadCell {
  id: keyof ISortedData;
  label: string;
}

interface TableHeaderProps {
  headCells: HeadCell[];
  order: 'asc' | 'desc';
  orderBy: keyof ISortedData;
  createSortHandler: (property: keyof ISortedData) => (event: React.MouseEvent<unknown>) => void;
}

// Функциональный компонент TableHeader отображает заголовки в таблице данных и выполняет сортировку при клике на заголовок
function TableHeader({ headCells, order, orderBy, createSortHandler }: TableHeaderProps) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc'
                    ? 'sorted descending'
                    : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;