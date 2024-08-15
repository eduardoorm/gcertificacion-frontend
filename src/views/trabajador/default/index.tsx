import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Clase, TIPO_CLASE } from "../../../interfaces/entities";
import HeaderTrabajadorView from "../../header/header";
import CardClassWorker from "../../../components/Trabajador/CardClass/CardClassWorker/CardClassWorker";
import imageSectionInduccion from '../../../assets/images/SectionInduccion.jpg'
import imageSectionCapacitacion from '../../../assets/images/SectionCapacitacion.jpg'
import imageSectionSistemaGestion from '../../../assets/images/SectionSistemaGestion.jpg'

export default function ViewTrabajadorDefault() {
    const sectionInduccion = {
        id: 1,
        id_periodo: 123,
        titulo: "Inducción",
        descripcion: "",
        path: "induccion",
        section: true,
        tipo: TIPO_CLASE.INDUCCION,
        fecha_inicio: "",
        fecha_fin: "",
        imagen: imageSectionInduccion,
        archivos: [],
        clases_trabajadores: undefined
    };

    const sectionCapacitacion = {
        id: 2,
        id_periodo: 123,
        titulo: "Capacitación",
        path: "capacitacion",
        descripcion: "",
        section: true,
        tipo: TIPO_CLASE.CAPACITACION,
        fecha_inicio: "",
        fecha_fin: "",
        imagen: imageSectionCapacitacion,
        archivos: [],
        clases_trabajadores: undefined
    };

    const sectionDocumentacion = {
        id: 3,
        id_periodo: 123,
        titulo: "Sistema de Gestión de Seguridad y Salud en el Trabajo",
        descripcion: "",
        section: true,
        path: "documentacion",
        tipo: TIPO_CLASE.DOCUMENTACION,
        fecha_inicio: "",
        fecha_fin: "",
        imagen: imageSectionSistemaGestion,
        archivos: [],
        clases_trabajadores: undefined
    };
    

    // Luego, agrupas estas clases en un array
    const clasesArray = [sectionInduccion,sectionCapacitacion, sectionDocumentacion];

    const renderClases = (clases: Clase[]) => {
        return clases.map((classWorker) => {
            return (
                <Grid
                    display={"flex"}
                    alignItems={"stretch"}
                    item
                    key={classWorker.id}
                    xs={12}
                    sm={6}
                    md={4}
                >
                    <CardClassWorker
                        classWorker={classWorker}
                        disponible={'null'}
                        fechaInicio={null}
                    />
                </Grid>
            );
        });
    };
    

    return (
        <Box component="main" sx={{ width: "100%" }}>
            <HeaderTrabajadorView />
            <Paper sx={{ width: "100%", p: 2 }}>
                <Grid container spacing={3}>
                    {renderClases(clasesArray)}     
                </Grid>
            </Paper>
            
        </Box>
    );
}
