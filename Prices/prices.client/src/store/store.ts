import { configureStore } from '@reduxjs/toolkit';
import priceDataReducer from './priceDataSlice';

export default configureStore({
    reducer: {
        priceData: priceDataReducer
    },
});