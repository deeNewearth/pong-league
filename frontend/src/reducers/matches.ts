import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Match, Player, MatchesState } from '../store/storeTypes';
import { graphQl_URL } from "../store/configureStore";


export const loadMatches = createAsyncThunk(
    "matches/loadMatches",
    async (id: string) => {

        debugger;

        const variables = {
            matchByIdId: id
        };

        const query = JSON.stringify({
            query: `query MatchById($matchByIdId: String!) {
                matchById(id: $matchByIdId) {
                  winner {
                    phoneNumber
                    name
                  }
                  details {
                    tournament
                  }
                  looser {
                    phoneNumber
                    name
                  }
                }
              }`,
            variables
        });

        const response = await fetch(graphQl_URL, {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: query,
        });

        const done: {
            errors?: {
                message: string
            }[];
            data:{
                matchById:Match
            }
        } = await response.json();

        if (done.errors && done.errors.length > 0) {
            throw new Error(done.errors[0].message);
        }

        return done.data.matchById ;
    }
);

export const matchesSlice = createSlice({
    name: "nomatchesdes",
    initialState: {} as MatchesState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(loadMatches.pending, (state, action) => {
            return {loading:true};

        });
        builder.addCase(loadMatches.fulfilled, (state, action) => {
            return {list:[...state.list||[],action.payload]};
        });
        builder.addCase(loadMatches.rejected, (state, action) => {
            return {error: 'failed to load matches'};
        });

    },
});

export default matchesSlice.reducer;



