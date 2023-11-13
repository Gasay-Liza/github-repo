import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

const {REACT_APP_GITHUB_TOKEN} = process.env;

interface IPrimaryLanguage {
  name: string;
}

export interface INode {
  name: string;
  repositoryTopics: {
    nodes: {
      topic: {
        name: string | null;
      }
    }[]
  }
  licenseInfo: {
    name: string | null;
  }
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

export interface ISortedData {
  id: string;
  name: string;
  language: string | null;
  forksNumber: number;
  starsNumber: number;
  date: string;
  cursor: string;
}

export interface IRepositoriesState {
  searchTerm: string,
  data: IRepository | null,
  loading: boolean,
  error: string | null,
  endCursorHistory: string[],
  startCursorHistory: string[],
  hasNextPage: boolean | null,
  sortedData: ISortedData[],
}

export const initialState: IRepositoriesState = {
  searchTerm: "ф",
  data: null,
  loading: false,
  error: null,
  endCursorHistory: [],
  startCursorHistory: [],
  hasNextPage: false,
  sortedData: [],
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