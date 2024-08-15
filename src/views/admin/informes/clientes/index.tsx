import React, { useEffect } from "react";
import ReactECharts, { EChartsInstance } from 'echarts-for-react';
import { useNavigate, useParams } from "react-router-dom";
import { Alert, AlertColor, Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Snackbar, Tab, Tabs, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RootState, getArchivos, getArchivosByClase, getClasesByEmpresa, selectEmpresaClienteById, useAppDispatch, useAppSelector } from "../../../../store";
import { useAPIData } from "../../../../api/useAPIData";
import { CapacitacionSerie, DocumentacionSerie, InduccionSerie, ItemSerie } from "../../../../interfaces/report/series";
import { getCapacitacionSerie } from "../../../../store";
import { getInduccionSerie } from "../../../../store/slices/reporte/induccion";
import { getDocumentacionSerie } from "../../../../store/slices/reporte/documentacion";
import { InitialBarOptions, InitialBarSerie, InitialGaugeOptions, InitialPieOptions } from "../../../../interfaces/report";
import { Archivo, Clase, EmpresaCliente, TIPO_CLASE } from "../../../../interfaces/entities";
import config from "../../../../config";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
        {value === index && (
            <Box sx={{ px: 3 }}>
                {children}
            </Box>
        )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function AdminInformesClientesView(){
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const { induccionReports: induccionReportsReducer } = useAppSelector((state:RootState) => state.induccionReports);
    const { capacitacionReports: capacitacionReportsReducer } = useAppSelector((state:RootState) => state.capacitacionReports);
    const { documentacionReports: documentacionReportsReducer } = useAppSelector((state:RootState) => state.documentacionReports);
    const [optionsAvanceInduccion, setOptionsAvanceInduccion] = React.useState(InitialPieOptions);
    const [optionsAvanceAreaInduccion, setOptionsAvanceAreaInduccion] = React.useState(InitialBarOptions);
    const [optionsAvanceCapacitacion, setOptionsAvanceCapacitacion] = React.useState(InitialPieOptions);
    const [optionsAvanceAreaCapacitacion, setOptionsAvanceAreaCapacitacion] = React.useState(InitialBarOptions);
    const [optionsAvanceDescargaDocumentacion, setOptionsAvanceDescargaDocumentacion] = React.useState(InitialPieOptions);
    const [optionsAvanceDeclaracionJurada, setOptionsAvanceDeclaracionJurada] = React.useState(InitialPieOptions);
    const [optionsAvanceAreaDocumentacion, setOptionsAvanceAreaDocumentacion] = React.useState(InitialBarOptions);
    const [optionsGaugeInduccion, setOptionsGaugeInduccion] = React.useState(InitialGaugeOptions);
    const [optionsGaugeCapacitacion, setOptionsGaugeCapacitacion] = React.useState(InitialGaugeOptions);
    const [optionsGaugeDocumentacion, setOptionsGaugeDocumentacion] = React.useState(InitialGaugeOptions);
    const [areaInduccionSelected, setAreaInduccionSelected] = React.useState('');
    const [areaCapacitacionSelected, setAreaCapacitacionSelected] = React.useState('');
    const [areaDocumentacionSelected, setAreaDocumentacionSelected] = React.useState('');
    const [serieDocumentacionSelected, setSerieDocumentacionSelected] = React.useState('');
    const { clases: clasesReducer } = useAppSelector((state:RootState) => state.clases);
    const { archivos: archivosReducer } = useAppSelector((state:RootState) => state.archivos);
    const [clases, setClases] = React.useState<Clase[]>([]);
    const [documentacion, setDocumentacion] = React.useState<Clase>({} as Clase);
    const [archivos, setArchivos] = React.useState<Archivo[]>([]);
    const [idClase, setIdClase] = React.useState('');
    const [idArchivo, setIdArchivo] = React.useState('');
    const [eChartRef, setEChartRef] = React.useState<any>(null);
    const [handleChangeSelectArchivo, setHandleChangeSelectArchivo] = React.useState(true);

    const [value, setValue] = React.useState(0);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [empresa, setEmpresa] = React.useState<EmpresaCliente>(useAppSelector((state:RootState) => selectEmpresaClienteById(state, parseInt(id || '0'))));
    
    React.useEffect(() => {
        dispatch(getInduccionSerie(id || '0'));
        //dispatch(getCapacitacionSerie(id || '0'));
        //dispatch(getDocumentacionSerie(id || '0'));
        dispatch(getClasesByEmpresa(id || '0'));
    }, []); 

    React.useEffect(() => {
        if(idClase !== '' && idClase !== '0') {
            dispatch(getCapacitacionSerie(idClase));
                    }
        else {
            setOptionsAvanceCapacitacion(InitialPieOptions);
            setOptionsAvanceAreaCapacitacion(InitialBarOptions);
                    }
    }, [idClase]);

    React.useEffect(() => {
        if(idArchivo !== '' && idArchivo !== '0') {
            dispatch(getDocumentacionSerie(idArchivo));
        }
        else {
            //setOptionsAvanceDescargaDocumentacion(InitialPieOptions);
            setOptionsAvanceDeclaracionJurada(InitialPieOptions);
            setOptionsAvanceAreaDocumentacion(InitialBarOptions);
        }
    }, [idArchivo])

    useAPIData(induccionReportsReducer, React.useMemo(() => ({
        onFulfilled: (data: InduccionSerie[]) => {
            setOptionsAvanceInduccion({
                ...InitialPieOptions,
                series: [{...InitialPieOptions.series[0], data: data[0].avanceInduccion}],
            });
            setOptionsAvanceAreaInduccion({
                ...InitialBarOptions,
                xAxis: {
                    ...InitialBarOptions.xAxis,
                    data: data[0].avanceAreasInduccion.map(item => item.name)
                },
                series: [{...InitialBarOptions.series[0], data: data[0].avanceAreasInduccion.map(item => item.value) }],
            })
        },
        onRejected: (error) => {
            ;
        },
        onPending: () => {
            ;
        }
    }), [induccionReportsReducer]));

    useAPIData(capacitacionReportsReducer, React.useMemo(() => ({
        onFulfilled: (data: CapacitacionSerie[]) => {
            setOptionsAvanceCapacitacion({
                ...InitialPieOptions,
                series: [{...InitialPieOptions.series[0], data: data[0].avanceCapacitacion}],
            });
            setOptionsAvanceAreaCapacitacion({
                ...InitialBarOptions,
                xAxis: {
                    ...InitialBarOptions.xAxis,
                    data: data[0].avanceAreasCapacitacion.map(item => item.name)
                },
                series: [{...InitialBarOptions.series[0], data: data[0].avanceAreasCapacitacion.map(item => item.value) }],
            })
        },
        onRejected: (error) => {
            ;
        },
        onPending: () => {
            ;
        }
    }), [capacitacionReportsReducer]));

    useAPIData(documentacionReportsReducer, React.useMemo(() => ({
        onFulfilled: (data: DocumentacionSerie[]) => {
            let seriesBar: typeof InitialBarSerie[] = []
            //seriesBar.push({...InitialBarSerie, name: 'Descargas', data: data[0].avanceAreasDescarga.map(item => item.value)});
            seriesBar.push({...InitialBarSerie, name: 'Declaración Jurada', data: data[0].avanceAreasDeclaracionJurada.map(item => item.value)});

            /*setOptionsAvanceDescargaDocumentacion({
                ...InitialPieOptions,
                series: [{...InitialPieOptions.series[0], data: data[0].avanceDescarga}],
            });*/
            setOptionsAvanceDeclaracionJurada({
                ...InitialPieOptions,
                series: [{...InitialPieOptions.series[0], data: data[0].avanceDeclaracionJurada}],
            });
            
            setOptionsAvanceAreaDocumentacion({
                ...InitialBarOptions,
                xAxis: {
                    ...InitialBarOptions.xAxis,
                    //data: data[0].avanceAreasDescarga.map(item => item.name)
                    data: data[0].avanceAreasDeclaracionJurada.map(item => item.name)
                },
                series: seriesBar,
            });
        },
        onRejected: (error) => {
            ;
        },
        onPending: () => {
            ;
        }
    }), [documentacionReportsReducer]));

    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {

            setClases(data)
            let c = data.find(clase => clase.tipo === TIPO_CLASE.DOCUMENTACION);
            if(c) {
                setDocumentacion(c);
                //dispatch(getArchivosByClase('' +c.id));
            }
        },
        onRejected: (error) => {
            if (error.statusText === 'Not Found') {
                setToastMessageSeverity('warning');
                setToastMessage('No se encontraron clases para este cliente');
            }
            else {
                setToastMessageSeverity('error');
                setToastMessage(`${error.status}: ${error.statusText}`);
            }
            setOpenToastResponse(true);
            setClases([]);
        },
        onPending: () => {
        }
    }), [clasesReducer]));


    useAPIData(archivosReducer, React.useMemo(() => ({
        onFulfilled: (data: Archivo[]) => {
            setArchivos(data);
            setDocumentacion({...documentacion, archivos: data});
        },
        onRejected: (error) => {
            setToastMessageSeverity('error');
            setToastMessage(`${error.status}: ${error.statusText}`);
            setOpenToastResponse(true);
        },
        onPending: () => {}
    }), [archivosReducer]));


    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClickBarInduccion = (params: any) => {
        setAreaInduccionSelected(params.name);
        setOptionsGaugeInduccion({
            ...InitialGaugeOptions,
            series: [{
                ...InitialGaugeOptions.series[0],
                data: [{name: 'Inducción', value: params.value}],
            }]
        })
    }

    const handleClickBarCapacitacion = (params: any) => {
        setAreaCapacitacionSelected(params.name);
        setOptionsGaugeCapacitacion({
            ...InitialGaugeOptions,
            series: [{
                ...InitialGaugeOptions.series[0],
                data: [{name: 'Capacitación', value: params.value}],
            }]
        })
    }

    const handleClickBarDocumentacion = (params: any) => {
        setAreaDocumentacionSelected(params.name);
        setSerieDocumentacionSelected(params.seriesName);
        setOptionsGaugeDocumentacion({
            ...InitialGaugeOptions,
            series: [{
                ...InitialGaugeOptions.series[0],
                data: [{name: 'Documentación', value: params.value}],
            }]
        })
    }

    const getdata = () => {
        //const echartinstance: EChartsInstance = eChartRef!.getEchartsInstance();
        //console.log(echartinstance.getDataURL());
    }

    const handleBack = () => {
        navigate("/admin/informes");
    }

    const handleCloseToastResponse = () => {
      setOpenToastResponse(false);
    }

    const handleClaseChange = (event: SelectChangeEvent) => {
        setIdClase(event.target.value);
        dispatch(getArchivosByClase('' + event.target.value));
        setHandleChangeSelectArchivo(false)
        setIdArchivo('0');
    }

    const handleArchivoChange = (event: SelectChangeEvent) => {
        setIdArchivo(event.target.value);
    }
  
    return (
        <Box component="main" >
            <Grid container spacing={2} sx={{ mb:  3}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={8} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <Typography variant='h4' color={"text.primary"}>
                        {empresa.razon_social}
                    </Typography>
                </Grid>
                <Grid item xs={4} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                        Regresar
                    </Button>
                </Grid>
            </Grid>
            <Paper sx={{ width: '100%', mb: 2, p:2, backgroundColor: 'background.paper' }} elevation={0}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChangeTab} aria-label="tabs">
                        <Tab label="Inducción" {...a11yProps(0)} />
                        <Tab label="Capacitación" {...a11yProps(1)} />
                        <Tab label="Sistema de gestión SST" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Box sx={{ mt: 3, mb: 0, }} display={'flex'} justifyContent={'space-between'}>
                        {clases.map((clase) => (
                            clase.tipo === TIPO_CLASE.INDUCCION && 
                            <a key={`a_${clase.id}`} style={{marginLeft: 1}} href={`${config.baseUrl}/informe/induccion/${clase.id}`} target="_blank" rel="noreferrer">
                                <Button variant="contained" color="primary" onClick={getdata}>Descargar informe</Button>
                            </a>    
                        ))}
                    </Box>
                    <Grid container spacing={1} sx={{ pt: 3 }}>
                        <Grid item xs={12}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main' }}>
                                    Avance por &aacute;rea
                                </Typography>
                                <ReactECharts option={optionsAvanceAreaInduccion} onEvents={{'click': handleClickBarInduccion}} />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avances {`- ${areaInduccionSelected}`}
                                </Typography>
                                <ReactECharts option={optionsGaugeInduccion} />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main' }}>
                                    Avance Global
                                </Typography>
                                <ReactECharts option={optionsAvanceInduccion}  />
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Grid container 
                        spacing={1} 
                        display={"flex"} 
                        justifyContent={"center"} 
                        alignItems={"center"}
                        sx={{ mt: 3, mb: 2, }}
                    >
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <InputLabel id="select-capacitacion-label">Capacitaci&oacute;n</InputLabel>
                                <Select
                                    required
                                    labelId="select-capacitacion-label"
                                    id="claseCapacitacion"
                                    name="claseCapacitacion"
                                    value={idClase}
                                    label="Capacitación"
                                    onChange={handleClaseChange}
                                    size="medium"
                                >

                                    <MenuItem disabled key={-1} value="">
                                        <em>Seleccione</em>
                                    </MenuItem>
                                                                        
                                    {clases.map((clase) => (
                                        clase.tipo === TIPO_CLASE.CAPACITACION &&
                                        <MenuItem key={'capacitacion-'+clase.id} value={clase.id}>
                                            {clase.titulo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4} display={"flex"} justifyContent={"flex-end"}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={getdata}
                                key={`a_${idClase}`} 
                                href={`${config.baseUrl}/informe/capacitacion/${idClase}`} 
                                target="_blank" 
                                rel="noreferrer"
                                disabled={idClase === ''}
                            >
                                Descargar informe
                            </Button>
                        </Grid>
                    </Grid>
                   
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2 }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avance por &aacute;rea
                                </Typography>
                                <ReactECharts option={optionsAvanceAreaCapacitacion} onEvents={{'click': handleClickBarCapacitacion}} />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2 }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avances {`- ${areaCapacitacionSelected}`}
                                </Typography>
                                <ReactECharts option={optionsGaugeCapacitacion} />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2 }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avance Global
                                </Typography>
                                <ReactECharts option={optionsAvanceCapacitacion}  />
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Grid container 
                        spacing={1} 
                        display={"flex"} 
                        justifyContent={"center"} 
                        alignItems={"center"}
                        sx={{ mt: 3, mb: 2, }}
                    >
                        <Grid item xs={8}>
                            
                        <FormControl fullWidth sx={{ '& .css-14lo706': { paddingLeft: '8px' } }}>
                                <InputLabel  id="select-clase-label">{'Carpeta'}</InputLabel>
                                <Select
                                    required
                                    labelId="select-clase-label"
                                    id="clase"
                                    name="clase"
                                    value={idClase}
                                    label={documentacion.id ? documentacion.titulo : 'Archivo'}
                                    onChange={handleClaseChange}
                                    size="medium"
                                >
                                    <MenuItem disabled key={-1} value="">
                                        <em>Seleccione</em>
                                    </MenuItem>
                                    {clases.map((clase) => (
                                        clase.tipo === TIPO_CLASE.DOCUMENTACION &&
                                        <MenuItem key={'documentacion-'+clase.id} value={clase.id}>
                                            {clase.titulo}
                                        </MenuItem>
                                    ))}
                                </Select>
                                </FormControl>

                            <FormControl fullWidth margin="normal" sx={{ '& .css-14lo706': { paddingLeft: '85px' } }}>
                                <InputLabel  id="select-archivo-label">{'Seleccione un archivo'}</InputLabel>
                                <Select
                                    disabled={handleChangeSelectArchivo}
                                    required
                                    labelId="select-archivo-label"
                                    id="archivo"
                                    name="archivo"
                                    value={idArchivo}
                                    label={documentacion.id ? documentacion.titulo : 'Archivo'}
                                    onChange={handleArchivoChange}
                                    size="medium"
                                >
                                    <MenuItem disabled key={-1} value="">
                                        <em>Seleccione un archivo</em>
                                    </MenuItem>
                                    {archivos.map((archivo) => (
                                        <MenuItem key={'archivo-'+archivo.id} value={archivo.id}>
                                            {archivo.titulo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid item xs={4} display={"flex"} justifyContent={"flex-end"}>
                            <Button 
                                key={`a_${idArchivo}`}
                                variant="contained" 
                                color="primary" 
                                onClick={getdata}
                                href={`${config.baseUrl}/informe/documentacion/${idArchivo}`} 
                                target="_blank" 
                                rel="noreferrer"
                                disabled={(idArchivo === '' || idArchivo == '0')}
                            >
                                Descargar informe
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ pt: 3 }}>
                        <Grid item xs={12}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avance por &aacute;rea
                                </Typography>
                                <ReactECharts 
                                    option={optionsAvanceAreaDocumentacion} 
                                    onEvents={{'click': handleClickBarDocumentacion}}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main' }}>
                                    Avance declaraci&oacute;n jurada
                                </Typography>
                                <ReactECharts option={optionsAvanceDeclaracionJurada}  />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avances {`- ${serieDocumentacionSelected} - ${areaDocumentacionSelected}`}
                                </Typography>
                                <ReactECharts 
                                    ref={(e: any) => setEChartRef(e)} 
                                    option={optionsGaugeDocumentacion} 
                                    opts={{renderer: 'svg'}} />
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
            
            <Snackbar open={openToastResponse} autoHideDuration={6000} onClose={handleCloseToastResponse} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseToastResponse} severity={toastMessageSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}