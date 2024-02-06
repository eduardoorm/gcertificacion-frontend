import React from "react";
import { Alert, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { AlertColor } from "@mui/material"; 
import { Box } from "@mui/material"; 
import Collapse from '@mui/material/Collapse';
import { Divider } from "@mui/material"; 
import { IconButton } from "@mui/material"; 
import { LinearProgress } from "@mui/material"; 
import { Paper } from "@mui/material"; 
import { Snackbar } from "@mui/material"; 
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import ConfirmationDialog from "../../../../ui-component/ConfirmationDialog";
import { getBancoPreguntasById, setBancosPreguntas as _setBancoPreguntas, deleteBancoPreguntas } from "../../../../store";
import { useAPIData } from "../../../../api/useAPIData";
import Uppy from '@uppy/core';
import { DashboardModal } from '@uppy/react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import XHRUpload from "@uppy/xhr-upload";
import es_PE from "../../../../util/uppy/es_PE";
import config from "../../../../config";
import { BancoPreguntas, Pregunta, RESPUESTA_CORRECTA } from "../../../../interfaces/entities";

const initialStateBancoPreguntas: BancoPreguntas = {
    id: 0,
    id_clase: 0,
    nombre: '',
    descripcion: '',
    clase: undefined,
    periodo: undefined,
    empresaCliente: undefined,
    preguntas: [],
}

const uppyExcel = new Uppy({ id: 'uppyExcel', locale: es_PE, autoProceed: false, debug: true, restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ['.xls', '.xlsx'],
}})
.use(XHRUpload, { endpoint: `${config.baseUrl}${config.excelBancoPath}`, fieldName: 'file',});

function Row(props: {pregunta: Pregunta}) {
    const {pregunta} = props;
    const [open, setOpen] = React.useState(false);
  
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset', cursor: 'pointer' } }} onClick={() => setOpen(!open)}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {pregunta.pregunta}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="purchases">
                            <TableBody>
                                {pregunta.respuestas && pregunta.respuestas.map((respuesta) => (
                                    <TableRow key={respuesta.id}>
                                        <TableCell component="th" scope="row">
                                            <Alert icon={false} severity={respuesta.correcta == RESPUESTA_CORRECTA.CORRECTA ? 'success' : 'error'}>{respuesta.respuesta}</Alert>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                  </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
  }

export default function AdminBancoPreguntasIDView() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openModalExcel, setOpenModalExcel] = React.useState(false);
    const [openDialogBancoPreguntas, setOpenDialogBancoPreguntas] = React.useState(false);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [loading, setLoading] = React.useState(false);
    const [openDialogConfirmation, setOpenDialogConfirmation] = React.useState(false);
    const [titleDialogConfirmation, setTitleDialogConfirmation] = React.useState('');
    const [messageDialogConfirmation, setMessageDialogConfirmation] = React.useState('');
    const { bancosPreguntas: bancosPreguntasReducer } = useAppSelector(state => state.bancosPreguntas);
    const [bancoPreguntas, setBancoPreguntas] = React.useState<BancoPreguntas>(initialStateBancoPreguntas);
    const [preguntas, setPreguntas] = React.useState<Pregunta[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    React.useEffect(() => {
        uppyExcel.getPlugin('XHRUpload')?.setOptions({
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                dispatch(_setBancoPreguntas(data.data));
                setPreguntas(data.data[0].preguntas);
                return true;
            },
        })
    }, [bancoPreguntas]);

    React.useEffect(() => {
        dispatch(getBancoPreguntasById(id || '0'));
    }, []);

    useAPIData(bancosPreguntasReducer, React.useMemo(() => ({
        onFulfilled: (data: BancoPreguntas[]) => {
            setLoading(false);
            setBancoPreguntas(data[0]);
            setPreguntas(data[0].preguntas || []);
            uppyExcel.setMeta({id_banco_preguntas: data[0].id});
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
    }), [bancosPreguntasReducer]));
    
    const handleOpenDialogBancoPreguntas = () => {
        setOpenDialogBancoPreguntas(true);
    }

    const handleCloseDialogBancoPreguntas = () => {
        setOpenDialogBancoPreguntas(false);
    }

    const handleCloseToastResponse = () => {
        setOpenToastResponse(false);
    }

    const handleOpenDialogConfirmation = (event: React.MouseEvent<HTMLElement>) => {
        setTitleDialogConfirmation('Eliminar');
        setMessageDialogConfirmation('¿Está seguro que desea eliminar el banco de preguntas?');
        setOpenDialogConfirmation(true);
    }

    const handleCloseDialogConfirmation = (accepted: boolean) => {
        setTitleDialogConfirmation('');
        setMessageDialogConfirmation('');
        setOpenDialogConfirmation(false);
        if (accepted) {
            dispatch(deleteBancoPreguntas(id || '0'));
            handleBack();
        }
    }

    const handleBack = () => {
        navigate("/admin/banco-preguntas");
    }
  
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
  
   
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - preguntas.length) : 0;
  
    const visibleRows: Pregunta[] = React.useMemo(
      () =>
        preguntas.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [page, rowsPerPage, preguntas],
    );


    return (
        <Box sx={{ width: '100%' }}>
            { loading && (
            <Box sx={{ width: '100%' }}>
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
            <Grid container spacing={2} sx={{ mb:  3}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={12} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
                    <Typography variant='h4' color={"text.primary"}>
                        {bancoPreguntas.nombre}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h5' color={"text.secondary"}>
                        {bancoPreguntas.descripcion}
                    </Typography>
                </Grid>
            </Grid>
            <Paper sx={{ width: '100%', mb: 2, p:2 }} elevation={3}>
                <Grid container spacing={2} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                    <Grid item xs={3}>
                        <Typography variant="subtitle2">Informaci&oacute;n</Typography>
                    </Grid>
                    <Grid item xs={9} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                        <IconButton onClick={handleBack} >
                            <ArrowBackIcon />
                        </IconButton>
                        <IconButton onClick={() => setOpenModalExcel(true)}>
                            <FileUploadIcon />
                        </IconButton>
                        <IconButton onClick={handleOpenDialogBancoPreguntas}>
                            <EditIcon />
                        </IconButton>
                        <IconButton  onClick={event => handleOpenDialogConfirmation(event)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='subtitle2'>Cliente</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='subtitle1'>{bancoPreguntas.empresaCliente?.razon_social}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='subtitle2'>Periodo</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='subtitle1'>{bancoPreguntas.periodo?.codigo}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='subtitle2'>Clase</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='subtitle1'>{bancoPreguntas.clase?.titulo}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='subtitle2'>N&uacute;mero de preguntas</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='subtitle1'>{bancoPreguntas.preguntas?.length || 0}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ width: '100%', mb: 2,}} elevation={3}>
                <TableContainer>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Pregunta</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((row) => (
                            <Row key={row.id} pregunta={row} />
                            ))}
                            
                            {emptyRows > 0 && (
                                <TableRow
                                  style={{
                                    height: 53 * emptyRows,
                                  }}
                                >
                                    <TableCell colSpan={3} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={preguntas.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
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