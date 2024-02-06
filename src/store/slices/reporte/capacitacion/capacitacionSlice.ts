import { createSlice } from "@reduxjs/toolkit";
import { CapacitacionSerie } from "../../../../interfaces/report";
import { AvanceCapacitacionState } from "../../../../interfaces/report";
import { APIStatus } from "../../../../interfaces/response";
import { getCapacitacionSerie } from "./thunks";

const initialState: AvanceCapacitacionState = {
    capacitacionReports: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const capacitacionSlice = createSlice({
    name: 'capacitacion',
    initialState,
    reducers: { },
    extraReducers(builder) {
        builder
        .addCase(getCapacitacionSerie.pending, (state) => {
            state.capacitacionReports.status = APIStatus.PENDING;
        })
        .addCase(getCapacitacionSerie.fulfilled, (state, action) => {
            state.capacitacionReports.status = APIStatus.FULFILLED;
            state.capacitacionReports.data = [action.payload];
        })
        .addCase(getCapacitacionSerie.rejected, (state, action) => {
            state.capacitacionReports.status = APIStatus.REJECTED;
            state.capacitacionReports.error = action.payload;
        });
    },
})