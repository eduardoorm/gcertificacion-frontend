import { APIData } from "../response";

export enum TIPO_ARCHIVO {
    VIDEO = 'video',
    DOCUMENTO = 'documento',
}

export enum VIDEO_VISTO {
    NO_VISTO = 0,
    VISTO = 1,
}

export interface Archivo {
    id: number,
    id_clase: number,
    titulo: string,
    descripcion: string,
    url: string,
    extension: string,
    tipo: string,
    imagen: string,
    visto: VIDEO_VISTO,
}

export interface ArchivoState {
    archivos: APIData<Archivo[]>,
}