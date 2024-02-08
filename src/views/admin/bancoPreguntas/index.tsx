import React from "react";
import { Alert, Chip } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AlertColor } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { Snackbar } from "@mui/material";
import { TextField } from "@mui/material";
import { Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from "@mui/icons-material/Add";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { BancoPreguntas, Clase, EmpresaCliente, TAG_CLASE, TIPO_CLASE } from "../../../interfaces/entities";
import { addBancoPreguntas, getBancosPreguntasByEmpresa, getEmpresas } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useAPIData } from "../../../api/useAPIData";
import { useNavigate } from "react-router-dom";
import { getClasesByEmpresa } from "../../../store/slices/clase";

  
interface HeadCell {
    disablePadding: boolean;
    id: 'id'|'clase'|'nombre';
    label: string;
    numeric: boolean;
}
  
const headCells: readonly HeadCell[] = [
    {
      id: 'id',
      numeric: true,
      disablePadding: true,
      label: 'id',
    },
    {
      id: 'clase',
      numeric: false,
      disablePadding: false,
      label: 'Clase',
    },
    {
      id: 'nombre',
      numeric: false,
      disablePadding: false,
      label: 'Nombre del banco',
    },
];
  
function EnhancedTableHead() {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => headCell.id === 'id' ? null : (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function AdminBancosPreguntasView() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openDialogBanco, setOpenDialogBanco] = React.useState(false);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [loading, setLoading] = React.useState(false);
    const { empresasCliente: empresasClienteReducer } = useAppSelector(state => state.empresas)
    const [empresas, setEmpresas] = React.useState<EmpresaCliente[]>([]);
    const [empresa, setEmpresa] = React.useState<EmpresaCliente>({} as EmpresaCliente);
    const { clases: clasesReducer } = useAppSelector(state => state.clases);
    const [clases, setClases] = React.useState<Clase[]>([]);
    const { bancosPreguntas: bancosPreguntasReducer } = useAppSelector(state => state.bancosPreguntas);
    const [bancosPreguntas, setBancosPreguntas] = React.useState<BancoPreguntas[]>([]);
    const [idEmpresa, setIdEmpresa] = React.useState('');
    const [idClase, setIdClase] = React.useState('');
    const [idCliente, setIdCliente] = React.useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(getEmpresas());
    }, []);

    useAPIData(empresasClienteReducer, React.useMemo(() => ({
        onFulfilled: (data: EmpresaCliente[]) => {
            setLoading(false);
            setEmpresas(data)
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
    }), [empresasClienteReducer]));

    useAPIData(clasesReducer, React.useMemo(() => ({
        onFulfilled: (data: Clase[]) => {
            setClases(data)
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

    useAPIData(bancosPreguntasReducer, React.useMemo(() => ({
        onFulfilled: (data: BancoPreguntas[]) => {
            setLoading(false);
            setBancosPreguntas(data);
        },
        onRejected: (error) => {
            setLoading(false);
            if (error.statusText === 'Not Found') {
                setToastMessageSeverity('warning');
                setToastMessage('No se encontraron clases para este cliente');
            }
            else {
                setToastMessageSeverity('error');
                setToastMessage(`${error.status}: ${error.statusText}`);
            }
            setOpenToastResponse(true);
            setBancosPreguntas([]);
        },
        onPending: () => {
            setLoading(true);
        }
    }), [bancosPreguntasReducer]));

    const handleEmpresaChange = (event: SelectChangeEvent) => {
        setIdEmpresa(event.target.value);
        setIdClase('');
        dispatch(getClasesByEmpresa(event.target.value));
    }

    const handleClaseChange = (event: SelectChangeEvent) => {
        setIdClase(event.target.value);
    }

    const handleClienteChange = (event: SelectChangeEvent) => {
        setIdCliente(event.target.value);
        dispatch(getBancosPreguntasByEmpresa(event.target.value));
    }

    const handleCloseToastResponse = () => {
      setOpenToastResponse(false);
    }

    const handleOpenDialogBanco = () => {
        setOpenDialogBanco(true);
    }

    const handleCloseDialogBanco = () => {
        setIdEmpresa('');
        setIdClase('');
        setOpenDialogBanco(false);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data_ = new FormData(event.currentTarget);
        const data: BancoPreguntas = {
            id: 0,
            id_clase: parseInt(data_.get('clase')!.toString() || '0'),
            nombre: data_.get('nombre')!.toString(),
            descripcion: data_.get('descripcion')!.toString(),
        }
        
        dispatch(addBancoPreguntas(data));
        handleCloseDialogBanco();
    };
  
    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        navigate(`/admin/banco-preguntas/${id}`, {replace: false});
    };
  
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
  
   
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bancosPreguntas.length) : 0;
  
    const visibleRows: BancoPreguntas[] = React.useMemo(
      () =>
        bancosPreguntas.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [page, rowsPerPage, bancosPreguntas],
    );

    return (
        <Box sx={{ width: '100%' }}>
            
            <Dialog open={openDialogBanco} onClose={handleCloseDialogBanco}>
                <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>Banco de preguntas</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="select-empresa-label" sx={{width: '100%'}}>Cliente</InputLabel>
                                <Select
                                    required
                                    labelId="select-empresa-label"
                                    id="empresa"
                                    name="empresa"
                                    value={idEmpresa}
                                    label="Cliente"
                                    onChange={handleEmpresaChange}
                                >
                                    {empresas.map((empresa) => (
                                        <MenuItem key={empresa.id} value={empresa.id}>
                                            {empresa.razon_social}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="select-clase-label" sx={{width: '100%'}}>Clase</InputLabel>
                                <Select
                                    required
                                    labelId="select-clase-label"
                                    id="clase"
                                    name="clase"
                                    value={idClase}
                                    label="Clase"
                                    onChange={handleClaseChange}
                                >
                                    {clases.map((clase) => (
                                        <MenuItem key={clase.id} value={clase.id}>
                                            {clase.titulo}
                                            <Chip label={TAG_CLASE[clase.tipo]} color="success" variant="outlined" size="small" sx={{ml: 1}} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="nombre"
                                label="Nombre del banco"
                                id="nombre"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="descripcion"
                                label="Descripción"
                                id="descripcion"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogBanco}>Cancelar</Button>
                    <Button type="submit" variant="contained">Crear</Button>
                </DialogActions>
                </Box>
            </Dialog>

            <Grid container spacing={2} sx={{ mb:  3}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={10}>
                    <Typography variant='h4'>
                        Banco de preguntas
                    </Typography>
                </Grid>
                <Grid item xs={2} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialogBanco}>
                        Nuevo
                    </Button>
                    
                </Grid>
            </Grid>
            
            { loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}
            
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="select-cliente-label" sx={{width: '100%'}}>Cliente</InputLabel>
                            <Select
                                labelId="select-cliente-label"
                                id="select-cliente"
                                value={idCliente}
                                label="Cliente"
                                onChange={handleClienteChange}
                            >
                                {empresas.map((empresa) => (
                                    <MenuItem key={empresa.id} value={empresa.id}>
                                        {empresa.razon_social}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const labelId = `enhanced-table-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        tabIndex={-1}
                                        key={row.id}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                        >
                                            {row.clase?.titulo || ''}
                                            {row.clase && <Chip label={TAG_CLASE[row.clase.tipo]} color="success" variant="outlined" size="small" sx={{ml: 1}} />}
                                        </TableCell>
                                        <TableCell align="left">{row.nombre}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                  style={{
                                    height: 53 * emptyRows,
                                  }}
                                >
                                    <TableCell colSpan={2} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={bancosPreguntas.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Snackbar open={openToastResponse} autoHideDuration={6000} onClose={handleCloseToastResponse} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleCloseToastResponse} severity={toastMessageSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}