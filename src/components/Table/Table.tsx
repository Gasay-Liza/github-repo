import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { StyledEngineProvider } from "@mui/material/styles";
import styles from "./Table.module.scss";
import { useAppDispatch } from "../../app/hooks";

import { fetchPublicRepositories, IEdge, ISortedData} from "../../app/repositoriesSlice";
import { RootState } from "../../app/store";
import RepoRow from "../RepoRow/RepoRow";
import TableHeader from "../TableHeader/TableHeader";
import Pagination from "../Pagination/Pagination";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { setPage } from "../../app/paginationSlice";



export default function BasicTable() {
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.data.data);
  const sortedData = useSelector((state: RootState) => state.data.sortedData);
  const loading = useSelector((state: RootState) => state.data.loading);
  const error = useSelector((state: RootState) => state.data.error);
  const searchTerm = useSelector((state: RootState) => state.data.searchTerm);
  const [selectedRepo, setSelectedRepo] = useState<IEdge | null>(null);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ISortedData>('name');
  
  
  useEffect(() => {
    dispatch(
      fetchPublicRepositories({
        first: 10,
        query: searchTerm || "",
        after: data?.pageInfo.endCursor,
      })
    );
    dispatch(setPage(0));
  }, [searchTerm, fetchPublicRepositories]);


  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleRowClick = (cursor: string) => {
    const node = data?.edges.find(edge => edge.cursor === cursor);
    console.log(node);
    setSelectedRepo(node ?? null);
    console.log("selectedRepo", selectedRepo);
  };

  interface HeadCell {
    id: keyof ISortedData;
    label: string;
  }

  const headCells: HeadCell[] = [
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


  type Order = 'asc' | 'desc';

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if ((b[orderBy] === null || b[orderBy] < a[orderBy]) && a[orderBy] !== null ) {
      return -1;
    }
    if ((a[orderBy] === null || b[orderBy] > a[orderBy]) && b[orderBy] !== null) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
  ): (
    a: { [key in Key]: number | string | null },
    b: { [key in Key]: number | string | null },
  ) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = a[0] !== null && b[0] !== null ? comparator(a[0], b[0]) : 0;
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ISortedData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const createSortHandler =
  (property: keyof ISortedData) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Container className={styles.wrapper}>
        <TableContainer className={styles.tableWrapper} component={Paper}>
          <Table aria-label="git table" className={styles.table}>
            <TableHeader headCells={headCells} order={order} orderBy={orderBy} createSortHandler={createSortHandler} />
            <TableBody>
            {sortedData && sortedData?.length > 0 && stableSort(sortedData, getComparator(order, orderBy)).map((repo: ISortedData) => (
                <RepoRow selectedRepo={selectedRepo} repo={repo} handleRowClick={handleRowClick} />
              ))} 
            </TableBody>
          </Table>
          <Pagination/>
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
      </Container>
    </StyledEngineProvider>
  );
}









// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Box from "@mui/material/Box";
// import { visuallyHidden } from '@mui/utils';
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableHead from "@mui/material/TableHead";
// import TableSortLabel from '@mui/material/TableSortLabel';
// import TableContainer from "@mui/material/TableContainer";
// import Container from "@mui/material/Container";
// import Typography from "@mui/material/Typography";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import Chip from "@mui/material/Chip";
// import Stack from "@mui/material/Stack";
// import { StyledEngineProvider } from "@mui/material/styles";
// import styles from "./Table.module.scss";
// import { useAppDispatch } from "../../app/hooks";

// import { fetchPublicRepositories, IEdge, ISortedData} from "../../app/repositoriesSlice";
// import { RootState } from "../../app/store";
// import Pagination from "../Pagination/Pagination";
// import LoadingScreen from "../LoadingScreen/LoadingScreen";
// import { setPage } from "../../app/paginationSlice";
// import { formatDate } from "../../utils/formatDate";


// export default function BasicTable() {
//   const dispatch = useAppDispatch();
//   const data = useSelector((state: RootState) => state.data.data);
//   const sortedData = useSelector((state: RootState) => state.data.sortedData);
//   const loading = useSelector((state: RootState) => state.data.loading);
//   const error = useSelector((state: RootState) => state.data.error);
//   const searchTerm = useSelector((state: RootState) => state.data.searchTerm);
//   const [selectedRepo, setSelectedRepo] = useState<IEdge | null>(null);
//   const [order, setOrder] = useState<Order>('asc');
//   const [orderBy, setOrderBy] = useState<keyof ISortedData>('name');
  
  
//   useEffect(() => {
//     dispatch(
//       fetchPublicRepositories({
//         first: 10,
//         query: searchTerm || "",
//         after: data?.pageInfo.endCursor,
//       })
//     );
//     dispatch(setPage(0));
//   }, [searchTerm, fetchPublicRepositories]);


//   if (loading) {
//     return <LoadingScreen />;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   const handleRowClick = (cursor: string) => {
//     const node = data?.edges.find(edge => edge.cursor === cursor);
//     console.log(node);
//     setSelectedRepo(node ?? null);
//     console.log("selectedRepo", selectedRepo);
//   };

//   interface HeadCell {
//     id: keyof ISortedData;
//     label: string;
//   }

//   const headCells: HeadCell[] = [
//     {
//       id: 'name',
//       label: 'Название',
//     },
//     {
//       id: 'language',
//       label: 'Язык',
//     },
//     {
//       id: 'forksNumber',
//       label: 'Число форков',
//     },
//     {
//       id: 'starsNumber',
//       label: 'Число звезд',
//     },
//     {
//       id: 'date',
//       label: 'Дата обновления',
//     },
//   ];


//   type Order = 'asc' | 'desc';

//   function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//     if ((b[orderBy] === null || b[orderBy] < a[orderBy]) && a[orderBy] !== null ) {
//       return -1;
//     }
//     if ((a[orderBy] === null || b[orderBy] > a[orderBy]) && b[orderBy] !== null) {
//       return 1;
//     }
//     return 0;
//   }

//   function getComparator<Key extends keyof any>(
//     order: Order,
//     orderBy: Key,
//   ): (
//     a: { [key in Key]: number | string | null },
//     b: { [key in Key]: number | string | null },
//   ) => number {
//     return order === 'desc'
//       ? (a, b) => descendingComparator(a, b, orderBy)
//       : (a, b) => -descendingComparator(a, b, orderBy);
//   }

//   function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
//     const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//     stabilizedThis.sort((a, b) => {
//       const order = a[0] !== null && b[0] !== null ? comparator(a[0], b[0]) : 0;
//       if (order !== 0) {
//         return order;
//       }
//       return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
//   }
  
//   const handleRequestSort = (
//     event: React.MouseEvent<unknown>,
//     property: keyof ISortedData,
//   ) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };
//   const createSortHandler =
//   (property: keyof ISortedData) => (event: React.MouseEvent<unknown>) => {
//     handleRequestSort(event, property);
//   };

//   return (
//     <StyledEngineProvider injectFirst>
//       <Container className={styles.wrapper}>
//         <TableContainer className={styles.tableWrapper} component={Paper}>
//           <Table aria-label="git table" className={styles.table}>
//             <TableHead className={styles.tableHead}>
//               <TableRow>
//                 {headCells.map((headCell) => (
//                   <TableCell
//                   className={styles.tableCell}
//                     key={headCell.id}
//                     sortDirection={orderBy === headCell.id ? order : false}
//                   >
//                     <TableSortLabel
//                     className={styles.tableSortLabel}
//                       active={orderBy === headCell.id}
//                       direction={orderBy === headCell.id ? order : "asc"}
//                       onClick={createSortHandler(headCell.id)}
//                     >
//                       {headCell.label}
//                       {orderBy === headCell.id ? (
//                         <Box component="span" sx={visuallyHidden}>
//                           {order === "desc"
//                             ? "sorted descending"
//                             : "sorted ascending"}
//                         </Box>
//                       ) : null}
//                     </TableSortLabel>
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//             {sortedData && sortedData?.length > 0 && stableSort(sortedData, getComparator(order, orderBy)).map((repo: ISortedData) => (
//                 <TableRow
//                   key={repo.cursor}
//                   sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                   onClick={() => handleRowClick(repo?.cursor)}
//                   className={
//                     repo.cursor === selectedRepo?.cursor
//                       ? styles.activeRow
//                       : styles.row
//                   }
//                 >
//                   <TableCell component="th" scope="row">
//                     {repo.name}
//                   </TableCell>
//                   <TableCell>{repo.language}</TableCell>
//                   <TableCell>{repo.forksNumber}</TableCell>
//                   <TableCell>{repo.starsNumber}</TableCell>
//                   <TableCell>{formatDate(repo.date)}</TableCell>
//                 </TableRow>
//               ))} 
//             </TableBody>
//           </Table>
//           <Pagination/>
//         </TableContainer>
//         {!selectedRepo && (
//           <Container className={styles.textWapper}>
//             <Typography>Выберите репозитарий</Typography>
//           </Container>
//         )}
//         {/* Если выбран репозиторий, показываем информацию о нем */}
//         {selectedRepo && (
//           <Container className={styles.detailRepo}>
//             <Typography variant="h3">{selectedRepo.node.name}</Typography>
//             <Container className={styles.detailWrapper}>
//               {selectedRepo?.node.primaryLanguage?.name && (
//                 <Chip
//                   className={styles.chipLanguage}
//                   label={selectedRepo?.node.primaryLanguage.name}
//                   color="primary"
//                   size="medium"
//                 />
//               )}
//               <Container className={styles.starsWrapper}>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <path
//                     d="M12 17.77L18.18 21.5L16.54 14.47L22 9.74L14.81 9.13L12 2.5L9.19 9.13L2 9.74L7.46 14.47L5.82 21.5L12 17.77Z"
//                     fill="#FFB400"
//                   />
//                 </svg>
//                 <Typography>{selectedRepo?.node.stargazerCount}</Typography>
//               </Container>
//             </Container>

//             <Stack className={styles.chipTags} direction="row" spacing={1}>
//               {selectedRepo.node.repositoryTopics.nodes.map((topic) => (
//                 <Chip
//                   className={styles.chipTag}
//                   label={topic?.topic.name}
//                   color="default"
//                   size="medium"
//                 />
//               ))}
//             </Stack>
//             <Typography className={styles.license}>
//               {selectedRepo?.node.licenseInfo?.name}
//             </Typography>
//           </Container>
//         )}
//       </Container>
//     </StyledEngineProvider>
//   );
// }
