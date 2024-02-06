import { createAsyncThunk } from "@reduxjs/toolkit";
import { DocumentacionSerie } from "../../../../interfaces/report";
import { APIError, APIResponse } from "../../../../interfaces/response";
import { gcertificacionApi } from "../../../../api/gcertificacionApi";
import { getExceptionPayload } from "../../../../util/getExceptionPayload";

export const getDocumentacionSerie = createAsyncThunk<
        DocumentacionSerie,
        string,
        {rejectValue: APIError<DocumentacionSerie>}
    >('report/documentacion-serie', async(id: string, {rejectWithValue}) => {
    try {
        //const response = await gcertificacionApi.get<APIResponse<DocumentacionSerie[]>>(`/report/documentacion/empresa-cliente/${id}`);
        const response = await gcertificacionApi.get<APIResponse<DocumentacionSerie[]>>(`/report/documentacion/${id}`);
        return response.data.data[0];
    } catch (err: any) {
        return rejectWithValue(getExceptionPayload(err));
    }
});