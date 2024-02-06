import { createSlice } from "@reduxjs/toolkit";
import { AvanceDocumentacionState } from "../../../../interfaces/report";
import { APIStatus } from "../../../../interfaces/response";
import { getDocumentacionSerie } from "./thunks";

const initialState: AvanceDocumentacionState = {
    documentacionReports: {
        status: APIStatus.IDLE,
        data: []
    }
}

export const documentacionSlice = createSlice({
    name: 'documentacion',
    initialState,
    reducers: { },
    extraReducers(builder) {
        builder
        .addCase(getDocumentacionSerie.pending, (state) => {
            state.documentacionReports.status = APIStatus.PENDING;
        })
        .addCase(getDocumentacionSerie.fulfilled, (state, action) => {
            state.documentacionReports.status = APIStatus.FULFILLED;
            state.documentacionReports.data = [action.payload];
        })
        .addCase(getDocumentacionSerie.rejected, (state, action) => {
            state.documentacionReports.status = APIStatus.REJECTED;
            state.documentacionReports.error = action.payload;
        });
    },
});