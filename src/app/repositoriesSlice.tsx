import {createSlice, PayloadAction, createAsyncThunk} from "@reduxjs/toolkit";

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

interface IRepository {
  node: {name: string,
  primaryLanguage: {
    name: string
  },
  forkCount: number,
  stargazerCount: number,
  updatedAt: string
}};

interface IRepositoriesState {
  data: IRepository[],
  loading: boolean,
  error: string | null,
};

const initialState: IRepositoriesState = {
  data: [],
  loading: false,
  error: null,
};

// GraphQL запрос
const query = `
query {
  search(type: REPOSITORY, query: "stars:>1", first: 10) {
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

export const fetchPublicRepositories = createAsyncThunk<IRepository[], void, { rejectValue:string } >(
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
        console.log("data", data);
        console.log("data.data", data.data);
        return data.data.search.edges;
      }} catch (err: any) {
          return rejectWithValue(err.message);
        }
    }
  );

  const repositoriesSlice = createSlice({
    name: 'repositories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      /* eslint-disable no-param-reassign */
      builder
        .addCase(fetchPublicRepositories.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPublicRepositories.fulfilled, (state, action: PayloadAction<IRepository[]>) => {
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