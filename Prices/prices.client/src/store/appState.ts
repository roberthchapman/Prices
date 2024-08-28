import { IPriceData } from "../models/priceData";

export interface IAppState {
    priceData: IData;
}

export interface IData {
    data: IPriceData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string;
}