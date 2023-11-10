import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TablePagination from '@mui/material/TablePagination';
import { repositoriesSlice, fetchPublicRepositories, } from "../../app/repositoriesSlice";
import { RootState, AppDispatch } from "../../app/store";
import { setPage, setRowsPerPage } from "../../app/paginationSlice";


function Pagination() {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.data.data);
    const loading = useSelector((state: RootState) => state.data.loading);
    const searchTerm = useSelector((state: RootState) => state.data.searchTerm);
    const page = useSelector((state: RootState) => state.pagination.page);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);
    const endCursorHistory = useSelector((state: RootState) => state.data.endCursorHistory);
    const hasNextPage = useSelector((state: RootState) => state.data.hasNextPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        if ((newPage < page)) {
            dispatch(repositoriesSlice.actions.popEndCursor());
            dispatch(repositoriesSlice.actions.popStartCursor());
            dispatch(fetchPublicRepositories({ first: rowsPerPage, query: searchTerm || "", after: endCursorHistory[endCursorHistory.length - 1] }));
            dispatch(setPage(newPage));
        }
        else if (hasNextPage) {
            dispatch(fetchPublicRepositories({ first: rowsPerPage, query: searchTerm || "", after: endCursorHistory[endCursorHistory.length - 1] }));
            dispatch(setPage(newPage));
        }
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        dispatch(fetchPublicRepositories({ first: newRowsPerPage, query: searchTerm || "", after: data?.pageInfo.startCursor }));
        dispatch(setRowsPerPage(newRowsPerPage));
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!data?.edges.length) {
        return <div>No repositories yet</div>
    }

    return (
        <TablePagination
            component="div"
            count={data.repositoryCount || -1} // Это свойство задает общее количество элементов или строк, которые нужно отобразить с помощью пагинации
            page={page} // Значение текущей страницы.
            rowsPerPage={rowsPerPage} // Сменили на ваш размер страницы
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
}


export default Pagination;