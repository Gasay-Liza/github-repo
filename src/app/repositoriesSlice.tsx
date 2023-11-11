import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// const page = useSelector((state: RootState) => state.pagination.page);
// const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);
const GITHUB_TOKEN = "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";

interface IPrimaryLanguage {
  name: string;
}

export interface INode {
  name: string;
  primaryLanguage: IPrimaryLanguage | null;
  forkCount: number;
  stargazerCount: number;
  updatedAt: string;
}

export interface IEdge {
  node: INode;
  cursor: string;
}

export interface IRepository {
  repositoryCount: number | null;
  pageInfo: {
    startCursor: string;
    hasNextPage: boolean;
    endCursor: string;
  },
  edges: IEdge[];
}

export interface IRepositoriesState {
  searchTerm: string,
  data: IRepository | null,
  loading: boolean,
  error: string | null,
  endCursorHistory: string[],
  startCursorHistory: string[],
  hasNextPage: boolean | null,
}

export const initialState: IRepositoriesState = {
  searchTerm: "ф",
  data: null,
  loading: false,
  error: null,
  endCursorHistory: [],
  startCursorHistory: [],
  hasNextPage: false,
};

interface QueryVariables {
  first?: number;
  last?: number;
  after?: string;
  before?: string;
  query: string;
}

// GraphQL запрос на получение данных
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
          'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        body: JSON.stringify({ query, variables })
      })
      const data = await res.json();
      if (res.ok) {
        console.log(res)
        console.log(data)
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
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: (state) => {
      state.searchTerm = "";
    },
    setHasNextPage: (state, action: PayloadAction<IRepository>) => {
      state.hasNextPage = action.payload.pageInfo.hasNextPage;
    },
  },
  extraReducers: (builder) => {
    /* eslint-disable no-param-reassign */
    builder
      .addCase(fetchPublicRepositories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicRepositories.fulfilled, (state, action: PayloadAction<IRepository>) => {
        state.loading = false;
        state.data = action.payload;
        state.hasNextPage = action.payload.pageInfo.hasNextPage;
        state.startCursorHistory.push(action.payload.pageInfo.startCursor); 
        state.endCursorHistory.push(action.payload.pageInfo.endCursor); 
      })
      .addCase(fetchPublicRepositories.rejected, (state, { payload }) => {
        if (payload) {
          state.loading = false;
          state.error = payload;
        }
      });

  },
  /* eslint-enable no-param-reassign */
});



export const { setSearchTerm, setHasNextPage, clearSearchTerm } = repositoriesSlice.actions;
export default repositoriesSlice.reducer;