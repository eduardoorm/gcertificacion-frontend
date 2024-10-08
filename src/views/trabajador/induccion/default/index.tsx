import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Clase, TIPO_CLASE } from "../../../../interfaces/entities";
import { RootState, getClasesByTrabajador, useAppDispatch, useAppSelector } from "../../../../store";
import { useAPIData } from "../../../../api/useAPIData";
import { useAuthUser } from "react-auth-kit";
import HeaderTrabajadorView from "../../../header/header";
import moment from "moment";
import CardClassWorker from "../../../../components/Trabajador/CardClass/CardClassWorker/CardClassWorker";
import 'reactjs-popup/dist/index.css';
import { DigitalSignature } from "../../../../components/DigitalSignature";
import Modal from "@mui/material/Modal";
import ModalSignature from "../../../../components/ModalSignature/ModalSignature";
import { tieneFirma } from "../../../../util/getSignature";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    boxShadow: 24,
    border: "none",
    p: 4,
};

export default function ViewInduccionDefault() {
    const { clases: clasesReducer } = useAppSelector(
        (state: RootState) => state.clases
    );
    const [inducciones, setInducciones] = React.useState<Clase[]>([]);
    const dispatch = useAppDispatch();
    const auth = useAuthUser();
    const idTrabajador = auth()?.id_trabajador;
    const handleClose = () => setHasSignature(false);
    const [hasSignature, setHasSignature] = React.useState(false);

    React.useEffect(() => {
        dispatch(getClasesByTrabajador(auth()?.id_trabajador || "0"));
    }, []);

    React.useEffect(() => {
        if (idTrabajador) {
            tieneFirma(idTrabajador).then(result => setHasSignature(!result));
        }
    }, [idTrabajador]);

    useAPIData(clasesReducer, React.useMemo(
        () => ({
            onFulfilled: (data: Clase[]) => {
                setInducciones(
                    data.filter(
                        (clase) => clase.tipo === TIPO_CLASE.INDUCCION
                    )
                );
            },
            onRejected: (error) => {
                console.log(error);
            },
            onPending: () => { },
        }),
        [clasesReducer]
    ));

    const dataInduccion = (inducciones: Clase[]) => {
        return inducciones.map((induccion) => {
            let disponible = moment().isAfter(moment(induccion.fecha_inicio), "minutes") &&
                moment().isBefore(moment(induccion.fecha_fin), "minutes");
            return (
                <Grid
                    display={"flex"}
                    alignItems={"stretch"}
                    item
                    key={induccion.id}
                    xs={12}
                    sm={6}
                    md={4}
                >
                    <CardClassWorker
                        classWorker={induccion}
                        disponible={disponible}
                        fechaInicio={induccion.fecha_inicio}
                    />
                </Grid>
            );
        })
    }

    return (
        <Box component="main" sx={{ width: "100%" }}>
            <HeaderTrabajadorView />
            <Paper sx={{ width: "100%", p: 2 }}>
                <Grid container spacing={3} justifyContent={"center"}>
                    {dataInduccion(inducciones)}
                </Grid>
            </Paper>

            <ModalSignature hasSignature={hasSignature} handleClose={handleClose} idTrabajador={idTrabajador} />
           
        </Box>
    );
}