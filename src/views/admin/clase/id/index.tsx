import React, { ChangeEvent } from "react";
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DownloadIcon from '@mui/icons-material/Download';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ConfirmationDialog from "../../../../ui-component/ConfirmationDialog";
import { RootState, desmatricularTrabajadores, getTrabajadoresMatriculados, useAppDispatch, useAppSelector } from "../../../../store";
import { Archivo, Clase, TIPO_ARCHIVO, TIPO_CLASE, Trabajador, VIDEO_VISTO } from "../../../../interfaces/entities";
import config from "../../../../config";
import { useNavigate, useParams } from "react-router-dom";
import { addArchivo, deleteArchivo, updateArchivo, setArchivos as setArchivos_ } from "../../../../store/slices/archivo";
import { getClaseById } from "../../../../store/slices/clase";
import { useAPIData } from "../../../../api/useAPIData";
import { visuallyHidden } from '@mui/utils';
import {useAuthHeader} from 'react-auth-kit'

import Uppy from '@uppy/core';
import { Dashboard, DashboardModal } from '@uppy/react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import XHRUpload from "@uppy/xhr-upload";
import es_PE from "../../../../util/uppy/es_PE";
import { Checkbox, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Tabs, Toolbar, Tooltip } from "@mui/material";
import moment from "moment";

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

const initialStateArchivo: Archivo = {
    id: 0,
    id_clase: 0,
    titulo: '',
    descripcion: '',
    url: '',
    extension: '',
    tipo: '',
    imagen: `${config.baseUrl}${config.thumbnailPath}/thumbnail_archivo.jpg`,
    visto: VIDEO_VISTO.NO_VISTO
};

const initialStateTrabajador: Trabajador = {
    id: 0,
    id_empresa_cliente: 0,
    nombres: '',
    apellidos: '',
    dni: '',
    area: '',
    puesto: '',
    sede: '',
    fecha_nacimiento: moment().add(-30, 'years').format('YYYY-MM-DD'),
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const enum OPER {NOT_DEFINED, ADD, EDIT};
const enum DELETING {NOT_DEFINED, ARCHIVO, MATRICULA}

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


const uppyVideo = new Uppy({ id: 'uppyVideo', locale: es_PE, autoProceed: false, debug: true, restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ['video/*'],
}})
.use(XHRUpload, { endpoint: `${config.baseUrl}${config.videoPath}`, fieldName: 'video',});

const uppyArchivo = new Uppy({ id: 'uppyArchivo', locale: es_PE, autoProceed: false, debug: true, restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ['.pdf'],
}})
.use(XHRUpload, { endpoint: `${config.baseUrl}${config.archivoPath}`, fieldName: 'file',});

const uppyImage = new Uppy({ id: 'uppyImage', locale: es_PE, autoProceed: false, debug: true, restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ['image/*'],
}})
.use(XHRUpload, { endpoint: `${config.baseUrl}${config.thumbnailPath}`, fieldName: 'image',});


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


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}
  
type Order = 'asc' | 'desc';
  
function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}
  
  // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
  // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
  // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
  // with exampleArray.slice().sort(exampleComparator)
  function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  
  interface HeadCell {
    disablePadding: boolean;
    id: keyof Trabajador;
    label: string;
    numeric: boolean;
  }
  
  const headCells: readonly HeadCell[] = [
    {
      id: 'nombres',
      numeric: false,
      disablePadding: false,
      label: 'Nombre completo',
    },
    {
      id: 'dni',
      numeric: false,
      disablePadding: false,
      label: 'DNI',
    },
    {
      id: 'area',
      numeric: false,
      disablePadding: false,
      label: 'Area',
    },
    {
      id: 'puesto',
      numeric: false,
      disablePadding: false,
      label: 'Puesto',
    },
    {
      id: 'sede',
      numeric: false,
      disablePadding: false,
      label: 'Sede',
    },
    {
      id: 'fecha_nacimiento',
      numeric: false,
      disablePadding: false,
      label: 'F. Nacimiento',
    },
  ];
  
  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Trabajador) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }
  
  function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler =
      (property: keyof Trabajador) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
interface EnhancedTableToolbarProps {
    numSelected: number;
    onClickDesmatricular(event: React.MouseEvent<HTMLElement>): void;
}
  
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, onClickDesmatricular } = props;
  
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                  bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
        {numSelected > 0 ? (
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
                {numSelected} seleccionados
            </Typography>
        ) : (
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Trabajadores
            </Typography>
        )}
        {numSelected > 0 &&
            <Grid container spacing={2}>
                <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                    <Tooltip title="Retirar del curso">
                        <IconButton onClick={onClickDesmatricular}>
                            <LinkOffIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        }
      </Toolbar>
    );
}

export default function AdminClaseIDView() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Trabajador>('nombres');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [loading, setLoading] = React.useState(false);
    const [openDialogArchivo, setOpenDialogArchivo] = React.useState(false);
    const [openDialogConfirmation, setOpenDialogConfirmation] = React.useState(false);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [titleDialogConfirmation, setTitleDialogConfirmation] = React.useState('');
    const [messageDialogConfirmation, setMessageDialogConfirmation] = React.useState('');
    const [currentDeleting, setCurrentDeleting] = React.useState<DELETING>(DELETING.NOT_DEFINED);
    const { clases: clasesReducer} = useAppSelector((state:RootState) => state.clases);
    const [clase, setClase] = React.useState<Clase>(initialStateClase);
    const { archivos: archivosReducer } = useAppSelector((state:RootState) => state.archivos);
    const [archivos, setArchivos] = React.useState<Archivo[]>([]);
    const [archivo, setArchivo] = React.useState<Archivo>(initialStateArchivo);
    const { trabajadores: trabajadoresReducer } = useAppSelector((state:RootState) => state.trabajadores);
    const [trabajadores, setTrabajadores] = React.useState<Trabajador[]>([]);
    const [trabajador, setTrabajador] = React.useState<Trabajador>(initialStateTrabajador);
    const [openMenuArchivo, setOpenMenuArchivo] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currentOper, setCurrentOper] = React.useState<OPER>(OPER.NOT_DEFINED);
    const [openModalVideo, setOpenModalVideo] = React.useState(false);
    const [openModalArchivo, setOpenModalArchivo] = React.useState(false);
    const [openModalImage, setOpenModalImage] = React.useState(false);
    const { id, periodoId, clienteId } = useParams();
    const [value, setValue] = React.useState(0);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authHeader = useAuthHeader();

    React.useEffect(() => {
        uppyVideo.getPlugin('XHRUpload')?.setOptions({
            headers:{
                Authorization: authHeader(),
            },
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                console.log(archivo);
                setArchivo({...archivo, url:`${config.baseUrl}${config.videoPath}/${data.data[0].filename}`})
                return true;
            },
        })
    }, [archivo]);

    React.useEffect(() => {
        uppyArchivo.getPlugin('XHRUpload')?.setOptions({
            headers:{
                Authorization: authHeader(),
            },
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                setArchivo({...archivo, url:`${config.baseUrl}${config.archivoPath}/${data.data[0].filename}`})
                return true;
            },
        })
    }, [archivo]);

    React.useEffect(() => {
        uppyImage.getPlugin('XHRUpload')?.setOptions({
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                let archivos_: Archivo[] = archivos.map((archivo_) => {
                    if (archivo_.id === archivo.id) {
                        dispatch(updateArchivo({...archivo_, imagen: `${config.baseUrl}${config.thumbnailPath}/${data.data[0].filename}`}));
                        return {...archivo_, imagen: `${config.baseUrl}${config.thumbnailPath}/${data.data[0].filename}`};
                    }
                    return archivo_;
                });
                setArchivos(archivos_);
                setArchivo({...archivo, imagen: `${config.baseUrl}${config.thumbnailPath}/${data.data[0].filename}`});
                return true;
            },
        })
    }, [archivo]);
  

    React.useEffect(() => {
        dispatch(getClaseById(id || '0'));
        dispatch(getTrabajadoresMatriculados(id || '0'));
    }, []);

    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setLoading(false);
            setClase(data[0] || initialStateClase);
            setArchivos(data[0]?.archivos || []);
            dispatch(setArchivos_(data[0]?.archivos || []));
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

    useAPIData(archivosReducer, React.useMemo(() => ({
        onFulfilled: (data: Archivo[]) => {
            setLoading(false);
            setArchivos(data);
            setCurrentOper(OPER.NOT_DEFINED);
            setCurrentDeleting(DELETING.NOT_DEFINED);
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
    }), [archivosReducer]));

    useAPIData(trabajadoresReducer, React.useMemo(() => ({
        onFulfilled: (data: Trabajador[]) => {
            setLoading(false);
            setTrabajadores(data);
            setSelected([]);
        },
        onRejected: (error) => {
            setToastMessageSeverity('error');
            setToastMessage(`${error.status}: ${error.statusText}`);
            setOpenToastResponse(true);
        },
        onPending: () => {
            setLoading(true);
        }
    }), [trabajadoresReducer]));

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleCloseToastResponse = () => {
        setOpenToastResponse(false);
    }

    const handleBack = () => {
        navigate(`/admin/clientes/${clienteId}/periodos/${periodoId}`, {replace: false});
    }

    const handleEditArchivo = (event: React.MouseEvent<HTMLElement>, archivo: Archivo) => {
        setCurrentOper(OPER.EDIT);
        setArchivo({...archivo});
        setOpenDialogArchivo(true);
    }

    const handleLoadFile = (event: React.MouseEvent<HTMLElement>, archivo: Archivo) => {
        setArchivo(archivo);
        setOpenModalArchivo(true);
    }

    const handleLoadVideo = (event: React.MouseEvent<HTMLElement>, archivo: Archivo) => {
        setClase(clase);
        setOpenModalVideo(true);
    }

    const handleLoadImage = (event: React.MouseEvent<HTMLElement>, archivo: Archivo) => {
        setArchivo(archivo);
        setOpenModalImage(true);
    }
    
    const handleSubmitArchivo = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOpenDialogArchivo(false);

        if(currentOper === OPER.ADD) {
            dispatch(addArchivo(archivo));
        }
        else if(currentOper === OPER.EDIT) {
            dispatch(updateArchivo(archivo));
        }
    }

    const onArchivoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setArchivo({ ...archivo, [e.target.name]: e.target.value });
    }

    const handleOpenDialogConfirmation = (event: React.MouseEvent<HTMLElement>, archivo: Archivo, tag: DELETING) => {
        setTitleDialogConfirmation('Eliminar');
        setCurrentDeleting(tag);
        
        if(tag === DELETING.ARCHIVO) {
            setMessageDialogConfirmation(`¿Está seguro que desea eliminar el archivo "${archivo.titulo}"?`);
            setArchivo({...archivo});
        }
        else if(tag === DELETING.MATRICULA) {
            setMessageDialogConfirmation(`¿Está seguro que desea retirar a los trabajadadores seleccionados de la clase "${clase.titulo}"?`);
        }
        setOpenDialogConfirmation(true);
    }

    const handleCloseDialogConfirmation = (accepted: boolean) => {
        setTitleDialogConfirmation('');
        setMessageDialogConfirmation('');
        setOpenDialogConfirmation(false);
        
        if(!accepted) return;
        
        if(currentDeleting === DELETING.ARCHIVO) {
            dispatch(deleteArchivo(`${archivo.id}` || '0'));
        }
        else if(currentDeleting === DELETING.MATRICULA) {
            dispatch(desmatricularTrabajadores({id_clase: clase.id, ids_trabajadores: selected.map(el => el)}));
        }
    }

    //TODO: Terminar la funcionalidad
    const handleOpenDialogArchivo = (tipo: TIPO_ARCHIVO) => {
        setCurrentOper(OPER.ADD);
        setArchivo({ 
            ...initialStateArchivo,
            id_clase: parseInt(id || '0'),
            tipo: tipo,
        });
        handleCloseMenuArchivo();
        setOpenDialogArchivo(true);
    }

    const handleCloseDialogArchivo = () => {
        setOpenDialogArchivo(false);
        handleCloseMenuArchivo();
        uppyArchivo.cancelAll();
        uppyVideo.cancelAll();
        setArchivo(initialStateArchivo);
    }

    const handleCloseDialogImage = () => {
        setOpenModalImage(false);
        uppyImage.cancelAll();
    }

    const handleOpenMenuArchivo = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenMenuArchivo(true);
    };

    const handleCloseMenuArchivo = () => {
        setAnchorEl(null);
        setOpenMenuArchivo(false);
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Trabajador,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
  
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = trabajadores.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
  
    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];
  
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } 
        else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } 
        else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } 
        else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
            );
        }
  
        setSelected(newSelected);
    };
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
  
    const isSelected = (id: number) => selected.indexOf(id) !== -1;
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - trabajadores.length) : 0;
  
    const visibleRows = React.useMemo(
      () =>
        stableSort(trabajadores, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage, trabajadores],
    );

    return !clase || clase?.id === 0 ? (
        <Box>
            <Grid container justifyContent="center">
                <Grid item xs={12}>
                    <IconButton onClick={handleBack} >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>
                        No existe información para esta clase
                    </Typography>
                </Grid>
            </Grid>
            
        </Box>
    )
    : (
        <Box sx={{ width: '100%' }}>
            { loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}

            <div>
                <DashboardModal
                    uppy={uppyImage}
                    open={openModalImage}
                    onRequestClose={() => handleCloseDialogImage()}
                />
            </div>

            <Dialog open={openDialogArchivo} onClose={handleCloseDialogArchivo}>
                <Box component="form" onSubmit={handleSubmitArchivo}>
                <DialogTitle>{archivo.tipo === TIPO_ARCHIVO.VIDEO ? 'Video' : 'Documento'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                autoFocus
                                id="titulo"
                                name="titulo"
                                label="Título"
                                type="text"
                                fullWidth
                                value={archivo.titulo}
                                onChange={onArchivoChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="descripcion"
                                name="descripcion"
                                label="Descripción"
                                multiline
                                fullWidth
                                value={archivo.descripcion}
                                onChange={onArchivoChange}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{mt: 1}}>
                            <Dashboard uppy={archivo.tipo === TIPO_ARCHIVO.VIDEO ? uppyVideo : uppyArchivo}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogArchivo}>Cancelar</Button>
                    <Button type="submit" variant="contained">Guardar</Button>
                </DialogActions>
                </Box>
            </Dialog>

            <Grid container spacing={2} sx={{ mb:  3}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={10} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <Typography variant='h4' color={"text.primary"}>
                        {clase.titulo}
                    </Typography>
                </Grid>
                <Grid item xs={2} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <IconButton onClick={handleBack} >
                        <ArrowBackIcon />
                    </IconButton>
                    <Button
                        id="demo-customized-button"
                        aria-controls={openMenuArchivo ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenuArchivo ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleOpenMenuArchivo}
                        endIcon={<KeyboardArrowDownIcon />}
                    >
                        Agregar
                    </Button>
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        open={openMenuArchivo}
                        onClose={handleCloseMenuArchivo}
                    >
                        {clase.tipo !== TIPO_CLASE.DOCUMENTACION && (<MenuItem onClick={() => handleOpenDialogArchivo(TIPO_ARCHIVO.VIDEO)} disableRipple>
                            <VideoFileIcon />
                            Video
                        </MenuItem>)}
                        <MenuItem onClick={() => handleOpenDialogArchivo(TIPO_ARCHIVO.DOCUMENTO)} disableRipple>
                            <PictureAsPdfIcon />
                            Documento
                        </MenuItem>
                    </StyledMenu>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h5' color={"text.secondary"}>
                        {clase.descripcion}
                    </Typography>
                </Grid>
                {archivos && archivos.length > 0 && (
                <Paper sx={{ width: '100%', mt:3, mb: 2, p:2 }} elevation={3}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Archivos" {...a11yProps(0)} />
                            <Tab label="Matriculados" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Grid container spacing={2} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                            {archivos.filter(archivo => archivo.tipo === TIPO_ARCHIVO.VIDEO).length > 0 && (
                            <Grid item xs={12} sx={{mt: 2}}>
                                <Divider textAlign="left">
                                    <Chip 
                                        icon={<VideoFileIcon />}
                                        label="Videos" 
                                        variant="filled" 
                                        color="primary"
                                        size="medium" />
                                </Divider>
                            </Grid>)}
                            {archivos.filter(archivo => archivo.tipo === TIPO_ARCHIVO.VIDEO).length > 0 && (
                            <Grid container spacing={2} 
                                sx={{m: 2, p: 2, backgroundColor: "#E7EBF0", borderRadius: 1}} 
                                direction={"row"} justifyContent={"flex-start"} alignContent={"center"} alignItems={"flex-start"}>
                                {archivos.filter((archivo) => archivo.tipo === TIPO_ARCHIVO.VIDEO).map((archivo) => {
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
                                                    <IconButton onClick={event => handleEditArchivo(event, archivo)} >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={event => handleLoadImage(event, archivo)} >
                                                        <AddPhotoAlternateIcon />
                                                    </IconButton>
                                                    <IconButton onClick={event => handleOpenDialogConfirmation(event, archivo, DELETING.ARCHIVO)} >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>)}
                            {archivos.filter(archivo => archivo.tipo === TIPO_ARCHIVO.DOCUMENTO).length > 0 && (
                            <Grid item xs={12} sx={{mt: 2}}>
                                <Divider textAlign="left">
                                    <Chip 
                                        icon={<PictureAsPdfIcon />}
                                        label="Documentos" 
                                        variant="filled" 
                                        color="primary"
                                        size="medium" />
                                </Divider>
                            </Grid>
                            )}
                            {archivos.filter(archivo => archivo.tipo === TIPO_ARCHIVO.DOCUMENTO).length > 0 && (
                            <Grid container spacing={2} 
                                sx={{m: 2, p: 2, backgroundColor: "#E7EBF0", borderRadius: 1}} 
                                direction={"row"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                {archivos.filter((archivo) => archivo.tipo === TIPO_ARCHIVO.DOCUMENTO).map((archivo) => {
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
                                                    <IconButton onClick={event => handleEditArchivo(event, archivo)} >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={event => handleLoadImage(event, archivo)}  >
                                                        <AddPhotoAlternateIcon />
                                                    </IconButton>
                                                    <IconButton onClick={event => handleOpenDialogConfirmation(event, archivo, DELETING.ARCHIVO)} >
                                                        <DeleteIcon />
                                                    </IconButton>
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
                            )}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        
                        <EnhancedTableToolbar 
                            numSelected={selected.length}
                            onClickDesmatricular={(event) => handleOpenDialogConfirmation(event, initialStateArchivo, DELETING.MATRICULA)}
                        />
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size='medium'
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={trabajadores.length}
                                />
                                <TableBody>
                                    {visibleRows.map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell padding="checkbox">
                                                  <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                      'aria-labelledby': labelId,
                                                    }}
                                                  />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {`${row.nombres} ${row.apellidos}`}
                                            </TableCell>
                                            <TableCell>{row.dni}</TableCell>
                                            <TableCell>{row.area}</TableCell>
                                            <TableCell>{row.puesto}</TableCell>
                                            <TableCell>{row.sede}</TableCell>
                                            <TableCell>{row.fecha_nacimiento}</TableCell>
                                        </TableRow>
                                    );
                                    })}
                                    {emptyRows > 0 && (
                                      <TableRow style={{height: 53 * emptyRows,}}>
                                            <TableCell colSpan={7} />
                                      </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={trabajadores.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TabPanel>
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
    )
}