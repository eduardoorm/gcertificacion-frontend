import { APIData } from "../response";

export enum RESPUESTA_CORRECTA {
    CORRECTA = 1,
    INCORRECTA = 0
}

export interface RespuestaElegida {
    id_pregunta: number,
    id_respuesta: number
}

export interface Respuesta {
    id: number,
    id_pregunta: number,
    respuesta: string,
    correcta?: RESPUESTA_CORRECTA,
}

export interface RespuestaState {
    respuestas: APIData<Respuesta[]>,
}