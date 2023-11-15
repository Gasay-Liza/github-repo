import React from 'react';
import { StyledEngineProvider } from "@mui/material/styles";

import { useSelector, useDispatch } from 'react-redux';
import TablePagination from '@mui/material/TablePagination';
import styles from "./Pagination.module.scss";
import { fetchPublicRepositories } from "../../app/repositoriesSlice";
import { RootState, AppDispatch } from "../../app/store";
import { setPage, setRowsPerPage } from "../../app/paginationSlice";

// Компонент Pagination отвечает за отображение и взаимодействие с пагинацией (переход между страницами)
function Pagination() {
    // Здесь мы используем хуки Redux для доступа к функции dispatch и выборки данных из хранилища состояния
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.data.data);
    const loading = useSelector((state: RootState) => state.data.loading);
    const searchTerm = useSelector((state: RootState) => state.data.searchTerm);
    const page = useSelector((state: RootState) => state.pagination.page);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);
    const hasNextPage = useSelector((state: RootState) => state.data.hasNextPage);


    // handleChangePage обрабатывает изменения в пагинаторе, обновляя текущую выбранную страницу
    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        if (newPage < page) {

            dispatch(fetchPublicRepositories({ last: rowsPerPage, query: searchTerm || "", before: data?.pageInfo.startCursor }));
        }
            
        else if (hasNextPage) {
            dispatch(fetchPublicRepositories({ first: rowsPerPage, query: searchTerm || "", after:data?.pageInfo.endCursor }));
        }
        // Обновляем номер текущей страницы
        dispatch(setPage(newPage));
        
    };

    // handleChangeRowsPerPage обрабатывает изменение количества строк на странице
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10); // Получаем новое значение из ввода пользователя
        dispatch(fetchPublicRepositories({ first: newRowsPerPage, query: searchTerm || ""}));
        // Обновляем значение строк на странице
        dispatch(setRowsPerPage(newRowsPerPage));
    };
    
    // Если данные загружаются, мы отображаем сообщение "Загрузка"
    if (loading) {
        return <div className={styles.text}>Загрузка...</div>;
    }

    // Если данные отсутствуют, мы отображаем сообщение "Ничего не найдено"
    if (!data?.edges?.length) {
        return <div className={styles.text}>Ничего не найдено</div>;
    }

    // Отображаем пагинацию только в том случае, если есть данные для отображения
    return (
        <StyledEngineProvider injectFirst>
        <TablePagination
            className={styles.pagination} 
            component="div" 
            count={data.repositoryCount || -1}
            page={page}
            rowsPerPage={rowsPerPage} 
            onPageChange={handleChangePage} 
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </StyledEngineProvider>
    );
}

export default Pagination; 