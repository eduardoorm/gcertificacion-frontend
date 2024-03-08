import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate } from "react-router-dom";
import { Clase, TIPO_CLASE, Trabajador } from "../../../../interfaces/entities";
import { RootState, getClasesByTrabajador, useAppDispatch, useAppSelector } from "../../../../store";
import { useAPIData } from "../../../../api/useAPIData";
import { useAuthUser } from 'react-auth-kit'
import HeaderTrabajadorView from "../../../header/header";
import moment from "moment";
import CardClassWorker from "../../../../components/Trabajador/CardClass/CardClassWorker/CardClassWorker";

export default function ViewDocumentacionDefault () {
    const { clases: clasesReducer } = useAppSelector((state:RootState) => state.clases);
    //const [trabajador, setTrabajador] = React.useState<Trabajador>(initialStateTrabajador);
    const [documentaciones, setDocumentaciones] = React.useState<Clase[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAuthUser();

    React.useEffect(() => {
        dispatch(getClasesByTrabajador(auth()?.id_trabajador || '0'));
    }, []);

    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setDocumentaciones(data.filter(clase => clase.tipo === TIPO_CLASE.DOCUMENTACION));
        },
        onRejected: error => {
            console.log(error);
        },
        onPending: () => {
        }
    }), [clasesReducer]));


    const dataDocumentacion = (documentaciones: Clase[])=>{
        return documentaciones.map((documentacion)=>{
            let disponible = moment().isAfter(moment(documentacion.fecha_inicio), "minutes") &&
                            moment().isBefore(moment(documentacion.fecha_fin), "minutes");
            return (
                <Grid
                    display={"flex"}
                    alignItems={"stretch"}
                    item
                    key={documentacion.id}
                    xs={12}
                    sm={6}
                    md={4}
                >
                    <CardClassWorker
                        classWorker={documentacion}
                        disponible={disponible}
                        fechaInicio={documentacion.fecha_inicio}
                    />
                </Grid>
            );

        })
    }

  return (
    <Box component="main" sx={{width: '100%', }}>
            <HeaderTrabajadorView />

            <Paper sx={{width: '100%', p:2}}>
                <Grid container spacing={4} justifyContent={'center'}>
                    {dataDocumentacion(documentaciones)}
                </Grid>
            </Paper>
        </Box>
  )
}