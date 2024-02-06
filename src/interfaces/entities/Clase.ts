import { APIData } from "../response";
import { Archivo } from "./Archivo";
import { ClaseTrabajador } from "./ClaseTrabajador";

export enum TIPO_CLASE {
    INDUCCION = 'induccion' as any,
    CAPACITACION = 'capacitacion' as any,
    DOCUMENTACION = 'documentacion' as any,
}

export enum TAG_CLASE {
    induccion = 'Inducción' as any,
    capacitacion = 'Capacitación' as any,
    documentacion = 'Sistema de gestión SST' as any,
}

export interface Clase {
    id: number,
    id_periodo: number,
    titulo: string,
    descripcion: string,
    tipo: TIPO_CLASE,
    fecha_inicio: string,
    fecha_fin: string,
    imagen: string,
    archivos?: Archivo[],
    clases_trabajadores?: ClaseTrabajador,
}

export interface ClaseState {
    clases: APIData<Clase[]>,
}

export interface InduccionSteps {
    titulo: string,
    descripcion: string,
    url: string,
}