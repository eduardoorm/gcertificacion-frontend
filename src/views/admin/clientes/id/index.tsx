import React, { ChangeEvent } from "react";
import { Alert } from "@mui/material"; 
import {Checkbox } from "@mui/material"; 
import { Chip } from "@mui/material"; 
import { FormControl } from "@mui/material"; 
import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { Table } from "@mui/material";
import { TableBody } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableContainer } from "@mui/material";
import { TableHead } from "@mui/material";
import { TablePagination } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableSortLabel } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Tooltip } from "@mui/material";
import { styled, alpha } from '@mui/material/styles'; 
import { AlertColor } from "@mui/material"; 
import { Box } from "@mui/material"; 
import { Button } from "@mui/material"; 
import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material"; 
import { DialogContent } from "@mui/material"; 
import { DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material"; 
import { LinearProgress } from "@mui/material"; 
import { Paper } from "@mui/material"; 
import { Snackbar } from "@mui/material"; 
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import Menu, { MenuProps } from '@mui/material/Menu';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BlockIcon from "@mui/icons-material/Block";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import ConfirmationDialog from "../../../../ui-component/ConfirmationDialog";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { Clase, EmpresaCliente, EmpresaClienteInitialState, Periodo, TIPO_CLASE, Trabajador } from "../../../../interfaces/entities";
import { deleteEmpresa, getEmpresaById, selectEmpresaClienteById, updateEmpresa } from "../../../../store/slices/empesaCliente";
import { useAPIData } from "../../../../api/useAPIData";
import { RootState, deleteTrabajadores } from "../../../../store"; 
import { addPeriodo } from "../../../../store"; 
import { deletePeriodo } from "../../../../store";
import { updatePeriodo } from "../../../../store"; 
import { matricularTrabajadores } from "../../../../store";
import { setTrabajadores as _setTrabajadores } from "../../../../store"; 
import { setPeriodos as _setPeriodos } from "../../../../store";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { visuallyHidden } from '@mui/utils';
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import XHRUpload from "@uppy/xhr-upload";
import es_PE from "../../../../util/uppy/es_PE";
import config from "../../../../config";
import {useAuthHeader} from 'react-auth-kit'


const initialStatePeriodo: Periodo = {
    id: 0,
    id_empresa_cliente: 0,
    codigo: '',
    descripcion: '',
    fecha_inicio: moment().format('YYYY-MM-DD'),
    fecha_fin: moment().add(3, 'months').format('YYYY-MM-DD'),
    activo: 1
}

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
  
const enum OPER_PERIODO {NOT_DEFINED, ADD, EDIT};
const enum DELETING {NOT_DEFINED, EMPRESA, PERIODO, TRABAJADOR};

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

const uppyExcel = new Uppy({ id: 'uppyExcel', locale: es_PE, autoProceed: false, debug: true, restrictions: {
    maxNumberOfFiles: 3,
    allowedFileTypes: ['.xls', '.xlsx'],
}})
.use(XHRUpload, { 
    endpoint: `${config.baseUrl}${config.excelTrabajadorPath}`, fieldName: 'file',
    headers: {
        authorization: `${JSON.parse(localStorage.getItem("token") || '{token: "", tokenType: ""}').tokenType} ${JSON.parse(localStorage.getItem("token") || '{token: "", tokenType: ""}').token}`
    }}
);

const uppyImage = new Uppy({ id: 'uppyImage', locale: es_PE, autoProceed: false, debug: true, restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ['image/*'],
}})
.use(XHRUpload, { endpoint: `${config.baseUrl}${config.logoPath}`, fieldName: 'logo',});


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
            <Box sx={{ p: 2 }}>
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
      label: 'Nombres',
    },
    {
      id: 'apellidos',
      numeric: false,
      disablePadding: false,
      label: 'Apellidos',
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
    trabajadores: Trabajador[];
    setTrabajadores: (data: Trabajador[]) => void;
}
  
  function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, trabajadores, setTrabajadores } = props;
    const createSortHandler =
      (property: keyof Trabajador) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };
    
    const filter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTrabajadores(trabajadores.filter(t => {
            let fields = Object.keys(t);
            fields = fields.filter(field => document.getElementById(`t_${field}`) !== null && (document.getElementById(`t_${field}`) as HTMLInputElement).value !== '');
            let res = true;
            for(let field of fields){
                let value = (document.getElementById(`t_${field}`) as HTMLInputElement).value;
                res = res && t[field as keyof Trabajador].toString().toLowerCase().indexOf(value.toLowerCase()) !== -1;
            }
            return res;
        }));
    };
  
    return (
        <TableHead>
            <TableRow>
                <TableCell></TableCell>
                {headCells.map(headCell => (
                    
                    headCell.id !== 'fecha_nacimiento' 
                    ? <TableCell
                        key={`h_${headCell.id}`}
                        sx={{p: 1}}
                    >
                        <TextField id={`t_${headCell.id}`} variant="outlined" onChange={filter}/>
                    </TableCell>
                    : <TableCell
                        key={`c_${headCell.id}`}
                    >
                    </TableCell>
                ))}
            </TableRow>
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
    onClickDelete(event: React.MouseEvent<HTMLElement>): void;
    onClickMatricular(event: React.MouseEvent<HTMLElement>): void;
    onClickUpload(event: React.MouseEvent<HTMLElement>): void;
}
  
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, onClickMatricular, onClickDelete, onClickUpload } = props;
  
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
            <Grid container spacing={2} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={6} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Personal
                    </Typography>
                </Grid>
                <Grid item xs={6} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <Button size="medium" variant="contained" startIcon={<FileUploadIcon />} onClick={onClickUpload}>Cargar excel</Button>
                </Grid>
            </Grid>
        )}
        {numSelected > 0 &&
            <Grid container spacing={2}>
                <Grid item xs={12} display={"flex"} justifyContent={"flex-end"}>
                <Tooltip title="Matricular">
                    <IconButton onClick={onClickMatricular}>
                        <DatasetLinkedIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar">
                    <IconButton onClick={onClickDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                </Grid>
            </Grid>
        }
      </Toolbar>
    );
}


export default function AdminClienteIDView () {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Trabajador>('nombres');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openModalExcel, setOpenModalExcel] = React.useState(false);
    const [openDialogClase, setOpenDialogClase] = React.useState(false);
    const [openDialogEmpresa, setOpenDialogEmpresa] = React.useState(false);
    const [openDialogPeriodo, setOpenDialogPeriodo] = React.useState(false);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [loading, setLoading] = React.useState(false);
    const [openDialogConfirmation, setOpenDialogConfirmation] = React.useState(false);
    const [titleDialogConfirmation, setTitleDialogConfirmation] = React.useState('');
    const [messageDialogConfirmation, setMessageDialogConfirmation] = React.useState('');
    const { empresasCliente } = useAppSelector((state:RootState) => state.empresas);
    const [empresaToEdit, setEmpresaToEdit] = React.useState<EmpresaCliente>(EmpresaClienteInitialState);
    const { periodos: periodosReducer } = useAppSelector(state => state.periodos);
    const [periodos, setPeriodos] = React.useState<Periodo[]>([]);
    const [periodo, setPeriodo] = React.useState<Periodo>(initialStatePeriodo);
    const [trabajadores, setTrabajadores] = React.useState<Trabajador[]>([]);
    const [filteredTrabajadores, setFilteredTrabajadores] = React.useState<Trabajador[]>([]);
    const [clases, setClases] = React.useState<Clase[]>([]);
    const [idClase, setIdClase] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openMenuPeriodo, setOpenMenuPeriodo] = React.useState(false);
    const [currentDeleting, setCurrentDeleting] = React.useState<DELETING>(DELETING.NOT_DEFINED);
    const [currentOperPeriodo, setCurrentOperPeriodo] = React.useState<OPER_PERIODO>(OPER_PERIODO.NOT_DEFINED);
    const [openModalImage, setOpenModalImage] = React.useState(false);    
    const { id } = useParams();
    const [empresa, setEmpresa] = React.useState<EmpresaCliente>(useAppSelector((state:RootState) => selectEmpresaClienteById(state, parseInt(id || '0'))));
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authHeader = useAuthHeader();
    const location = useLocation();
    const [value, setValue] = React.useState(location.state?.prevUrl?.toLowerCase().indexOf('periodos') > -1 ? 1 : 0);
    
    React.useEffect(() => {
        uppyExcel.getPlugin('XHRUpload')?.setOptions({
            headers:{
                Authorization: authHeader(),
            },
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                dispatch(_setTrabajadores(data.data));
                setTrabajadores(data.data || []);
                setFilteredTrabajadores(data.data || []);
                return true;
            },
        })
    }, [trabajadores]);

    React.useEffect(() => {
        uppyImage.getPlugin('XHRUpload')?.setOptions({
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                dispatch(updateEmpresa({...empresa, logo: `${config.baseUrl}${config.logoPath}/${data.data[0].filename}`}));
                setEmpresa({...empresa, logo: `${config.baseUrl}${config.logoPath}/${data.data[0].filename}`});
                return true;
            },
        })
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };

    React.useEffect(() => {
        /*if(!empresa.trabajadores || !empresa.periodos || empresa.trabajadores.length === 0 || empresa.periodos.length === 0) {
            dispatch(getEmpresaById(id || '0'));
        }*/
        dispatch(getEmpresaById(id || '0'));
    }, [value]);

    useAPIData(empresasCliente, React.useMemo(() =>({
        onFulfilled: (data: EmpresaCliente[]) => {
            setLoading(false);

            let em = data.filter(d => d.id === parseInt(id || '0'));
            if(em.length > 0){ 
                dispatch(_setPeriodos(em[0].periodos || []));
                setTrabajadores(em[0].trabajadores || []);
                setFilteredTrabajadores(em[0].trabajadores || []);
                uppyExcel.setMeta({id_empresa_cliente: empresa.id});
            }

            const handlePostDelete = () => {
                if(currentDeleting === DELETING.EMPRESA) {
                    handleBack();
                    setCurrentDeleting(DELETING.NOT_DEFINED);
                }
            }

            handlePostDelete();
        },
        onRejected: (error) => {
            setToastMessageSeverity('error');
            setToastMessage(`${error.status}: ${error.statusText}`);
            setOpenToastResponse(true);
            setLoading(false);
        },
        onPending: () => {
            setLoading(true);
        }
    }), [empresasCliente]));

    useAPIData(periodosReducer, React.useMemo(() => ({
        onFulfilled: (data: Periodo[]) => {
            setLoading(false);
            setPeriodos(data);
            data.map(periodo => {
                if (periodo.activo === 1) setClases(periodo.clases || []);
            });
            
            const handlePostDelete = () => {
                if (currentDeleting === DELETING.PERIODO) {
                    setToastMessageSeverity('success');
                    setToastMessage('Periodo eliminado correctamente');
                    setOpenToastResponse(true);
                    setCurrentDeleting(DELETING.NOT_DEFINED);

                    dispatch(getEmpresaById(id || '0'));
                }
            }
            handlePostDelete();
        },
        onRejected: (error) => {
            setToastMessageSeverity('error');
            setToastMessage(`${error.status}: ${error.statusText}`);
            setOpenToastResponse(true);
            setLoading(false);
        },
        onPending: () => {
            setLoading(true);
        }
    }), [periodosReducer]));

    const handleCloseToastResponse = () => {
      setOpenToastResponse(false);
    }

    const handleBack = () => {
        navigate("/admin/clientes");
    }

    const handleOpenDialogConfirmation = (event: React.MouseEvent<HTMLElement>, tag: DELETING) => {
        handleCloseMenuPeriodo();
        setTitleDialogConfirmation('Eliminar');
        
        setCurrentDeleting(tag);
        if(tag === DELETING.EMPRESA) {
            setMessageDialogConfirmation(`¿Está seguro que desea eliminar la empresa ${empresa.razon_social}?`);
        }
        else if(tag === DELETING.PERIODO) {
            setMessageDialogConfirmation(`¿Está seguro que desea eliminar el periodo ${periodo.codigo}?`);
        }
        else if(tag === DELETING.TRABAJADOR) {
            setMessageDialogConfirmation(`¿Está seguro que desea eliminar ${selected.length} registros seleccionados?`)
        }
        
        setOpenDialogConfirmation(true);
    }

    const handleCloseDialogConfirmation = (accepted: boolean) => {
        setTitleDialogConfirmation('');
        setMessageDialogConfirmation('');
        setOpenDialogConfirmation(false);
        
        if(!accepted) return;

        if(currentDeleting === DELETING.EMPRESA) {
            dispatch(deleteEmpresa(id || '0'));
        }
        else if(currentDeleting === DELETING.PERIODO) {
            dispatch(deletePeriodo(`${periodo.id}` || '0'));
        }
        else if(currentDeleting === DELETING.TRABAJADOR) {
            dispatch(deleteTrabajadores(selected.map(el => el))).then(() => {
                dispatch(getEmpresaById(id || '0'));
                setSelected([]);
            });
        }
    }

    const handleOpenDialogEmpresa = () => {
        setEmpresaToEdit({...empresa});
        setOpenDialogEmpresa(true);
    };

    const handleCloseDialogEmpresa = () => {
        setEmpresaToEdit(EmpresaClienteInitialState);
        setOpenDialogEmpresa(false);
    };

    const handleSubmitEmpresa = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setOpenDialogEmpresa(false);
        dispatch(updateEmpresa(empresaToEdit));
        setEmpresa(empresaToEdit);
    };

    const onEmpresaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmpresaToEdit({ ...empresaToEdit, [e.target.name]: e.target.value });
    }

    const handleOpenDialogPeriodo = () => {
        setCurrentOperPeriodo(OPER_PERIODO.ADD);
        setPeriodo({
            ...initialStatePeriodo,
            id_empresa_cliente: parseInt(id || '0')
        });
        setOpenDialogPeriodo(true);
    }

    const handleOpenDialogPeriodoEdit = (event: React.MouseEvent<HTMLElement>) => {
        setCurrentOperPeriodo(OPER_PERIODO.EDIT);
        handleCloseMenuPeriodo();
        setOpenDialogPeriodo(true);
    }

    const handleCloseDialogPeriodo = () => {
        setOpenDialogPeriodo(false);
    }

    const handleSubmitPeriodo = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setOpenDialogPeriodo(false);
        if (currentOperPeriodo === OPER_PERIODO.ADD) {
            dispatch(addPeriodo(periodo));
        }
        else if (currentOperPeriodo === OPER_PERIODO.EDIT) {
            dispatch(updatePeriodo(periodo));
        }
        setPeriodo(periodo);
    }

    const onPeriodoChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPeriodo({ ...periodo, [e.target.name]: e.target.value });
    }

    const handleOpenMenuPeriodo = (event: React.MouseEvent<HTMLElement>, periodo: Periodo) => {
        setPeriodo(periodo);
        setAnchorEl(event.currentTarget);
        setOpenMenuPeriodo(true);
    }

    const handleCloseMenuPeriodo = () => {
        setAnchorEl(null);
        setOpenMenuPeriodo(false);
    }

    const handleClickView = (event: React.MouseEvent<unknown>) => {
        navigate(`/admin/clientes/${empresa.id}/periodos/${periodo.id}`, {replace: false, state: {prevUrl: location.pathname} });
    };

    const handleOpenDialogClase = () => {
        setOpenDialogClase(true);
    }

    const handleCloseDialogClase = () => {
        setOpenDialogClase(false);
    }

    //TODO: Falta termina la funcionalidad
    const handleSubmitMatricula = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(matricularTrabajadores({id_clase: parseInt(idClase || '0'), ids_trabajadores: selected.map(el => el)}));
        setOpenDialogClase(false);
        setSelected([])
    }

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
            const newSelected = filteredTrabajadores.map((n) => n.id);
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
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredTrabajadores.length) : 0;
  
    const visibleRows = React.useMemo(
      () =>
        stableSort(filteredTrabajadores, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage, filteredTrabajadores],
    );
    
    const handleChangeClase = (event: SelectChangeEvent) => {
        setIdClase(event.target.value);
    };

    const handleLoadImage = (event: React.MouseEvent<HTMLElement>) => {
        setOpenModalImage(true);
    }


    return (
        <Box sx={{ width: '100%' }}>
            { loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}
            <div>
                <DashboardModal
                    uppy={uppyExcel}
                    open={openModalExcel}
                    onRequestClose={() => setOpenModalExcel(false)}
                />
            </div>
            <div>
                <DashboardModal
                    uppy={uppyImage}
                    open={openModalImage}
                    onRequestClose={() => setOpenModalImage(false)}
                />
            </div>
            <Dialog 
                fullWidth
                maxWidth="md" 
                open={openDialogClase} 
                onClose={handleCloseDialogClase}>
                <Box component="form" onSubmit={handleSubmitMatricula}>
                <DialogTitle>Matricular</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="select-cliente-label" sx={{width: '100%'}}>Clase</InputLabel>
                                <Select
                                    labelId="select-cliente-label"
                                    id="select-cliente"
                                    value={idClase}
                                    label="Clase"
                                    onChange={handleChangeClase}
                                >
                                    {clases.map((clase) => (
                                        <MenuItem key={clase.id} value={clase.id}>
                                            {clase.titulo}
                                            {<Chip label={TIPO_CLASE[clase.tipo]} color="success" variant="outlined" size="small" sx={{ml: 1}} />}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogClase}>Cancelar</Button>
                    <Button type="submit" variant="contained">Matricular</Button>
                </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={openDialogEmpresa} onClose={handleCloseDialogEmpresa}>
                <Box component="form" onSubmit={handleSubmitEmpresa}>
                <DialogTitle>Empresa</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="razon_social"
                                required
                                fullWidth
                                id="razonsocial"
                                label="Razón Social"
                                autoFocus
                                value={empresaToEdit.razon_social}
                                onChange={onEmpresaChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="ruc"
                                label="RUC"
                                name="ruc"
                                value={empresaToEdit.ruc}
                                onChange={onEmpresaChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="telefono"
                                label="Telefono"
                                name="telefono"
                                value={empresaToEdit.telefono}
                                onChange={onEmpresaChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="direccion"
                                label="Dirección"
                                id="direccion"
                                value={empresaToEdit.direccion}
                                onChange={onEmpresaChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                name="correo"
                                label="Correo"
                                id="correo"
                                value={empresaToEdit.correo}
                                onChange={onEmpresaChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                name="numero_trabajadores"
                                label="Trabajadores"
                                id="trabajadores"
                                value={empresaToEdit.numero_trabajadores}
                                onChange={onEmpresaChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="responsable"
                                label="Responsable"
                                id="responsable"
                                value={empresaToEdit.responsable}
                                onChange={onEmpresaChange}
                            />
                        </Grid>    
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogEmpresa}>Cancelar</Button>
                    <Button type="submit" variant="contained">Actualizar</Button>
                </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={openDialogPeriodo} onClose={handleCloseDialogPeriodo}>
                <Box component="form" onSubmit={handleSubmitPeriodo}>
                <DialogTitle>Contrato</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="codigo"
                                required
                                fullWidth
                                id="codigo"
                                label="Código"
                                autoFocus
                                value={periodo.codigo}
                                onChange={onPeriodoChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                fullWidth
                                id="descripcion"
                                label="Descripción"
                                name="descripcion"
                                value={periodo.descripcion}
                                onChange={onPeriodoChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker 
                                label="Inicio" 
                                format="DD/MM/YYYY" 
                                defaultValue={moment(periodo.fecha_inicio)}
                                onChange={f => setPeriodo({...periodo, fecha_inicio: f?.format('YYYY-MM-DD') || ''})} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker 
                                label="Fin" 
                                format="DD/MM/YYYY" 
                                defaultValue={moment(periodo.fecha_fin)}
                                onChange={f => setPeriodo({...periodo, fecha_fin: f?.format('YYYY-MM-DD') || ''})} 
                            />
                        </Grid> 
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogPeriodo}>Cancelar</Button>
                    <Button type="submit" variant="contained">Guardar</Button>
                </DialogActions>
                </Box>
            </Dialog>
            <Grid container spacing={2} sx={{ mb:  3}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={8} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <Typography variant='h4' color={"text.primary"}>
                        {empresa.razon_social}
                    </Typography>
                </Grid>
                <Grid item xs={4} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>Atr&aacute;s</Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h5' color={"text.secondary"}>
                        {empresa.responsable}
                    </Typography>
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', mb: 2, p:2 }} elevation={3}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Información" {...a11yProps(0)} />
                        <Tab label="Contratos" {...a11yProps(1)} />
                        <Tab label="Personal" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Grid container spacing={1} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        <Grid item xs={12} sx={{mb: 2}}>
                            <Button size="small" variant="text" startIcon={<EditIcon />} onClick={handleOpenDialogEmpresa}>Editar</Button>
                            <Button size="small" variant="text" startIcon={<DeleteIcon />} sx={{ml: 2}} onClick={event => handleOpenDialogConfirmation(event, DELETING.EMPRESA)}>Eliminar</Button>
                            <Button size="small" variant="text" startIcon={<AddPhotoAlternateIcon />} sx={{ml: 2}} onClick={event => handleLoadImage(event)}>Logo</Button>
                        </Grid>
                        <Grid container item spacing={2} direction={"row"} >
                            <Grid container item spacing={2} direction={"row"} xs={8} >
                                <Grid item xs={2}>
                                    <Typography variant='subtitle2'>Direcci&oacute;n</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant='subtitle1'>{empresa.direccion}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='subtitle2'>Tel&eacute;fono</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant='subtitle1'>{empresa.telefono}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='subtitle2'>RUC</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant='subtitle1'>{empresa.ruc}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='subtitle2'>Correo</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant='subtitle1'>{empresa.correo}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant='subtitle2'>Trabajadores</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant='subtitle1'>
                                        {empresa.numero_trabajadores}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container item spacing={2} direction={"row"} xs={4} >
                                <Grid item xs={12} visibility={empresa.logo ? 'visible' : 'hidden'}>
                                    <img src={empresa.logo} alt={empresa.razon_social} width="100%" />
                                </Grid>
                            </Grid> 
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Grid container sx={{mb: 2}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                        <Button size="medium" variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialogPeriodo}>Nuevo</Button>
                    </Grid>
                    <Grid item xs={12}>
                        
                    </Grid>
                    <Table sx={{ minWidth: 650 }} aria-label="periodos" size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>C&oacute;digo</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Incio</TableCell>
                                <TableCell>Fin</TableCell>
                                <TableCell>Activo</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {periodos.map((row) => (
                            <TableRow
                                //hover
                                //onClick={event => handleClick(event, row.id)}
                                key={row.id}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{row.codigo}</TableCell>
                                <TableCell>{row.descripcion}</TableCell>
                                <TableCell>{moment(row.fecha_inicio).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>{moment(row.fecha_fin).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>
                                    {row.activo ? 
                                        <Tooltip title="Activo"><TaskAltIcon color="success" /></Tooltip> : 
                                        <Tooltip title="Cerrado"><BlockIcon color="warning" /></Tooltip>
                                    }
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={event => handleOpenMenuPeriodo(event, row)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <StyledMenu
                                        id={`menu-${row.id}`}
                                        MenuListProps={{
                                          'aria-labelledby': 'demo-customized-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={openMenuPeriodo}
                                        onClose={handleCloseMenuPeriodo}
                                    >
                                    <MenuItem onClick={event => handleClickView(event)} disableRipple>
                                        <VisibilityIcon sx={{ mr: 2 }} />
                                        Ver
                                    </MenuItem>
                                    <MenuItem onClick={event => handleOpenDialogPeriodoEdit(event)} disableRipple>
                                        <EditIcon sx={{ mr: 2 }} />
                                        Editar
                                    </MenuItem>
                                    <MenuItem onClick={event => handleOpenDialogConfirmation(event, DELETING.PERIODO)} disableRipple>
                                        <DeleteIcon sx={{ mr: 2 }} />
                                        Eliminar
                                    </MenuItem>
                                    </StyledMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <EnhancedTableToolbar 
                        numSelected={selected.length}
                        onClickMatricular={(event) => handleOpenDialogClase()}
                        onClickDelete={(event) => handleOpenDialogConfirmation(event, DELETING.TRABAJADOR)}
                        onClickUpload={(event) => setOpenModalExcel(true)}
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
                                rowCount={filteredTrabajadores.length}
                                trabajadores={trabajadores}
                                setTrabajadores={setFilteredTrabajadores}
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
                                            {row.nombres}
                                        </TableCell>
                                        <TableCell>{row.apellidos}</TableCell>
                                        <TableCell>{row.dni}</TableCell>
                                        <TableCell>{row.area}</TableCell>
                                        <TableCell>{row.puesto}</TableCell>
                                        <TableCell>{row.sede}</TableCell>
                                        <TableCell>{moment(row.fecha_nacimiento).format('DD/MM/YYYY')}</TableCell>
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
                        count={filteredTrabajadores.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TabPanel>
            </Paper>

            <ConfirmationDialog open={openDialogConfirmation} onClose={handleCloseDialogConfirmation} title={titleDialogConfirmation} message={messageDialogConfirmation} />

            <Snackbar open={openToastResponse} autoHideDuration={6000} onClose={handleCloseToastResponse}>
                <Alert onClose={handleCloseToastResponse} severity={toastMessageSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
