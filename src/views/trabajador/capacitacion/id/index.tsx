import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Alert, AlertTitle } from '@mui/material'; 
import { AlertColor } from '@mui/material'; 
import { Card } from '@mui/material'; 
import { CardActionArea } from '@mui/material'; 
import { CardContent } from '@mui/material'; 
import { CardHeader } from '@mui/material'; 
import { CardMedia } from '@mui/material'; 
import { CircularProgress } from '@mui/material'; 
import { Dialog } from '@mui/material'; 
import { DialogActions } from '@mui/material'; 
import { DialogContent } from '@mui/material'; 
import { DialogTitle } from '@mui/material'
import { Divider } from '@mui/material'; 
import { FormControlLabel } from '@mui/material'; 
import { Grid } from '@mui/material'; 
import { IconButton } from '@mui/material'; 
import { MobileStepper } from '@mui/material'; 
import { Radio } from '@mui/material'; 
import { RadioGroup } from '@mui/material'; 
import { Snackbar } from '@mui/material'; 
import { Stack } from '@mui/material'; 
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import { VideoPlayer } from '../../../../ui-component/VideoPlayer';
import { Clase, EXAMEN_APROBADO, ExamenAzar, Pregunta, RespuestaElegida, TIPO_ARCHIVO, TIPO_CLASE, VIDEO_VISTO } from '../../../../interfaces/entities';
import { useAPIData } from '../../../../api/useAPIData';
import { RootState, getClasesCapacitacionByTrabajador, useAppDispatch, useAppSelector } from '../../../../store';
import { addExamenAzar, getExamenAzarByClaseTrabajador, solveExamenAzar } from '../../../../store';
import { useAuthUser } from 'react-auth-kit';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react'
import '../../../../assets/css/embla.css';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import HeaderTrabajadorView from '../../header';

const messageNoQuestions = 'No hay preguntas disponibles, comuníquese con el administrador';

const initialStateClase: Clase = {
    id: 0,
    titulo: '',
    descripcion: '',
    id_periodo: 0,
    tipo: TIPO_CLASE.CAPACITACION,
    fecha_inicio: moment().format('YYYY-MM-DD'),
    fecha_fin: moment().add(3, 'months').format('YYYY-MM-DD'),
    imagen: '',
}

const initialStateExamenAzar: ExamenAzar = {
    id: 0,
    id_clase_trabajador: 0,
    numero_intento: 0,
    aprobado: EXAMEN_APROBADO.NEUTRO,
    respuestas_correctas: 0,
    respuestas_incorrectas: 0,
    nota: 0,
    certificado: '',
    preguntas: [],
}

export default function ViewTrabajadorCapacitacion() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [activeStepPregunta, setActiveStepPregunta] = React.useState(0);
    const [finishedVideo, setFinishedVideo] = React.useState(0);
    const [openDialogResult, setOpenDialogResult] = React.useState(false);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [loading, setLoading] = React.useState(false);
    const { examenesAzar: examenesAzarReducer } = useAppSelector((state:RootState) => state.examenesAzar);
    const [examenAzar, setExamenAzar] = React.useState<ExamenAzar>(initialStateExamenAzar);
    const { clases: clasesReducer } = useAppSelector((state:RootState) => state.clases);
    const [clase, setClase] = React.useState<Clase>(initialStateClase);
    const [preguntas, setPreguntas] = React.useState<Pregunta[]>([]);
    const [respuestasElegidas, setRespuestasElegidas] = React.useState<RespuestaElegida[]>([]);
    const [message1, setMessage1] = React.useState(messageNoQuestions);
    const [justSolved, setJustSolved] = React.useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAuthUser();
    const { id } = useParams();

    const [emblaRef, emblaApi] = useEmblaCarousel();
    const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const scrollPrev = React.useCallback(() => {
        setActiveStepPregunta((prevActiveStep) => prevActiveStep - 1);
        return emblaApi && emblaApi.scrollPrev()
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        setActiveStepPregunta((prevActiveStep) => prevActiveStep + 1);
        return emblaApi && emblaApi.scrollNext()
    }, [emblaApi])
  
    const onInit = React.useCallback((emblaApi: EmblaCarouselType) => {
      setScrollSnaps(emblaApi.scrollSnapList())
    }, []);
  
    const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setPrevBtnEnabled(emblaApi.canScrollPrev())
      setNextBtnEnabled(emblaApi.canScrollNext())
    }, [preguntas]);

    React.useEffect(() => {
        if (!emblaApi) return
    
        onInit(emblaApi)
        onSelect(emblaApi)
        emblaApi.on('reInit', onInit)
        emblaApi.on('reInit', onSelect)
        emblaApi.on('select', onSelect)
      }, [emblaApi, onInit, onSelect]);
    
    React.useEffect(() => {
        dispatch(getClasesCapacitacionByTrabajador(auth()?.id_trabajador || '0'))
    }, []);
    
    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setClase(data.filter(d => d.id === parseInt(id || '0'))[0] || initialStateClase);
            //setClase(data[0] || initialStateClase);
            if(data.filter(d => d.id === parseInt(id || '0'))[0] && data.filter(d => d.id === parseInt(id || '0'))[0].tipo === TIPO_CLASE.CAPACITACION) {
                dispatch(getExamenAzarByClaseTrabajador(data.filter(d => d.id === parseInt(id || '0'))[0].clases_trabajadores?.id.toString() || '0'));
            }
        },
        onRejected: (error) => {
            console.log(error);
        },
        onPending: () => {
        }
    }), [clasesReducer]));

    useAPIData(examenesAzarReducer, React.useMemo(() => ({
        onFulfilled: (data: ExamenAzar[]) => {
            setLoading(false);

            if(!data[0]) return;

            //Respuesta al examen resuelto
            if( data[0].tipo === TIPO_CLASE.CAPACITACION && data[0].respuestas_correctas + data[0].respuestas_incorrectas > 0){
                let data_ = {...data[0]};
                setExamenAzar(data_);
                setOpenDialogResult(justSolved);
                setActiveStepPregunta(0);
                emblaApi?.reInit();
                emblaApi?.scrollTo(0);
                setRespuestasElegidas([]);
                setPreguntas([]);
            }
            //Obtención del examen para resolver
            else {
                setExamenAzar({...initialStateExamenAzar, ...data[0]});
                setPreguntas(data[0]?.preguntas || []);
                setMessage1(messageNoQuestions);
            }
        },
        onRejected: (error) => {
            setLoading(false);
            setToastMessageSeverity('error');
            setToastMessage(`${error.statusText}`);
            setMessage1(error.statusText);
            setOpenToastResponse(true);
            setPreguntas([]);
        },
        onPending: () => {
            setLoading(true);
        }
    }), [examenesAzarReducer]));

    const handleToQuiz = () => {
        let data: ExamenAzar = {
            id:0,
            id_clase_trabajador: clase.clases_trabajadores?.id || 0,
            numero_intento: 0,
            respuestas_correctas: 0,
            respuestas_incorrectas: 0,
            nota: 0,
            certificado: '',            
            aprobado: EXAMEN_APROBADO.NEUTRO
        };
        setActiveStepPregunta(0);
        dispatch(addExamenAzar(data));
        handleNext();
    }

    const handleBackToVideo = () => {
        setRespuestasElegidas([]);
        handleBack();
    }

    const handleFinishQuiz = () => {
        if(respuestasElegidas.length < preguntas.length){
            setToastMessageSeverity('error');
            setToastMessage('No ha respondido todas las preguntas');
            setOpenToastResponse(true);
        }
        else {
            setJustSolved(true);
            dispatch(solveExamenAzar({id_examen_azar: examenAzar.id, respuestas_elegidas: respuestasElegidas}));
        }
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleFinish = () => {
        setFinishedVideo(1);
    };

    const handleCloseToastResponse = () => {
        setOpenToastResponse(false);
    }

    const guardarRespuesta = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        let resp: RespuestaElegida = {
            id_pregunta: parseInt(value.split(',')[0]),
            id_respuesta: parseInt(value.split(',')[1])
        }

        let idx = respuestasElegidas.findIndex(el => el.id_pregunta === resp.id_pregunta);
        
        if(idx > -1){
            let temp = respuestasElegidas;
            temp[idx] = resp;
            setRespuestasElegidas(temp);
        }
        else {
            setRespuestasElegidas([...respuestasElegidas, resp]);
        }
    }

    const handleCloseDialogResult = () => {
        setOpenDialogResult(false);
        if(examenAzar.aprobado === EXAMEN_APROBADO.APROBADO){
            handleNext();
        }
    }

    const solicitarNuevoExamen = () => {
        setOpenDialogResult(false);
        setJustSolved(false);
        let data: ExamenAzar = {
            id:0,
            id_clase_trabajador: clase.clases_trabajadores?.id || 0,
            numero_intento: 0,
            respuestas_correctas: 0,
            respuestas_incorrectas: 0,
            nota: 0,
            certificado: '',
            aprobado: EXAMEN_APROBADO.NEUTRO
        };
        dispatch(addExamenAzar(data));
    }


    return (
        <Box component="main">
            <HeaderTrabajadorView />
            
            <Dialog keepMounted open={openDialogResult} onClose={handleCloseDialogResult}>
                <DialogTitle>Resultado</DialogTitle>
                <DialogContent>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="success">Respuesta correctas: {examenAzar.respuestas_correctas}</Alert>
                        <Alert severity="warning">Respuestas incorrectas: {examenAzar.respuestas_incorrectas}</Alert>
                        <Alert severity={examenAzar.aprobado === EXAMEN_APROBADO.APROBADO ? 'success' : 'error'}>Nota: {examenAzar.nota}</Alert>
                        {examenAzar.aprobado === EXAMEN_APROBADO.RECHAZADO && examenAzar.numero_intento === 2 &&
                        <Alert severity='error'>Ha alcanzado el m&aacute;ximo de intentos<br/>para rendir el examen</Alert> }
                        {examenAzar.aprobado === EXAMEN_APROBADO.RECHAZADO && examenAzar.numero_intento === 1 &&
                        <Alert severity='info'>Le queda un intento para rendir<br/>el examen</Alert> }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogResult}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {examenAzar.aprobado === EXAMEN_APROBADO.APROBADO && !justSolved && 
            <Box>
                <Alert variant='outlined' severity="info" sx={{ mb: 2 }}>
                    <AlertTitle>Info</AlertTitle>
                    Usted ya ha realizado exitosamente esta capacitaci&oacute;n; si lo desea, puede descargar el certificado
                </Alert>
                <a href={examenAzar.certificado} target='_blank'>
                <Button variant="contained" sx={{ mt: 1, mr: 1 }}>Descargar certificado</Button>
                </a>
            </Box> 
            }
            {examenAzar.aprobado === EXAMEN_APROBADO.RECHAZADO && examenAzar.numero_intento === 2 && !justSolved &&
            <Box>
                <Alert variant='outlined' severity="warning">
                    <AlertTitle>Intentos superados</AlertTitle>
                    Usted ya ha realizado esta capacitaci&oacute;n y ha alcanzado la cantidad m&aacute;xima de intentos para aprobar el examen.
                </Alert>
            </Box> 
            }

            {(examenAzar.aprobado === EXAMEN_APROBADO.NEUTRO || justSolved || (examenAzar.aprobado === EXAMEN_APROBADO.RECHAZADO && examenAzar.numero_intento < 2)) && 
            <>
            <Card>
                <CardHeader title='Pautas a seguir' />
                <Divider />
                <CardContent>
                    <Typography variant='body1' color='text.seconday'>
                        A continuaci&oacute;n se encontrar&aacute;n los temas que deben realizar y aprobar para continuar con su proceso
                    </Typography>
                    <Typography variant='body2' color='text.seconday'>
                        <InfoIcon />{' '}
                        Recuerde que debe visualizar el video completo y aprobar el examen para poder obtener un certificado
                    </Typography>
                </CardContent>
            </Card>
            <Stepper activeStep={activeStep} orientation="vertical" sx={{mt: 5}}>
                <Step key='paso.1'>
                    <StepLabel>
                        Inicio
                    </StepLabel>
                    <StepContent>
                        <Typography>Pulse el botón para iniciar con la capacitación</Typography>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Empezar
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                <Step key='paso.2'>
                    <StepLabel>
                        {clase.titulo}
                    </StepLabel>
                    <StepContent>
                        <Typography sx={{my: 3}}>{clase.descripcion}</Typography>
                        <VideoPlayer url={clase.archivos?.filter(item => item.tipo === 'video')[0]?.url || ''} onEnded={handleFinish} />
                        <Box sx={{ my: 3, pt:2}}>
                            <div>
                                {finishedVideo === 1 &&
                                <Alert severity="info">Ha terminado de ver el video, por favor presione el bot&oacute;n "Continuar" para rendir el examen</Alert>}
                                
                                {clase.archivos && clase.archivos.filter(item => item.tipo === TIPO_ARCHIVO.DOCUMENTO).length > 0 && (
                                <>
                                <Grid container spacing={2} 
                                    sx={{m: 1, p: 2, backgroundColor: "#E7EBF0", borderRadius: 1}} 
                                    direction={"row"} justifyContent={"flex-start"} alignContent={"center"} alignItems={"flex-start"}>
                                    
                                    {clase.archivos.filter((archivo) => archivo.tipo === TIPO_ARCHIVO.DOCUMENTO).map((archivo) => {
                                        return(
                                            <Grid item xs={6} key={archivo.id}>
                                                <Card sx={{ display: 'flex' }}>
                                                    <CardActionArea>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                            <CardMedia
                                                                component="img"
                                                                height="256"
                                                                sx={{ objectFit: 'cover', maxWidth: '256px' }}
                                                                image={archivo.imagen}
                                                            />
                                                            <CardContent >
                                                                <Typography component="div" variant="h5">
                                                                    {archivo.titulo}
                                                                </Typography>
                                                                <Typography variant="subtitle2" color="text.secondary" component="div">
                                                                    {archivo.descripcion}
                                                                </Typography>
                                                            </CardContent>
                                                        </Box>
                                                    </CardActionArea>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, pt: 1, flexDirection: 'column' }}>
                                                        <a target="_blank" href={archivo.url}>
                                                        <IconButton>
                                                            <DownloadIcon />
                                                        </IconButton>
                                                        </a>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                                </>
                                )}

                                {/*disabled={finishedVideo === 0 && clase.archivos?.filter(item => item.tipo === TIPO_ARCHIVO.VIDEO)[0]?.visto === VIDEO_VISTO.NO_VISTO}*/ }
                                <Button
                                    variant="contained"
                                    onClick={handleToQuiz}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Continuar
                                </Button>
                                <Button
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Regresar
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                <Step key='paso.3'>
                    <StepLabel>
                        Examen
                    </StepLabel>
                    <StepContent sx={{backgroundColor: 'white', p: 3, borderRadius: 2}}>
                        
                        {loading && <CircularProgress color="secondary" />} 

                        <Alert severity="info">Lea cuidadosamente las preguntas antes de elegir una respuesta</Alert>
                        {preguntas.length === 0 && !justSolved && <Alert severity="error">{message1}</Alert>}
                        
                        <div className="embla">
                            <div className="embla__viewport" ref={emblaRef}>
                                <div className="embla__container">
                                    {preguntas.length > 0 && preguntas.map((pregunta, index) => (
                                        <div className="embla__slide" key={pregunta.id}>
                                            <Typography variant="h5" component="h2" sx={{mb: 2}}>
                                                {pregunta.pregunta}
                                            </Typography>
                                            <Divider />
                                            <RadioGroup
                                                sx={{mt: 4}}
                                                aria-labelledby={`radio-buttons-group-${examenAzar.numero_intento}-${pregunta.id}`}
                                                name={`radio-buttons-group-${examenAzar.numero_intento}-${pregunta.id}`}
                                                onChange={guardarRespuesta}
                                            >
                                                {pregunta.respuestas?.map((respuesta, index) => (
                                                    <FormControlLabel 
                                                        key={respuesta.id} 
                                                        value={`${pregunta.id},${respuesta.id}`} 
                                                        control={<Radio />} 
                                                        label={respuesta.respuesta} />
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <MobileStepper
                            variant="progress"
                            steps={preguntas.length}
                            position="static"
                            activeStep={activeStepPregunta}
                            nextButton={
                                <Button
                                    size="small"
                                    onClick={scrollNext}
                                    disabled={!nextBtnEnabled}
                                >
                                    Siguiente
                                    <KeyboardArrowRight />
                                </Button>
                            }
                            backButton={
                                <Button size="small" onClick={scrollPrev} disabled={!prevBtnEnabled}>
                                    <KeyboardArrowLeft />
                                    Anterior
                                </Button>
                            }
                        />
                        <Box sx={{ mt: 4, mb: 2, visibility: respuestasElegidas.length < preguntas.length ? 'hidden' : 'visible' }}>
                            <div>
                                {!justSolved && examenAzar.numero_intento <= 2 &&
                                <Button
                                    disabled={respuestasElegidas.length < preguntas.length}
                                    variant="contained"
                                    onClick={handleFinishQuiz}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Finalizar examen
                                </Button>}
                                {justSolved && examenAzar.numero_intento < 2 &&
                                <Button sx={{mt: 1, mr: 1}} 
                                    variant='contained'
                                    onClick={solicitarNuevoExamen}
                                >
                                    Volver a intentar
                                </Button>}
                                <Button
                                    onClick={handleBackToVideo}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                  Regresar
                                </Button>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
                <Step key='paso.4'>
                    <StepLabel>
                        Certificado
                    </StepLabel>
                    <StepContent>
                        <Typography>Descargar certificado</Typography>
                        <Box sx={{ mb: 2 }}>
                            <a href={examenAzar.certificado} target='_blank'>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Descargar
                                </Button>
                            </a>
                        </Box>
                    </StepContent>
                </Step>
            </Stepper>
            {activeStep === 4/*steps.length*/ && (
            <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    Reset
                </Button>
            </Paper>
            )}
            </>}

            <Snackbar open={openToastResponse} autoHideDuration={6000} onClose={handleCloseToastResponse}>
                <Alert onClose={handleCloseToastResponse} severity={toastMessageSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}