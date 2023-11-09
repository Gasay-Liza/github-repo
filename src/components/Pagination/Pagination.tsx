import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TablePagination from '@mui/material/TablePagination';
import { fetchPublicRepositories } from "../../app/repositoriesSlice";
import { RootState, AppDispatch } from "../../app/store";
import { setPage, setRowsPerPage } from "../../app/paginationSlice";

function Pagination() {
    const dispatch = useDispatch<AppDispatch>();
    const data = useSelector((state: RootState) => state.data.data);
    const loading = useSelector((state: RootState) => state.data.loading);
    const startCursor = useSelector((state: RootState) => state.data.startCursor);
    const endCursor = useSelector((state: RootState) => state.data.endCursor);

    const page = useSelector((state: RootState) => state.pagination.page);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);

    console.log(data?.repositoryCount)
    const hasNextPage = useSelector((state: RootState) => state.data.hasNextPage);
    console.log("endCursor", endCursor, "startCursor", startCursor);

    console.log(endCursor);
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {

        console.log(newPage, page, rowsPerPage,);
        if (hasNextPage) {
            dispatch(fetchPublicRepositories({ first: rowsPerPage, after: data?.pageInfo.endCursor }));
        }
        dispatch(setPage(newPage));
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        console.log("data?.pageInfo.startCursor",data?.pageInfo.startCursor)
        dispatch(fetchPublicRepositories({ first: newRowsPerPage, after: data?.pageInfo.startCursor }));
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