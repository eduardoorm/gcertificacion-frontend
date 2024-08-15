import React from "react";
import ReactECharts from 'echarts-for-react';
import { Box, Button, Grid, Paper, Tab, Tabs, Typography } from "@mui/material";
import { RootState, useAppDispatch, useAppSelector } from "../../../store";
import { useAPIData } from "../../../api/useAPIData";
import { useParams } from "react-router-dom";
import { CapacitacionSerie, DocumentacionSerie, InduccionSerie, ItemSerie } from "../../../interfaces/report/series";
import { getCapacitacionSerie } from "../../../store";
import { getInduccionSerie } from "../../../store/slices/reporte/induccion";
import { getDocumentacionSerie } from "../../../store/slices/reporte/documentacion";
import { InitialBarOptions, InitialBarSerie, InitialGaugeOptions, InitialPieOptions } from "../../../interfaces/report";

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
            <Box sx={{ p: 3 }}>
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


export default function ViewEmpresaDefault(){
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
    const [value, setValue] = React.useState(0);
    const dispatch = useAppDispatch();
    const { id } = useParams();
    
    React.useEffect(() => {
        dispatch(getInduccionSerie(id || '0'));
        dispatch(getCapacitacionSerie(id || '0'));
        dispatch(getDocumentacionSerie(id || '0'));
    }, []);

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
            }); 

            setOptionsGaugeDocumentacion({
                ...InitialGaugeOptions,
                series: [{
                    ...InitialGaugeOptions.series[0],
                    data: [{name: 'Documentación', value: data[0].avanceCapacitacion[0].value}],
                }]
            });
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
            seriesBar.push({...InitialBarSerie, name: 'Descargas', data: data[0].avanceAreasDescarga.map(item => item.value)});
            seriesBar.push({...InitialBarSerie, name: 'Declaración Jurada', data: data[0].avanceAreasDeclaracionJurada.map(item => item.value)});

            setOptionsAvanceDescargaDocumentacion({
                ...InitialPieOptions,
                series: [{...InitialPieOptions.series[0], data: data[0].avanceDescarga}],
            });
            setOptionsAvanceDeclaracionJurada({
                ...InitialPieOptions,
                series: [{...InitialPieOptions.series[0], data: data[0].avanceDeclaracionJurada}],
            });
            
            setOptionsAvanceAreaDocumentacion({
                ...InitialBarOptions,
                xAxis: {
                    ...InitialBarOptions.xAxis,
                    data: data[0].avanceAreasDescarga.map(item => item.name)
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

    return (
        <Box component="main" >
            <Paper sx={{ width: '100%', mb: 2, p:2, backgroundColor: 'background.paper' }} elevation={0}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChangeTab} aria-label="tabs">
                        <Tab label="Inducción" {...a11yProps(0)} />
                        <Tab label="Capacitación" {...a11yProps(1)} />
                        <Tab label="Documentación" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Grid container spacing={1}>
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
                                    Avance global
                                </Typography>
                                <ReactECharts option={optionsAvanceInduccion}  />
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
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
                                    Avance global
                                </Typography>
                                <ReactECharts option={optionsAvanceCapacitacion}  />
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avance descargas
                                </Typography>
                                <ReactECharts option={optionsAvanceDescargaDocumentacion} />
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avance declaraci&oacute;n jurada
                                </Typography>
                                <ReactECharts option={optionsAvanceDeclaracionJurada}  />
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
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
                        <Grid item xs={4}>
                            <Paper elevation={6} sx={{ p: 2, borderRadius: 2, }} >
                                <Typography variant='h6' sx={{ color: 'primary.main'}}>
                                    Avances {`- ${serieDocumentacionSelected} - ${areaDocumentacionSelected}`}
                                </Typography>
                                <ReactECharts
                                    option={optionsGaugeDocumentacion} 
                                    opts={{renderer: 'svg'}} />
                            </Paper>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>
        </Box>
    );
}