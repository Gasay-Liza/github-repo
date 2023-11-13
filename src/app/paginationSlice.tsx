// Импорт необходимых функций из библиотеки Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Определение интерфейса для состояния пагинации
interface IPaginationState {
    page: number,   // Номер текущей страницы
    rowsPerPage: number, // Количество элементов на странице
};
  

// Установка начального состояния для пагинации
const initialState: IPaginationState = {
    page: 0,// По умолчанию отображается первая страница
    rowsPerPage: 10,  // По умолчанию на странице отображается 10 элементов
};

  
const paginationSlice = createSlice({
    name: 'pagination', 
    initialState,
    reducers: {
       // Задать номер текущей страницы
      setPage: (state: IPaginationState, action: PayloadAction<number>) => {
        state.page = action.payload;
      },
      // Задать количество строк на странице и обнуление номера страницы
      setRowsPerPage: (state: IPaginationState, action: PayloadAction<number>) => {
        state.rowsPerPage = action.payload;
        state.page = 0;
      },
    },
  });
  

  export const { setPage, setRowsPerPage } = paginationSlice.actions;
  
  export default paginationSlice.reducer;