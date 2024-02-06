import { createSlice } from "@reduxjs/toolkit";
import { AvanceInduccionState } from "../../../../interfaces/report";
import { APIStatus } from "../../../../interfaces/response";
import { getInduccionSerie } from "./thunks";

const initialState: AvanceInduccionState = {
    induccionReports: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const induccionSlice = createSlice({
    name: 'induccion',
    initialState,
    reducers: { },
    extraReducers(builder) {
        builder
        .addCase(getInduccionSerie.pending, (state) => {
            state.induccionReports.status = APIStatus.PENDING;
        })
        .addCase(getInduccionSerie.fulfilled, (state, action) => {
            state.induccionReports.status = APIStatus.FULFILLED;
            state.induccionReports.data = [action.payload];
        })
        .addCase(getInduccionSerie.rejected, (state, action) => {
            state.induccionReports.status = APIStatus.REJECTED;
            state.induccionReports.error = action.payload;
        });
    },
})