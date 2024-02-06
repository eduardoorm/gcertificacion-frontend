import { createAsyncThunk } from "@reduxjs/toolkit";
import { InduccionSerie } from "../../../../interfaces/report/series";
import { APIError, APIResponse } from "../../../../interfaces/response";
import { gcertificacionApi } from "../../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../../util/getExceptionPayload";

export const getInduccionSerie = createAsyncThunk<
        InduccionSerie,
        string,
        {rejectValue: APIError<InduccionSerie>}
    >('report/induccion-serie', async(id: string, {rejectWithValue}) => {
    try {
        const response = await gcertificacionApi.get<APIResponse<InduccionSerie[]>>(`/report/induccion/empresa-cliente/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});