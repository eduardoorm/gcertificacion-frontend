import { ESTADO } from "../../util/commonInterface";
import { APIData } from "../response";
import { Clase } from "./Clase";

export interface Periodo {
    id: number,
    id_empresa_cliente: number,
    codigo: string,
    descripcion: string,
    activo: ESTADO,
    fecha_inicio: string,
    fecha_fin: string,
    clases?: Clase[]
}

export interface PeriodoState {
    periodos: APIData<Periodo[]>
}