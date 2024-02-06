import { APIData } from "../response"
import { TIPO_CLASE } from "./Clase"
import { Pregunta } from "./Pregunta"
import { RespuestaElegida } from "./Respuesta"

export enum EXAMEN_APROBADO {
    APROBADO = 1,
    RECHAZADO = 0,
    NEUTRO = -1,
}

export interface ExamenAzar {
    id: number,
    id_clase_trabajador: number,
    id_clase?: number,
    id_trabajador?: number,
    numero_intento: number
    aprobado: EXAMEN_APROBADO,
    respuestas_correctas: number,
    respuestas_incorrectas: number,
    nota: number,
    certificado: string,
    tipo?: TIPO_CLASE,
    preguntas?: Pregunta[],
}

export interface ExamenResuelto {
    id_examen_azar: number,
    respuestas_elegidas: RespuestaElegida[],
}

export interface ExamenAzarState {
    examenesAzar: APIData<ExamenAzar[]>,
}