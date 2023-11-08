import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IPaginationState {
    page: number,
    rowsPerPage: number,
};
  

// Начальное значение
const initialState: IPaginationState = {
    page: 1,
    rowsPerPage: 10,
};

  
const paginationSlice = createSlice({
    name: 'pagination', 
    initialState,
    reducers: {
      setPage: (state: IPaginationState, action: PayloadAction<number>) => {
        state.page = action.payload;
      },
      setRowsPerPage: (state: IPaginationState, action: PayloadAction<number>) => {
        state.rowsPerPage = action.payload;
        state.page = 0;
      },
    },
  });
  
  export const { setPage, setRowsPerPage } = paginationSlice.actions;
  
  export default paginationSlice.reducer;