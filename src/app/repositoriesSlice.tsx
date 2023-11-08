import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";



// const page = useSelector((state: RootState) => state.pagination.page);
// const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

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
}

export const initialState: IRepositoriesState = {
  data: null,
  loading: false,
  error: null,
};



// GraphQL запрос на получение данных
const query = `
query {
  search(type: REPOSITORY, query: "stars:>1", last: 10) {
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

export const fetchPublicRepositories = createAsyncThunk<IRepository, void, { rejectValue:string } >(
    'repositories/fetchPublicRepositories',
    async (_, { rejectWithValue }) => {
      try {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`
        },
        body: JSON.stringify({ query})
      })
      const data = await res.json();
      if (res.ok) {
        return data.data.search;
      }} catch (err: any) {
          return rejectWithValue(err.message);
        }
    }
  );

  const repositoriesSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
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
        })
        .addCase(fetchPublicRepositories.rejected, (state, { payload }) => {
          if (payload) {
            state.loading = false;
            state.error = payload;
        }});
    },
    /* eslint-enable no-param-reassign */
  });
  
  export default repositoriesSlice.reducer;