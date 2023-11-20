// Импортирование необходимых зависимостей и компонентов

// Хуки Redux
import { useSelector } from "react-redux";

// Хуки React
import React, { useEffect, useState } from "react";

// Компоненты Material UI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { StyledEngineProvider } from "@mui/material/styles";

// Импортирование хуков, переменных и функций, относящихся к Redux
import { useAppDispatch } from "../../app/hooks";
import { fetchPublicRepositories, setOrder, setOrderBy  } from "../../app/repositoriesSlice";
import { RootState } from "../../app/store";
// Импортирование типов, относящихся к Redux
import { IEdge, ISortedData } from "../../utils/types";
// Импортирование кастомных компонентов, созданных для данного приложения
import RepoRow from "../RepoRow/RepoRow";
import TableHeader from "../TableHeader/TableHeader";
import Pagination from "../Pagination/Pagination";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import FirstScreen from "../FirstScreen/FirstScreen";
import { setPage } from "../../app/paginationSlice";

// Стили
import styles from "./Table.module.scss";

// Компонент реализует таблицу для отображения данных о репозиториях
export default function BasicTable() {
  const dispatch = useAppDispatch();

  // Получение данных из Redux store
  const data = useSelector((state: RootState) => state.data.data);
  const loading = useSelector((state: RootState) => state.data.loading);
  const error = useSelector((state: RootState) => state.data.error);
  const searchTerm = useSelector((state: RootState) => state.data.searchTerm);
  const isSearchActive = useSelector(
    (state: RootState) => state.data.isSearchActive
  );
  const order = useSelector(
    (state: RootState) => state.data.order
  );
  const orderBy = useSelector(
    (state: RootState) => state.data.orderBy
  );
  // Состояние компонента, которое хранит состояние поиска

  // Состояние компонента, которое хранит выбранный репозиторий
  const [selectedRepo, setSelectedRepo] = useState<IEdge | null>(null);
  // Состояние компонента, которое хранит порядок сортировки
// query: $query in:name sort:name-desc
// query: $query in:name sort:stars-desc
// query: $query in:name sort:language-desc
// query: $query in:name sort:forks-desc
// query: $query in:name sort:date-desc
  // Загрузка репозиториев при обновлении поискового запроса
  useEffect(() => {
    dispatch(
      fetchPublicRepositories({
        first: 10,
        query:`${searchTerm} in:name sort:${orderBy}-${order}` || "",
        after: data?.pageInfo.endCursor,
      })
    );
    dispatch(setPage(0));
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchPublicRepositories({
        first: 10,
        query:`${searchTerm} in:name sort:${orderBy}-${order}` || "",
      })
    );
    dispatch(setPage(0));
  }, [order]);

  // Обработка потенциальных состояний компонента
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <FirstScreen text={`Error: ${error}`} />;
  }

  // Функция обработки клика по строке репозитория
  const handleRowClick = (cursor: string) => {
    const node = data?.edges.find((edge) => edge.cursor === cursor);
    setSelectedRepo(node ?? null);
  };

  // Тип для ячейки заголовка таблицы
  interface HeadCell {
    id: keyof ISortedData;
    label: string;
  }

  // Конфигурация ячеек заголовка
  const headCells: HeadCell[] = [
    {
      id: "name",
      label: "Название",
    },
    {
      id: "language",
      label: "Язык",
    },
    {
      id: "forks",
      label: "Число форков",
    },
    {
      id: "stars",
      label: "Число звезд",
    },
    {
      id: "date",
      label: "Дата обновления",
    },
  ];

  // Функция-обработчик сортировки для указанного свойства
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ISortedData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    console.log(isAsc )
    dispatch(setOrder(isAsc ? "desc" : "asc"));
    dispatch(setOrderBy(property));
  };
  const createSortHandler =
    (property: keyof ISortedData) => (event: React.MouseEvent<unknown>) => {
      console.log("@@@@")
      handleRequestSort(event, property);
    };

  return (
    <StyledEngineProvider injectFirst>
      {isSearchActive ? ( <div>
          <Container className={styles.wrapper}>
            <TableContainer className={styles.tableWrapper} component={Paper}>
              <Table stickyHeader aria-label="git table" className={styles.table}>
                <TableHeader
                  headCells={headCells}
                  order={order}
                  orderBy={orderBy}
                  createSortHandler={createSortHandler}
                />
                <TableBody>
                {data?.edges.map(
                      (repo: IEdge) => (
                        <RepoRow
                          key={repo.cursor}
                          selectedRepo={selectedRepo}
                          repo={repo}
                          handleRowClick={handleRowClick}
                        />
                      )
                    )}
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
                <Typography className={styles.detailRepoTitle}variant="h3">{selectedRepo.node.name}</Typography>
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
        </div>) : (
        <FirstScreen text="Добро пожаловать!" />
      )}
    </StyledEngineProvider>
  );
}