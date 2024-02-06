import { createAsyncThunk } from "@reduxjs/toolkit";
import { CapacitacionSerie } from "../../../../interfaces/report/series";
import { APIError, APIResponse } from "../../../../interfaces/response";
import { gcertificacionApi } from "../../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../../util/getExceptionPayload";

export const getCapacitacionSerie = createAsyncThunk<
        CapacitacionSerie,
        string,
        {rejectValue: APIError<CapacitacionSerie>}
    >('report/capacitaccion-serie', async(id: string, {rejectWithValue}) => {
    try {
        //const response = await gcertificacionApi.get<APIResponse<CapacitacionSerie[]>>(`/report/capacitacion/empresa-cliente/${id}`);
        const response = await gcertificacionApi.get<APIResponse<CapacitacionSerie[]>>(`/report/capacitacion/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});