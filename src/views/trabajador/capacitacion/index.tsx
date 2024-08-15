import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Clase, TIPO_CLASE } from "../../../interfaces/entities";
import { RootState, getClasesByTrabajador, useAppDispatch, useAppSelector } from "../../../store";
import { useAPIData } from "../../../api/useAPIData";
import { useAuthUser } from 'react-auth-kit'
import HeaderTrabajadorView from "../../header/header";
import moment from "moment";
import CardClassWorker from "../../../components/Trabajador/CardClass/CardClassWorker/CardClassWorker";
import ModalSignature from "../../../components/ModalSignature/ModalSignature";
import { tieneFirma } from "../../../util/getSignature";

export default function ViewCapacitacionDefault(){
    const { clases: clasesReducer } = useAppSelector((state:RootState) => state.clases);
    const [capacitaciones, setCapacitaciones] = React.useState<Clase[]>([]);
    const dispatch = useAppDispatch();
    const auth = useAuthUser();
    const idTrabajador = auth()?.id_trabajador;
    const handleClose = () => setHasSignature(false);
    const [hasSignature, setHasSignature] = React.useState(false);
    

    React.useEffect(() => {
        dispatch(getClasesByTrabajador(auth()?.id_trabajador || '0'));
    }, []);

    React.useEffect(() => {
        if (idTrabajador) {
            tieneFirma(idTrabajador).then(result => setHasSignature(!result));
        }
    }, [idTrabajador]);


    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setCapacitaciones(data.filter(clase => clase.tipo === TIPO_CLASE.CAPACITACION));
        },
        onRejected: error => {
            console.log(error);
        },
        onPending: () => {
        }
    }), [clasesReducer]));

    const dataCapacitaciones = (capacitaciones: Clase[])=>{
        return capacitaciones.map((capacitacion)=>{
            let disponible = moment().isAfter(moment(capacitacion.fecha_inicio), "minutes") &&
                            moment().isBefore(moment(capacitacion.fecha_fin), "minutes");
            return (
                <Grid
                    display={"flex"}
                    alignItems={"stretch"}
                    item
                    key={capacitacion.id}
                    xs={12}
                    sm={6}
                    md={4}
                >
                    <CardClassWorker
                        classWorker={capacitacion}
                        disponible={disponible}
                        fechaInicio={capacitacion.fecha_inicio}
                    />
                </Grid>
            );

        })
    }

    return (
        <Box component="main" sx={{width: '100%', }}>
            <HeaderTrabajadorView />

            <Paper sx={{width: '100%', p:2}}>
                <Grid container spacing={3} justifyContent={'center'}>
                    {dataCapacitaciones(capacitaciones)}
                </Grid>
            </Paper>

            <ModalSignature hasSignature={hasSignature} handleClose={handleClose} idTrabajador={idTrabajador} />

        </Box>
    );
}