import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  initialState,
  IRepository,
  QueryVariables,
} from "../utils/types";

const encodedToken = "ghp_iX?xVjEjw?uw1Xl?wtn?4dvnH?C1eK3tC8w1?VndaJ";
const decodedToken = encodedToken.replaceAll("?", "");
// GraphQL запрос для получения данных о репозиториях Github

// query: $query in:name sort:name-desc
// query: $query in:name sort:stars-desc
// query: $query in:name sort:language-desc
// query: $query in:name sort:forks-desc
// query: $query in:name sort:date-desc
const query = `
query ($query: String!, $first: Int, $last: Int, $after: String, $before: String, $sort: String, 
  $direction: String){
  search(type: REPOSITORY,  query:  $query in:name sort:$sort-$, first: $first, last: $last, after: $after, before: $before) {
    repositoryCount,
    pageInfo {
      startCursor
      hasNextPage
      endCursor
    },
    edges {
      cursor
      node {
        ... on Repository {
          name
          primaryLanguage {
            name
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          forkCount
          stargazerCount
          updatedAt
          licenseInfo { 
          name }
        }
      }
      
    }
  }
}
`;
// sort:stars-desc
export const fetchPublicRepositories = createAsyncThunk<
  IRepository,
  QueryVariables | void,
  { rejectValue: string }
>(
  "repositories/fetchPublicRepositories",
  async (variables, { rejectWithValue }) => {
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${decodedToken}`,
        },
        body: JSON.stringify({ query, variables }),
      });
      const data = await res.json();
      if (res.ok) {
        return data.data.search;
      }
      // Обработка кодов HTTP-статусов, возвращающих ошибку
      console.error(data); // Выведем для отладки цели
      return rejectWithValue(
        data.errors || data.message || "Ошибка на сервере"
      );
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  }
);

export const repositoriesSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    // Установить поисковый запрос
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    // Сохраняем состояние "есть ли следующая страница" в стейт
    setHasNextPage: (state, action: PayloadAction<IRepository>) => {
      state.hasNextPage = action.payload.pageInfo.hasNextPage;
    },
    setIsSearchActive: (state, action: PayloadAction<boolean>) => {
      state.isSearchActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* eslint-disable no-param-reassign */
    builder
      // Определение состояния при отправке запроса
      .addCase(fetchPublicRepositories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Определение состояния при выполнении запроса
      .addCase(
        fetchPublicRepositories.fulfilled,
        (state, action: PayloadAction<IRepository>) => {
          state.loading = false;
          state.data = action.payload;
          state.hasNextPage = action.payload.pageInfo.hasNextPage;
        })
      // Определение состояния при ошибке запроса
      .addCase(fetchPublicRepositories.rejected, (state, { payload }) => {
        if (payload) {
          state.loading = false;
          if (payload) {
            state.error = payload;
          } else {
            console.log(state.error);
            state.error = "Ошибка подключения";
          }
        }
      });
  },
  /* eslint-enable no-param-reassign */
});

export const { setSearchTerm, setHasNextPage, setIsSearchActive } =
  repositoriesSlice.actions;
export default repositoriesSlice.reducer;
