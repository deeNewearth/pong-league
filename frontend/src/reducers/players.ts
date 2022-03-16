import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  Player, PlayersState } from '../store/storeTypes';
import { graphQl_URL } from "../store/configureStore";

export const loadTopPlayers = createAsyncThunk(
    "players/loadTopPlayers",
    async () => {

        const query = JSON.stringify({
            query: `query TopPlayers {
                topPlayers {
                  phoneNumber
                  name
                  rank
                }
              }`
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
                topPlayers:Player[]
            }
        } = await response.json();

        if (done.errors && done.errors.length > 0) {
            throw new Error(done.errors[0].message);
        }

        return done.data.topPlayers ;
    }
);

export const playersSlice = createSlice({
    name: "players",
    initialState: {} as PlayersState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(loadTopPlayers.pending, (state, action) => {
            return {loading:true};

        });
        builder.addCase(loadTopPlayers.fulfilled, (state, action) => {
            
            return {list:action.payload};
           
        });
        builder.addCase(loadTopPlayers.rejected, (state, action) => {
            return {error: 'failed to load matches'};
        });

    },
});

export default playersSlice.reducer;



