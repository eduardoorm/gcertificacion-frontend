import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Clase, TIPO_CLASE } from "../../../interfaces/entities";
import {RootState,getClasesByTrabajador,useAppDispatch,useAppSelector} from "../../../store";
import { useAPIData } from "../../../api/useAPIData";
import { useAuthUser } from "react-auth-kit";
import HeaderTrabajadorView from "../../header/header";
import moment from "moment";
import CardClassWorker from "../../../components/Trabajador/CardClass/CardClassWorker/CardClassWorker";

export default function ViewTrabajadorDefault() {
    const { clases: clasesReducer } = useAppSelector(
        (state: RootState) => state.clases
    );
    const [clases, setClases] = React.useState<Clase[]>([]);
    const dispatch = useAppDispatch();
    const auth = useAuthUser();

    React.useEffect(() => {
        dispatch(getClasesByTrabajador(auth()?.id_trabajador || "0"));
    }, []);

    useAPIData(
        clasesReducer,
        React.useMemo(
            () => ({
                onFulfilled: (data: Clase[]) => {
                    setClases(data);
                },
                onRejected: (error) => {
                    console.log(error);
                },
                onPending: () => {},
            }),
            [clasesReducer]
        )
    );

    const inducciones = clases.filter(
        (clase) => clase.tipo === TIPO_CLASE.INDUCCION
    );
    const capacitaciones = clases.filter(
        (clase) => clase.tipo === TIPO_CLASE.CAPACITACION
    );
    const documentaciones = clases.filter(
        (clase) => clase.tipo === TIPO_CLASE.DOCUMENTACION
    );

    const renderClases = (clases: Clase[]) => {
        return clases.map((classWorker) => {
            let disponible =
                moment().isAfter(moment(classWorker.fecha_inicio), "minutes") &&
                moment().isBefore(moment(classWorker.fecha_fin), "minutes");
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
                        disponible={disponible}
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
                    {renderClases(inducciones)}
                    {renderClases(capacitaciones)}
                    {renderClases(documentaciones)}
                </Grid>
            </Paper>
        </Box>
    );
}
