import React, { ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/*Material UI*/
import { styled, alpha } from '@mui/material/styles';
import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Menu, { MenuProps } from '@mui/material/Menu';
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ConstructionIcon from '@mui/icons-material/Construction';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { DatePicker } from "@mui/x-date-pickers";
import ConfirmationDialog from "../../../../ui-component/ConfirmationDialog";
/*Material UI*/

import { useAPIData } from "../../../../api/useAPIData";
import { RootState, getPeriodoById, selectPeriodoById, useAppDispatch, useAppSelector } from "../../../../store";
import { Clase, Periodo, TIPO_CLASE } from "../../../../interfaces/entities";
import { addClase, deleteClase, getClases, initializeStateClases, updateClase } from "../../../../store/slices/clase";
import config from "../../../../config";
import moment from "moment";

import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import XHRUpload from "@uppy/xhr-upload";
import es_PE from "../../../../util/uppy/es_PE";

const uppyImage = new Uppy({ id: 'uppyImage', locale: es_PE, autoProceed: false, debug: true, restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['image/png'],
    }})
    .use(XHRUpload, { endpoint: `${config.baseUrl}${config.thumbnailPath}`, fieldName: 'image',});


const initialStatePeriodo: Periodo = {
    id: 0,
    id_empresa_cliente: 0,
    codigo: '',
    descripcion: '',
    fecha_inicio: moment().format('YYYY-MM-DD'),
    fecha_fin: moment().add(3, 'months').format('YYYY-MM-DD'),
    activo: 1
}

const initialStateClase: Clase = {
    id: 0,
    id_periodo: 0,
    titulo: '',
    descripcion: '',
    tipo: TIPO_CLASE.INDUCCION,
    fecha_inicio: moment().format('YYYY-MM-DD'),
    fecha_fin: moment().add(3, 'months').format('YYYY-MM-DD'),
    imagen: `${config.baseUrl}${config.thumbnailPath}/thumbnail.png`,
}

const enum OPER {NOT_DEFINED, ADD, EDIT};

const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

export default function AdminPeriodoIDView() {

    const [loading, setLoading] = React.useState(false);
    const [openDialogClase, setOpenDialogClase] = React.useState(false);
    const [openDialogConfirmation, setOpenDialogConfirmation] = React.useState(false);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [titleDialogConfirmation, setTitleDialogConfirmation] = React.useState('');
    const [messageDialogConfirmation, setMessageDialogConfirmation] = React.useState('');
    const { periodos: periodosReducer } = useAppSelector((state:RootState) => state.periodos);
    const { clases: clasesReducer} = useAppSelector((state:RootState) => state.clases);
    const [clases, setClases] = React.useState<Clase[]>([]);
    const [clase, setClase] = React.useState<Clase>(initialStateClase);
    const [openMenuClase, setOpenMenuClase] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currentOper, setCurrentOper] = React.useState<OPER>(OPER.NOT_DEFINED);
    const [openModalImage, setOpenModalImage] = React.useState(false);
    const { id, clienteId } = useParams();
    const [periodo, setPeriodo] = React.useState<Periodo>(useAppSelector((state:RootState) => selectPeriodoById(state, parseInt(id || '0'))));
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    React.useEffect(() => {
        uppyImage.getPlugin('XHRUpload')?.setOptions({
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                clases.map((clase_) => {
                    if (clase_.id === clase.id) {
                        dispatch(updateClase({...clase_, imagen: `${config.baseUrl}${config.thumbnailPath}/${data.data[0].filename}`}));
                        return {...clase_, imagen: `${config.baseUrl}${config.thumbnailPath}/${data.data[0].filename}`};
                    }
                })
                setClase({...clase, imagen: `${config.baseUrl}${config.thumbnailPath}/${data.data[0].filename}`});
                return true;
            },
        })
    }, [clase]);

    React.useEffect(() => {
        dispatch(getPeriodoById(id || '0'));
    }, []);

    useAPIData(periodosReducer, React.useMemo(() => ({
        onFulfilled: (data: Periodo[]) => {
            //console.log(data);
            setLoading(false);
            setPeriodo(data[0] || initialStatePeriodo)
            setClases(data[0]?.clases || []);
            dispatch(initializeStateClases(data[0]?.clases || []));
        },
        onRejected: (error) => {
            setLoading(false);
            setToastMessageSeverity('error');
            setToastMessage(`${error.status}: ${error.statusText}`);
            setOpenToastResponse(true);
        },
        onPending: () => {
            setLoading(true);
        }
    }), [periodosReducer]));

    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setLoading(false);
            setClases(data);
        },
        onRejected: (error) => {
            setLoading(false);
            setToastMessageSeverity('error');
            setToastMessage(`${error.status}: ${error.statusText}`);
            setOpenToastResponse(true);
        },
        onPending: () => {
            setLoading(true);
        }
    }), [clasesReducer]));


    const handleCloseToastResponse = () => {
        setOpenToastResponse(false);
    }

    const handleBack = () => {
        //navigate(`/admin/clientes/${clienteId}`);
        navigate(`/admin/clientes/${clienteId}`, {state: {prevUrl: location.pathname}});
    }

    const handleEditClase = (event: React.MouseEvent<HTMLElement>, clase: Clase) => {
        setCurrentOper(OPER.EDIT);
        setClase({...clase});
        setOpenDialogClase(true);
    }

    const handleLoadImage = (event: React.MouseEvent<HTMLElement>, clase: Clase) => {
        setClase(clase);
        setOpenModalImage(true);
    }

    const handleOpenDialogConfirmation = (event: React.MouseEvent<HTMLElement>, clase: Clase) => {
        setClase({...clase});
        setTitleDialogConfirmation('Eliminar');
        setMessageDialogConfirmation(`¿Está seguro que desea eliminar la clase "${clase.titulo}"?`);
        setOpenDialogConfirmation(true);
    }

    const handleCloseDialogConfirmation = (accepted: boolean) => {
        setTitleDialogConfirmation('');
        setMessageDialogConfirmation('');
        setOpenDialogConfirmation(false);
        accepted && dispatch(deleteClase(`${clase.id}` || '0'));
    }

    const handleSubmitClase = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOpenDialogClase(false);

        if(currentOper === OPER.ADD) {
            dispatch(addClase({...clase}));
        }
        else if(currentOper === OPER.EDIT) {
            dispatch(updateClase({...clase}));
        }
    }

    const onClaseChange = (e: ChangeEvent<HTMLInputElement>) => {
        setClase({ ...clase, [e.target.name]: e.target.value });
    }

    const handleOpenDialogClase = (tipo: TIPO_CLASE) => {
        setCurrentOper(OPER.ADD);
        setClase({ 
            ...initialStateClase,
            id_periodo: parseInt(id || '0'),
            tipo: tipo
        });
        handleCloseMenuClase();
        setOpenDialogClase(true);
    }

    const handleCloseDialogClase = () => {
        setOpenDialogClase(false);
        handleCloseMenuClase();
    }

    const handleOpenMenuClase = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenMenuClase(true);
    };

    const handleCloseMenuClase = () => {
        setAnchorEl(null);
        setOpenMenuClase(false);
    };

    const handleClick = (event: React.MouseEvent<unknown>, clase: Clase) => {
        navigate(`/admin/clientes/${clienteId}/periodos/${id}/clases/${clase.id}`, {replace: false});
    };


    return (
        <Box sx={{ width: '100%' }}>
            { loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}

            <div>
                <DashboardModal
                    uppy={uppyImage}
                    open={openModalImage}
                    onRequestClose={() => setOpenModalImage(false)}
                />
            </div>

            {/* FORMULARIO CLASE */}
            <Dialog open={openDialogClase} onClose={handleCloseDialogClase}>
                <Box component="form" onSubmit={handleSubmitClase}>
                <DialogTitle>Clase</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                autoFocus
                                id="titulo"
                                name="titulo"
                                label="Título"
                                type="text"
                                fullWidth
                                value={clase.titulo}
                                onChange={onClaseChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="descripcion"
                                name="descripcion"
                                label="Descripción"
                                multiline
                                fullWidth
                                value={clase.descripcion}
                                onChange={onClaseChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker 
                                label="Inicio" 
                                format="DD/MM/YYYY" 
                                defaultValue={moment(clase.fecha_inicio)}
                                onChange={f => setClase({...clase, fecha_inicio: f?.format('YYYY-MM-DD') || ''})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker 
                                label="Fin" 
                                format="DD/MM/YYYY" 
                                defaultValue={moment(clase.fecha_fin)}
                                onChange={f => setClase({...clase, fecha_fin: f?.format('YYYY-MM-DD') || ''})} 
                            />
                        </Grid> 
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogClase}>Cancelar</Button>
                    <Button type="submit" variant="contained">Guardar</Button>
                </DialogActions>
                </Box>
            </Dialog>
            {/*TITLE Y BOTÓN CREAR */}
            <Grid container spacing={2} sx={{ mb:  3}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={10} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <Typography variant='h4' color={"text.primary"}>
                        {periodo.codigo}
                    </Typography>
                </Grid>
                <Grid item xs={2} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <IconButton onClick={handleBack} >
                        <ArrowBackIcon />
                    </IconButton>
                    <Button
                        id="demo-customized-button"
                        aria-controls={openMenuClase ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenuClase ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleOpenMenuClase}
                        endIcon={<KeyboardArrowDownIcon />}
                    >
                        Crear
                    </Button>     
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        open={openMenuClase}
                        onClose={handleCloseMenuClase}
                    >
                        <MenuItem onClick={() => handleOpenDialogClase(TIPO_CLASE.INDUCCION)} disableRipple>
                            <MenuBookIcon />
                            Inducci&oacute;n
                        </MenuItem>
                        <MenuItem onClick={() => handleOpenDialogClase(TIPO_CLASE.CAPACITACION)} disableRipple>
                            <ConstructionIcon />
                            Capacitaci&oacute;n
                        </MenuItem>
                        <MenuItem onClick={() => handleOpenDialogClase(TIPO_CLASE.DOCUMENTACION)} disableRipple>
                            <PictureAsPdfIcon />
                            Sistema de gesti&oacute;n SST
                        </MenuItem>
                    </StyledMenu>
                    
                </Grid>

                <Grid item xs={12}>
                    <Typography variant='h5' color={"text.secondary"}>
                        {periodo.descripcion}
                    </Typography>
                </Grid>
                
                {clases && clases.length > 0 && (
                <Paper sx={{ width: '100%', mt:3, mb: 2, p:2 }} elevation={3}>
                    <Grid container spacing={2} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        {clases && clases.filter(clase => clase.tipo === TIPO_CLASE.INDUCCION).length > 0 && (
                        <Grid item xs={12} sx={{mt: 2}}>
                            <Divider textAlign="left">
                                <Chip 
                                    icon={<MenuBookIcon />}
                                    label="Inducción" 
                                    variant="filled" 
                                    color="primary"
                                    size="medium" />
                            </Divider>
                        </Grid>
                        )}
                        {clases && clases.filter(clase => clase.tipo === TIPO_CLASE.INDUCCION).length > 0 && (
                        <Grid container spacing={2} 
                            sx={{m: 2, pb: 2, backgroundColor: "#E7EBF0", borderRadius: 1}} 
                            direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                            {clases.filter((clase) => clase.tipo === TIPO_CLASE.INDUCCION).map((clase) => {
                                return(
                                    <Grid item xs={6} key={clase.id}>
                                        <Card sx={{ display: 'flex' }}>
                                            <CardActionArea onClick={event => handleClick(event, clase)}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="194"
                                                        sx={{ objectFit: 'cover', maxWidth: '256px' }}
                                                        image={clase.imagen}
                                                    />
                                                    <CardContent >
                                                        <Typography component="div" variant="h5">
                                                            {clase.titulo}
                                                        </Typography>
                                                        <Typography variant="subtitle2" color="text.secondary" component="div">
                                                            {clase.descripcion}
                                                        </Typography>
                                                    </CardContent>
                                                </Box>
                                            </CardActionArea>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, pt: 1, flexDirection: 'column' }}>
                                                <IconButton onClick={event => handleEditClase(event, clase)} >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={event => handleLoadImage(event, clase)} >
                                                    <AddPhotoAlternateIcon />
                                                </IconButton>
                                                <IconButton onClick={event => handleOpenDialogConfirmation(event, clase)} >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        )}
                        {clases && clases.filter(clase => clase.tipo === TIPO_CLASE.CAPACITACION).length > 0 && (
                        <Grid item xs={12} sx={{mt: 2}}>
                            <Divider textAlign="left">
                                <Chip 
                                    icon={<ConstructionIcon />}
                                    label="Capacitación" 
                                    variant="filled" 
                                    color="primary"
                                    size="medium" />
                            </Divider>
                        </Grid>
                        )}
                        {clases && clases.filter(clase => clase.tipo === TIPO_CLASE.CAPACITACION).length > 0 && (
                        <Grid container spacing={2} 
                            sx={{m: 2, pb: 2, backgroundColor: "#E7EBF0", borderRadius: 1}} 
                            direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                            {clases.filter((clase) => clase.tipo === TIPO_CLASE.CAPACITACION).map((clase) => {
                                return(
                                    <Grid item xs={6} key={clase.id}>
                                        <Card sx={{ display: 'flex' }}>
                                            <CardActionArea onClick={event => handleClick(event, clase)}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="194"
                                                        sx={{ objectFit: 'cover', maxWidth: '256px' }}
                                                        image={clase.imagen}
                                                    />
                                                    <CardContent >
                                                        <Typography component="div" variant="h5">
                                                            {clase.titulo}
                                                        </Typography>
                                                        <Typography variant="subtitle2" color="text.secondary" component="div">
                                                            {clase.descripcion}
                                                        </Typography>
                                                    </CardContent>
                                                </Box>
                                            </CardActionArea>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, pt: 1, flexDirection: 'column' }}>
                                                <IconButton onClick={event => handleEditClase(event, clase)} >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={event => handleLoadImage(event, clase)} >
                                                    <AddPhotoAlternateIcon />
                                                </IconButton>
                                                <IconButton onClick={event => handleOpenDialogConfirmation(event, clase)} >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        )}
                        {clases && clases.filter(clase => clase.tipo === TIPO_CLASE.DOCUMENTACION).length > 0 && (
                        <Grid item xs={12} sx={{mt: 2}}>
                            <Divider textAlign="left">
                                <Chip 
                                    icon={<PictureAsPdfIcon />}
                                    label="Sistema de gestión SST" 
                                    variant="filled" 
                                    color="primary"
                                    size="medium" />
                            </Divider>
                        </Grid>
                        )}
                        {clases && clases.filter(clase => clase.tipo === TIPO_CLASE.DOCUMENTACION).length > 0 && (
                        <Grid container spacing={2} 
                            sx={{m: 2, pb: 2, backgroundColor: "#E7EBF0", borderRadius: 1}} 
                            direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"} >
                            {clases.filter((clase) => clase.tipo === TIPO_CLASE.DOCUMENTACION).map((clase) => {
                                return (
                                    <Grid item xs={6} key={clase.id}>
                                        <Card sx={{ display: 'flex' }}>
                                            <CardActionArea onClick={event => handleClick(event, clase)}>
                                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="194"
                                                        sx={{ objectFit: 'cover', maxWidth: '256px' }}
                                                        image={clase.imagen}
                                                    />
                                                    <CardContent >
                                                        <Typography component="div" variant="h5">
                                                            {clase.titulo}
                                                        </Typography>
                                                        <Typography variant="subtitle2" color="text.secondary" component="div">
                                                            {clase.descripcion}
                                                        </Typography>
                                                    </CardContent>
                                                </Box>
                                            </CardActionArea>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pr: 1, pt: 1, flexDirection: 'column' }}>
                                                <IconButton onClick={event => handleEditClase(event, clase)} >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={event => handleLoadImage(event, clase)} >
                                                    <AddPhotoAlternateIcon />
                                                </IconButton>
                                                <IconButton onClick={event => handleOpenDialogConfirmation(event, clase)} >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                        )}
                    </Grid>
                </Paper>
                )}
            </Grid>
                        
            <ConfirmationDialog open={openDialogConfirmation} onClose={handleCloseDialogConfirmation} title={titleDialogConfirmation} message={messageDialogConfirmation} />

            <Snackbar open={openToastResponse} autoHideDuration={6000} onClose={handleCloseToastResponse}>
                <Alert onClose={handleCloseToastResponse} severity={toastMessageSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}