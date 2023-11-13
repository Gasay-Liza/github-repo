import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { visuallyHidden } from '@mui/utils';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from "@mui/material/TableContainer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { StyledEngineProvider } from "@mui/material/styles";
import styles from "./Table.module.scss";
import { useAppDispatch } from "../../app/hooks";

import { fetchPublicRepositories, IEdge} from "../../app/repositoriesSlice";
import { RootState } from "../../app/store";
import Pagination from "../Pagination/Pagination";

import { setPage } from "../../app/paginationSlice";
import { formatDate } from "../../utils/formatDate";


export default function BasicTable() {
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.data.data);
  const loading = useSelector((state: RootState) => state.data.loading);
  const error = useSelector((state: RootState) => state.data.error);
  const searchTerm = useSelector((state: RootState) => state.data.searchTerm);
  const [selectedRepo, setSelectedRepo] = useState<IEdge | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('name');
  const [sortedData, setSortedData] =  useState<Data[] | null>(null);
  
  
  useEffect(() => {
    dispatch(
      fetchPublicRepositories({
        first: 10,
        query: searchTerm || "",
        after: data?.pageInfo.endCursor,
      })
    );
    if (data?.edges) {
      setSortedData(data?.edges.map((repo: IEdge) => ({
        id: repo.node.name,
        name: repo.node.name,
        language: repo?.node?.primaryLanguage?.name || null,
        forksNumber: repo.node.forkCount,
        starsNumber: repo.node.stargazerCount,
        date: repo.node.updatedAt,
      })));
    }

    // setSelectedRepo(null);
    dispatch(setPage(0));
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

  const handleRowClick = (node: IEdge) => {
    console.log(node);
    setSelectedRepo(node);
  };

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'name',
      label: 'Название',
    },
    {
      id: 'language',
      label: 'Язык',
    },
    {
      id: 'forksNumber',
      label: 'Число форков',
    },
    {
      id: 'starsNumber',
      label: 'Число звезд',
    },
    {
      id: 'date',
      label: 'Дата обновления',
    },
  ];

  interface Data {
    id: string;
    name: string;
    language: string | null;
    forksNumber: number;
    starsNumber: number;
    date: string;
  }
  type Order = 'asc' | 'desc';

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const createSortHandler =
  (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Container className={styles.wrapper}>
        <TableContainer className={styles.tableWrapper} component={Paper}>
          <Table aria-label="git table" className={styles.table}>
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
            <TableBody>
            {data?.edges.map((repo: IEdge) => (
                <TableRow
                  key={repo.cursor}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => handleRowClick(repo)}
                  className={
                    repo.cursor === selectedRepo?.cursor
                      ? styles.activeRow
                      : styles.row
                  }
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
        {!selectedRepo && (
          <Container className={styles.textWapper}>
            <Typography>Выберите репозитарий</Typography>
          </Container>
        )}
        {/* Если выбран репозиторий, показываем информацию о нем */}
        {selectedRepo && (
          <Container className={styles.detailRepo}>
            <Typography variant="h3">{selectedRepo.node.name}</Typography>
            <Container className={styles.detailWrapper}>
              {selectedRepo?.node.primaryLanguage?.name && (
                <Chip
                  className={styles.chipLanguage}
                  label={selectedRepo?.node.primaryLanguage.name}
                  color="primary"
                  size="medium"
                />
              )}
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
                <Typography>{selectedRepo?.node.stargazerCount}</Typography>
              </Container>
            </Container>

            <Stack className={styles.chipTags} direction="row" spacing={1}>
              {selectedRepo.node.repositoryTopics.nodes.map((topic) => (
                <Chip
                  className={styles.chipTag}
                  label={topic?.topic.name}
                  color="default"
                  size="medium"
                />
              ))}
            </Stack>
            <Typography className={styles.license}>
              {selectedRepo?.node.licenseInfo?.name}
            </Typography>
          </Container>
        )}
        ;
      </Container>
    </StyledEngineProvider>
  );
}
