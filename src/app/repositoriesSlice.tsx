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
  data: IRepository | null;
  loading: boolean;
  error: string | null;
  endCursor: string | null;
  startCursor: string | null,
  hasNextPage: boolean | null,
}

export const initialState: IRepositoriesState = {
  data: null,
  loading: false,
  error: null,
  endCursor: null,
  startCursor: null,
  hasNextPage: false,
};

interface QueryVariables {
  first: number;
  after?: string;
}

// GraphQL запрос на получение данных
const query = `
query ($first: Int, $after: String){
  search(type: REPOSITORY, query: "stars:>1", first: $first, after: $after) {
    repositoryCount,
    pageInfo {
      startCursor
      hasNextPage
      endCursor
    },
    edges {
      node {
        ... on Repository {
          name
          primaryLanguage {
            name
          }
          forkCount
          stargazerCount
          updatedAt
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
        return data.data.search;
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const repositoriesSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setEndCursor: (state, action: PayloadAction<IRepository>) => {
      state.endCursor = action.payload.pageInfo.endCursor;
    },
    setHasNextPage: (state, action: PayloadAction<IRepository>) => {
      state.hasNextPage = action.payload.pageInfo.hasNextPage;
    },
    setStartCursor: (state, action: PayloadAction<IRepository>) => {
      state.startCursor = action.payload.pageInfo.startCursor;
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
        state.startCursor = action.payload.pageInfo.startCursor;
        state.endCursor = action.payload.pageInfo.endCursor;
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


export const { setEndCursor } = repositoriesSlice.actions;
export const { setStartCursor } = repositoriesSlice.actions;
export const { setHasNextPage } = repositoriesSlice.actions;
export default repositoriesSlice.reducer;