import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Container from '@mui/material/Container';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from "./Table.module.scss";

function createData(
    name: string,
    lang: string,
    forks: number,
    stars: number,
    date: string,
  ){
    return {
      name,
      lang,
      forks,
      stars,
      date,
    };
  }

  const rows = [
    createData('Название репозитария', 'Python', 8, 36, '00.00.0000'),
    createData('Название репозитария', 'Python', 8, 36, '00.00.0000'),
    createData('Название репозитария', 'Python', 8, 36, '00.00.0000'),
    createData('Название репозитария', 'Python', 8, 36, '00.00.0000'),
    createData('Название репозитария', 'Python', 8, 36, '00.00.0000'),
  
  ];


  export default function BasicTable() {
    return (
        <Container classes={{root: styles.tableWrapper}} sx={{  maxWidth: 100, pl: 0, pr: 0}}>
            <TableContainer classes={{root: styles.wrapper}} sx={{  maxWidth: 960, pl: 3, pr: 3, minHeight:"calc(100vh - 112px)" }} component={Paper}>
                <Table aria-label="git table" classes={{root: styles.table}}>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Язык</TableCell>
              <TableCell>Число форков</TableCell>
              <TableCell>Число звезд</TableCell>
              <TableCell>Дата добавления</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.lang}</TableCell>
                <TableCell>{row.forks}</TableCell>
                <TableCell>{row.stars}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
                </Table>
            </TableContainer>
        </Container>
      
    );
  }