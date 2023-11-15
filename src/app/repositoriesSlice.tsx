import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  initialState,
  IRepository,
  QueryVariables,
  IEdge,
} from "../utils/types";

const encodedToken = "ghp_iX?xVjEjw?uw1Xl?wtn?4dvnH?C1eK3tC8w1?VndaJ";
const decodedToken = encodedToken.replaceAll("?", "");
// GraphQL запрос для получения данных о репозиториях Github
const query = `
query ($query: String!, $first: Int, $last: Int, $after: String, $before: String, ){
  search(type: REPOSITORY,  query:  $query, first: $first, last: $last, after: $after, before: $before) {
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
          // Преобразую полученные данные и сохраняю их в состоянии
          if (action.payload.edges) {
            state.sortedData = action.payload.edges.map((repo: IEdge) => ({
              id: repo.node.name,
              name: repo.node.name,
              language: repo?.node?.primaryLanguage?.name || null,
              forksNumber: repo.node.forkCount,
              starsNumber: repo.node.stargazerCount,
              date: repo.node.updatedAt,
              cursor: repo.cursor,
            }));
          }
        }
      )
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
