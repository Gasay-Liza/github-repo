import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Container from "@mui/material/Container";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { StyledEngineProvider } from "@mui/material/styles";
import styles from "./Table.module.scss";
import { useAppDispatch } from "../../app/hooks";
import { fetchPublicRepositories, IEdge } from "../../app/repositoriesSlice";
import { RootState } from "../../app/store";
import Pagination from "../Pagination/Pagination";
import { formatDate } from "../../utils/formatDate";

export default function BasicTable() {
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.data.data);
  const loading = useSelector((state: RootState) => state.data.loading);
  const error = useSelector((state: RootState) => state.data.error);
  const searchTerm = useSelector((state: RootState) => state.data.searchTerm);

  useEffect(() => {
    dispatch(
      fetchPublicRepositories({
        first: 10,
        query: searchTerm || "",
        after: data?.pageInfo.endCursor,
      })
    );
  }, [searchTerm]);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress style={{ color: "#00838F" }} />
      </div>
    );
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
                  key={repo.cursor}
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
          <Pagination />
        </TableContainer>
        {/* <Container className={styles.textWapper}>
          <Typography>Выберите репозитарий</Typography>
        </Container> */}
        <Container className={styles.detailRepo}>
          <Typography variant="h3">Название репозитария</Typography>
          <Container className={styles.detailWrapper}>
            <Chip
              className={styles.chipLanguage}
              label="Python"
              color="primary"
              size="medium"
            />
            <Container className={styles.starsWrapper}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 17.77L18.18 21.5L16.54 14.47L22 9.74L14.81 9.13L12 2.5L9.19 9.13L2 9.74L7.46 14.47L5.82 21.5L12 17.77Z"
                  fill="#FFB400"
                />
              </svg>
              <Typography>92000</Typography>
            </Container>
          </Container>

          <Stack className={styles.chipTags} direction="row" spacing={1}>
            <Chip
              className={styles.chipTag}
              label="Python"
              color="default"
              size="medium"
            />
            <Chip
              className={styles.chipTag}
              label="Python"
              color="default"
              size="medium"
            />
            <Chip
              className={styles.chipTag}
              label="Python"
              color="default"
              size="medium"
            />
          </Stack>
          <Typography className={styles.license}>Название репозитария</Typography>
        </Container>
      </Container>
    </StyledEngineProvider>
  );
}
