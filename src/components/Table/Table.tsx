import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Container from "@mui/material/Container";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledEngineProvider } from "@mui/material/styles";
import styles from "./Table.module.scss";
import { useAppDispatch } from '../../app/hooks';
import { fetchPublicRepositories, IEdge} from "../../app/repositoriesSlice";
import { RootState } from "../../app/store";
// import Pagination from '../Pagination/Pagination';
import {formatDate} from '../../utils/formatDate';

export default function BasicTable() {

const dispatch = useAppDispatch();
const data = useSelector((state: RootState) => state.data.data);
const loading = useSelector((state: RootState) => state.data.loading);
const error = useSelector((state: RootState) => state.data.error);
console.log(data )
console.log(data)
console.log(typeof data);
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
      {data?.edges.map((repo: IEdge) => (
        <TableRow
          key={repo.node.name}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {repo.node.name}
          </TableCell>
          <TableCell>{repo.node.primaryLanguage?.name}</TableCell>
          <TableCell>{repo.node.forkCount}</TableCell>
          <TableCell>{repo.node.stargazerCount}</TableCell>
          <TableCell>{formatDate(repo.node.updatedAt)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
            
          </Table>
          {/* <Pagination/> */}
        </TableContainer>
        
      </Container>
    </StyledEngineProvider>
  );
}

// ц