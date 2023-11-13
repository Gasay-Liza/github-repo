import env from "react-dotenv";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { initialState, IRepository,  QueryVariables, IEdge } from '../utils/types';

const {REACT_APP_GITHUB_TOKEN} = env;

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


export const fetchPublicRepositories = createAsyncThunk<IRepository, QueryVariables | void, { rejectValue: string }>(
  'repositories/fetchPublicRepositories',
  async (variables, { rejectWithValue }) => {
    try {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${REACT_APP_GITHUB_TOKEN}`
        },
        body: JSON.stringify({ query, variables })
      })
      const data = await res.json();
      if (res.ok) {
        return data.data.search;
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


export const repositoriesSlice = createSlice({
  name: 'data',
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
      .addCase(fetchPublicRepositories.fulfilled, (state, action: PayloadAction<IRepository>) => {
        state.loading = false;
        state.data = action.payload;
        state.hasNextPage = action.payload.pageInfo.hasNextPage;
        // Новая логика: преобразую полученные данные и сохраняю их в состоянии
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
      })
      // Определение состояния при ошибке запроса
      .addCase(fetchPublicRepositories.rejected, (state, { payload }) => {
        if (payload) {
          state.loading = false;
          state.error = payload;
        }
      });

  },
  /* eslint-enable no-param-reassign */
});

export const { setSearchTerm, setHasNextPage} = repositoriesSlice.actions;
export default repositoriesSlice.reducer;