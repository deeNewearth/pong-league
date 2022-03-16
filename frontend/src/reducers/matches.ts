import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Match, Player, MatchesState } from '../store/storeTypes';
import { graphQl_URL } from "../store/configureStore";


export const loadMatches = createAsyncThunk(
    "matches/loadMatches",
    async ({lookup, type}: {lookup:string;type:'phoneNumber'|'id'}) => {

        const variables = type=='id'? {
            matchByIdId: lookup
        }:{
            phoneNumber: lookup
        };

        const query = JSON.stringify({
            query: type=='id'?`query MatchById($matchByIdId: String!) {
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
              }`:`query MatchesByPlayer($phoneNumber: String!) {
                matchesByPlayer(phoneNumber: $phoneNumber) {
                  winner {
                    phoneNumber
                    name
                    rank
                  }
                  looser {
                    phoneNumber
                    name
                    rank
                  }
                  details {
                    tournament
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
                matchById?:Match,
                matchesByPlayer?:Match[]
            }
        } = await response.json();

        if (done.errors && done.errors.length > 0) {
            throw new Error(done.errors[0].message);
        }

        return ({
            data:done.data,
            usingId:type=='id'
        }) ;
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
            //return {list:[...state.list||[],action.payload]};
            const {usingId,data} = action.payload;
            
            if(usingId && data.matchById){
                return {list:[...state.list||[],data.matchById]};
            }

            if(!usingId && data.matchesByPlayer){
                return {list:data.matchesByPlayer};
            }

            return state;
        });
        builder.addCase(loadMatches.rejected, (state, action) => {
            return {error: 'failed to load matches'};
        });

    },
});

export default matchesSlice.reducer;



