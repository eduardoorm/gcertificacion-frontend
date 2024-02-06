import { APIData } from "../response";
import { Clase } from "./Clase";
import { EmpresaCliente } from "./EmpresaCliente";
import { Periodo } from "./Periodo";
import { Pregunta } from "./Pregunta";

export interface BancoPreguntas {
    id: number,
    id_clase: number,
    nombre: string,
    descripcion: string,
    clase?: Clase,
    empresaCliente?: EmpresaCliente,
    periodo?: Periodo,
    preguntas?: Pregunta[]
}

export interface BancoPreguntasState {
    bancosPreguntas: APIData<BancoPreguntas[]>;
}