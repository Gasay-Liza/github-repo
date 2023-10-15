import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Container from "@mui/material/Container";
import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledEngineProvider } from "@mui/material/styles";
import styles from "./Table.module.scss";
import { useAppDispatch } from '../../app/hooks';
import { fetchPublicRepositories } from "../../app/repositoriesSlice";
import { RootState } from "../../app/store";


export default function BasicTable() {

const dispatch = useAppDispatch();
const repositories = useSelector((state: RootState) => state.repositories.data);
const loading = useSelector((state: RootState) => state.repositories.loading);
const error = useSelector((state: RootState) => state.repositories.error);
console.log("repositories",repositories);
// const [page, setPage] = React.useState(0);
// const [rowsPerPage, setRowsPerPage] = React.useState(5);


 // Смена страницы
//  const handleChangePage = (event: unknown, newPage: number) => {
//   setPage(newPage);
// };

// Смена вида количества строк на странице
// const handleChangeRowsPerPage = (
//   event: React.ChangeEvent<HTMLInputElement>,
// ) => {
//   setRowsPerPage(parseInt(event.target.value, 10));
//   setPage(0);
// };

useEffect(() => {
      dispatch(fetchPublicRepositories());
    }, [dispatch]);
    
    if (loading) {
      
      return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress style={{ color: "#00838F" }}  />
      </div>
      
    }

    if (error) {
      return <div>Error: {error}</div>;
    }


  return (
    <StyledEngineProvider injectFirst>
      <Container className={styles.wrapper}>
        <TableContainer className={styles.tableWrapper} component={Paper}>
          <Table aria-label="git table" className={styles.table}>
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
              {repositories?.map((repo: any) => (
                <TableRow
                  key={repo.node.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {repo.node.name}
                  </TableCell>
                  <TableCell>{repo.node.primaryLanguage?.name
          }</TableCell>
          <TableCell>{repo.node.forkCount}</TableCell>
                  <TableCell>{repo.node.stargazerCount}</TableCell>
                  <TableCell>{repo.node.updatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Пагинация */}
        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Container>
    </StyledEngineProvider>
  );
}
