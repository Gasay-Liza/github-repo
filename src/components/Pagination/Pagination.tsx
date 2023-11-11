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
    const searchTerm = useSelector((state: RootState) => state.data.searchTerm);
    const page = useSelector((state: RootState) => state.pagination.page);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);
    const endCursorHistory = useSelector((state: RootState) => state.data.endCursorHistory);
    const startCursorHistory = useSelector((state: RootState) => state.data.startCursorHistory);
    const hasNextPage = useSelector((state: RootState) => state.data.hasNextPage);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        console.log("endCursorHistory[endCursorHistory.length - 1]",endCursorHistory[endCursorHistory.length - 1])
        console.log("start[start.length - 1]",startCursorHistory[startCursorHistory.length - 1])
        console.log("action.payload.pageInfo.endCursor]",data?.pageInfo.endCursor)
        console.log("action.payload.pageInfo.endCursor]",data?.pageInfo.startCursor)
        if (newPage < page) {
            dispatch(fetchPublicRepositories({ last: rowsPerPage, query: searchTerm || "", before: data?.pageInfo.endCursor }));
        }
            
         else if (hasNextPage) {
            dispatch(fetchPublicRepositories({ first: rowsPerPage, query: searchTerm || "", after:data?.pageInfo.startCursor }));
        }
        dispatch(setPage(newPage));
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        console.log(startCursorHistory)
        console.log(data?.pageInfo.startCursor)
        dispatch(fetchPublicRepositories({ first: newRowsPerPage, query: searchTerm || "", after:data?.pageInfo.endCursor }));
        dispatch(setRowsPerPage(newRowsPerPage));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data?.edges.length) {
        return <div>No repositories yet</div>;
    }

    return (
        <TablePagination
            component="div"
            count={data.repositoryCount || -1}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );
}

export default Pagination;