import { APIData } from "../response";
import { Respuesta } from "./Respuesta";

export interface Pregunta {
    id: number;
    id_banco_pregunta: number;
    pregunta: string;
    comentario: string;
    nota: number;
    respuestas?: Respuesta[];
}

export interface PreguntaState {
    preguntas: APIData<Pregunta[]>;
}