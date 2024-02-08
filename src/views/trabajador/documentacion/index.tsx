import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import { RootState, getClasesDocumentacionByTrabajador, useAppDispatch, useAppSelector } from "../../../store";
import { useAPIData } from "../../../api/useAPIData";
import { Archivo, Clase, DECLARACION_JURADA_ACEPTADA, ARCHIVO_DESCARGADO, TIPO_CLASE, VIDEO_VISTO, ArchivoTrabajador } from "../../../interfaces/entities";
import { Alert, Button, CardActions, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, Tooltip } from "@mui/material";
import { acceptDeclaracionJurada, getDeclaracionesJuradasByTrabajador, marcarArchivoDescargado } from "../../../store/slices/archivoTrabajador";
import moment from "moment";
import HeaderTrabajadorView from "../header";

const initialStateClase: Clase = {
    id: 0,
    titulo: '',
    descripcion: '',
    id_periodo: 0,
    tipo: TIPO_CLASE.DOCUMENTACION,
    fecha_inicio: moment().format('YYYY-MM-DD'),
    fecha_fin: moment().add(3, 'months').format('YYYY-MM-DD'),
    imagen: '',
}

const initialStateArchivo: Archivo = {
    id: 0,
    id_clase: 0,
    titulo: '',
    descripcion: '',
    tipo: '',
    url: '',
    extension: '',
    imagen: '',
    visto: VIDEO_VISTO.NO_VISTO
}

const initialStateDeclaracionJurada: ArchivoTrabajador = {
    id: 0,
    id_archivo: 0,
    id_trabajador: 0,
    descargado: ARCHIVO_DESCARGADO.SI,
    aceptado: DECLARACION_JURADA_ACEPTADA.RECHAZADA,
}

export default function ViewTrabajadorDocumentacion(){
    const [openDialog, setOpenDialog] = React.useState(false);
    const { clases: clasesReducer } = useAppSelector((state:RootState) => state.clases);
    const [clase, setClase] = React.useState<Clase>(initialStateClase);
    const [archivos, setArchivos] = React.useState<Archivo[]>([]);
    const [archivo, setArchivo] = React.useState<Archivo>(initialStateArchivo);
    const { archivosTrabajadores: declaracionesJuradasReducer } = useAppSelector((state:RootState) => state.archivosTrabajadores);
    const [declaracionesJuradas, setDeclaracionesJuradas] = React.useState<ArchivoTrabajador[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAuthUser();

    React.useEffect(() => {
        dispatch(getClasesDocumentacionByTrabajador(auth()?.id_trabajador || '0'));
        dispatch(getDeclaracionesJuradasByTrabajador(auth()?.id_trabajador || '0'));
    }, []);

    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setClase(data[0]);
            if(!data[0]) setArchivos([]);
            else setArchivos(data[0].archivos || []);
        },
        onRejected: error => {
            console.log(error);
        },
        onPending: () => {}

    }), [clasesReducer]));

    useAPIData(declaracionesJuradasReducer, React.useMemo(() => ({
        onFulfilled: (data: ArchivoTrabajador[]) => {
            setDeclaracionesJuradas(data);
        },
        onRejected: error => {
            console.log(error);
        },
        onPending: () => {}
    }), [declaracionesJuradasReducer]));

    const handleOpenDialog = (event: React.MouseEvent<HTMLElement>, archivo: Archivo) => {
        setOpenDialog(true);
        setArchivo({...archivo});
    }

    const handleAceptarDeclaracion = () => {
        setOpenDialog(false);
        window.open(archivo.url, '_blank');

        dispatch(acceptDeclaracionJurada({
            ...initialStateDeclaracionJurada, 
            id_archivo: archivo.id, 
            id_trabajador: auth()?.id_trabajador || '0', 
            aceptado: DECLARACION_JURADA_ACEPTADA.ACEPTADA,
        }));
    }

    const handleDescargar = (event: React.MouseEvent<HTMLElement>, archivo: Archivo) => {
        dispatch(marcarArchivoDescargado({
            ...initialStateDeclaracionJurada,
            id_archivo: archivo.id,
            id_trabajador: auth()?.id_trabajador || '0',
            descargado: ARCHIVO_DESCARGADO.SI,
        }))
    }

    return(
        <Box component="main" sx={{width: '100%', height: '100vh',}}>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Conformidad</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{textDecoration: 'underline'}}>
                        {archivo.titulo}
                    </Typography>
                    <Typography variant="body1" sx={{fontStyle: 'italic'}}>
                        {archivo.descripcion}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{my:3}}>
                        Por el presente acepto que recib&iacute; informaci&oacute;n acerca de "{archivo.titulo}" de mi puesto de trabajo 
                        a trav&eacute;s de esta plataforma
                    </Typography>
                    <Alert severity="info" sx={{mt:2}}>
                        Recuerda leer el documento antes de asumir tu puesto, respentando lo que se se&ntilde;ala all&iacute;. 
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => handleAceptarDeclaracion()}>Aceptar</Button>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            <HeaderTrabajadorView />
            {archivos.length === 0 ?
            <Box>
                <Alert severity='info'>
                    <Typography variant='h6' sx={{ mb: 2 }}>No se encuentra matriculado en ning&uacute;n curso de documentaci&oacute;n</Typography>
                </Alert>
            </Box>
            :
            <Paper sx={{width: '100%', p:2}}>
                <Grid container spacing={4} justifyContent={'center'}>
                    {archivos.map(archivo => {
                        let fecha_inicio = moment(clase.fecha_inicio);
                        let fecha_fin = moment(clase.fecha_fin);
                        let fecha_actual = moment();
    
                        let disponible = fecha_actual.isAfter(fecha_inicio, 'minutes') && fecha_actual.isBefore(fecha_fin, 'minutes');
    
                        return (
                    <Grid item key={archivo.id} xs={12} sm={6} md={4}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="280"
                                sx={{width: 'fit-content'}}
                                image={archivo.imagen}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {archivo.titulo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {archivo.descripcion}
                                </Typography>
                                {!disponible && <Alert sx={{mt:2}} severity="info">Disponible desde: {fecha_inicio.format('DD/MM/YYYY')}, hasta: {fecha_fin.format('DD/MM/YYYY')}</Alert>}
                            </CardContent>
                            <CardActions>
                                <Grid container spacing={2} direction={'row'}>
                                    <Grid item xs={6}>
                                        {
                                        !disponible 
                                        ?<Button size="small" disabled={true}>Descargar y aceptar</Button>
                                        :(
                                            declaracionesJuradas.some(declaracion => 
                                                declaracion.id_archivo === archivo.id ) 
                                            ? <a href={archivo.url} target="_blank" rel="noreferrer">
                                                <Button size="small" disabled={!disponible}>Descargar</Button>
                                            </a>
                                            :<Button size="small" disabled={!disponible} sx={{ml:2}} onClick={(event) => handleOpenDialog(event, archivo)}>Descargar y aceptar</Button>
                                        )
                                        }
                                    </Grid>
                                    <Grid item xs={6} display={'flex'} justifyContent={'flex-end'}>
                                        <Tooltip title={declaracionesJuradas.some(declaracion => declaracion.id_archivo === archivo.id && declaracion.aceptado === DECLARACION_JURADA_ACEPTADA.ACEPTADA) ? "Aceptado" : "No aceptado"}>
                                            <ThumbUpAltIcon color={declaracionesJuradas.some(declaracion => declaracion.id_archivo === archivo.id && parseInt(''+declaracion.aceptado) === DECLARACION_JURADA_ACEPTADA.ACEPTADA) ? "primary" : "disabled"} />
                                        </Tooltip>
                                        <Divider orientation="vertical" sx={{mx:1}} />
                                        <Tooltip title={declaracionesJuradas.some(declaracion => declaracion.id_archivo === archivo.id && declaracion.descargado === ARCHIVO_DESCARGADO.SI) ? "Descargado" : "No descargado"}>
                                            <FileDownloadDoneIcon color={declaracionesJuradas.some(declaracion => declaracion.id_archivo === archivo.id && parseInt(''+declaracion.descargado) === ARCHIVO_DESCARGADO.SI) ? "primary" : "disabled"} />
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                    )})}
                </Grid>
            </Paper>
            }
        </Box>
    )
}