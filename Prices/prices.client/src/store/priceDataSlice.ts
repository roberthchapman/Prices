
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IAppState } from './appState';
import { IPriceData } from '../models/priceData'

export const priceDataSlice = createSlice({
    name: 'priceData',
    initialState: {
        data: [] as IPriceData[],
        status: 'idle',
        error: ''
    },
    reducers: {
    }, 
    extraReducers(builder) {
        builder
            .addCase(fetchPriceDataAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPriceDataAsync.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (state.data && state.data.length === 0) {
                    state.data = action.payload;
                }
                else {
                    for (const element of action.payload as IPriceData[]) {
                        let idx = state.data.findIndex((row) => row.id === element.id);

                        if (idx >= 0) {
                            const prevPrice = state.data[idx]?.price;
                            const prevUpdatedAt = state.data[idx]?.updatedAt;

                            state.data[idx] = element;
                            state.data[idx].name = element.name;
                            state.data[idx].previousPrice = prevPrice;
                            state.data[idx].price = element.price;
                            //only update the date time if it's a new price so that the updated time refers to updated change in value not just a refresh
                            state.data[idx].updatedAt = prevPrice === element.price ? prevUpdatedAt : element.updatedAt;
                        }
                    };
                }
            })
            .addCase(fetchPriceDataAsync.rejected, (state) => {
                state.status = 'failed'
            })
            .addCase(savePriceUpdate.fulfilled, (state, action) => {
                state.status = 'succeeded'
                if (state.data && state.data.length === 0) {
                    state.data = action.payload;
                }
                else {
                    for (const element of action.payload as IPriceData[]) {
                        let idx = state.data.findIndex((row) => row.id === element.id);

                        if (idx >= 0) {
                            const prevPrice = state.data[idx]?.price;
                            const prevUpdatedAt = state.data[idx]?.updatedAt;

                            state.data[idx] = element;
                            state.data[idx].name = element.name;
                            state.data[idx].previousPrice = prevPrice;
                            state.data[idx].price = element.price;
                            //only update the date time if it's a new price so that the updated time refers to updated change in value not just a refresh
                            state.data[idx].updatedAt = prevPrice === element.price ? prevUpdatedAt : element.updatedAt;
                        }
                    };
                }
            })
    }
})

export const savePriceUpdate = createAsyncThunk('priceUpdate', async (data: IPriceData[]) => {
    return data;
});

export const fetchPriceDataAsync = createAsyncThunk('data/fetchPriceData', async () => {
    const response = await fetch(`https://localhost:7195/PriceData`)
    return response.json();
})

export const selectPriceData = (state: IAppState) => state.priceData.data;

export default priceDataSlice.reducer