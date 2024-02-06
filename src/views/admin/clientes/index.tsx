import React, { useEffect, useMemo } from "react";
import { Alert } from "@mui/material";
import { AlertColor } from "@mui/material";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { Snackbar } from "@mui/material";
import { TextField } from "@mui/material";
import { Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { visuallyHidden } from '@mui/utils';
import { EmpresaCliente, UserAuthenticated } from "../../../interfaces/entities";
import { RootState, addEmpresa, getEmpresas, updateUserAuthenticated } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useAPIData } from "../../../api/useAPIData";
import { useNavigate } from "react-router-dom";
import { APIStatus } from "../../../interfaces/response";
import { useAuthUser } from 'react-auth-kit';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import XHRUpload from "@uppy/xhr-upload";
import es_PE from "../../../util/uppy/es_PE";
import config from "../../../config";

const uppyImage = new Uppy({ id: 'uppyImage', locale: es_PE, autoProceed: false, debug: true, restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ['image/*'],
}})
.use(XHRUpload, { endpoint: `${config.baseUrl}${config.logoPath}`, fieldName: 'logo',});

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
    a: any, b:any,
//    a: { [key in Key]: number | string },
//    b: { [key in Key]: number | string },
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
    id: keyof EmpresaCliente;
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
      id: 'razon_social',
      numeric: false,
      disablePadding: false,
      label: 'Empresa',
    },
    {
      id: 'direccion',
      numeric: false,
      disablePadding: false,
      label: 'Dirección',
    },
    {
      id: 'telefono',
      numeric: false,
      disablePadding: false,
      label: 'Telefono',
    },
    {
      id: 'correo',
      numeric: false,
      disablePadding: false,
      label: 'Correo',
    },
    {
      id: 'responsable',
      numeric: false,
      disablePadding: false,
      label: 'Responsable',
    },
  ];
  
  interface EnhancedTableProps {
    //numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof EmpresaCliente) => void;
    //onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    //rowCount: number;
  }
  
function EnhancedTableHead(props: EnhancedTableProps) {
    const { /*onSelectAllClick, */order, orderBy, /*numSelected, rowCount, */onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof EmpresaCliente) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
  
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => headCell.id === 'id' ? null : (
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
  }
  
  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
  
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
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Clientes
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }
  
export default function AdminClientesView() {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof EmpresaCliente>('razon_social');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openDialogEmpresa, setOpenDialogEmpresa] = React.useState(false);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [loading, setLoading] = React.useState(false);
    const { empresasCliente } = useAppSelector((state: RootState) => state.empresas)
    const [empresas, setEmpresas] = React.useState<EmpresaCliente[]>([]);
    const [empresa, setEmpresa] = React.useState<EmpresaCliente>({} as EmpresaCliente);
    const empresasClienteStatus = useAppSelector((state: RootState) => state.empresas.empresasCliente.status);
    const userAuthenticated = useAppSelector((state: RootState) => state.usuarios.userAuthenticated);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        uppyImage.getPlugin('XHRUpload')?.setOptions({
            validateStatus: (statusCode: number, responseText: string, response: any) => {
                if (statusCode !== 200) {
                    return false;
                }
                let data = JSON.parse(responseText);
                setEmpresa({...empresa, logo: `${config.baseUrl}${config.logoPath}/${data.data[0].filename}`});
                return true;
            },
        })
    }, []);

    useEffect(() => {
        if(empresasClienteStatus === APIStatus.IDLE){
            dispatch(getEmpresas());
        }
    }, []);

    useEffect(() => {
        if(empresa.razon_social) {
            dispatch(addEmpresa(empresa));
        }
    }, [empresa]);

    useAPIData(empresasCliente, useMemo(() => ({
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
    }), [empresasCliente]));

    const handleOpenDialogEmpresa = () => {
        setOpenDialogEmpresa(true);
    };

    const handleCloseDialogEmpresa = () => {
        setOpenDialogEmpresa(false);
    };

    const handleCloseToastResponse = () => {
      setOpenToastResponse(false);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data_ = new FormData(event.currentTarget);
        const data : EmpresaCliente = {
            id: 0,
            razon_social: data_.get('razonsocial')!.toString(),
            direccion: data_.get('direccion')!.toString(), 
            telefono: data_.get('telefono')!.toString(),
            ruc: data_.get('ruc')!.toString(),
            correo: data_.get('correo')!.toString(),
            numero_trabajadores: parseInt(data_.get('trabajadores')!.toString()),
            responsable:data_.get('responsable')!.toString(),
            logo: empresa.logo,
        }

        setOpenDialogEmpresa(false);
        setEmpresa(data);
    };

    const handleRequestSort = (
      event: React.MouseEvent<unknown>,
      property: keyof EmpresaCliente,
    ) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const data = empresas.filter(el => el.id === id)[0];
        navigate(`/admin/clientes/${id}`, {replace: false});
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
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - empresas.length) : 0;
  
    const visibleRows = React.useMemo(
      () =>
        stableSort(empresas, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage, empresas],
    );
  
    return (
        <Box sx={{ width: '100%' }}>
            <Dialog open={openDialogEmpresa} onClose={handleCloseDialogEmpresa}>
                <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle>Empresa</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{mt: 1}}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                name="razonsocial"
                                required
                                fullWidth
                                id="razonsocial"
                                label="Razón Social"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="ruc"
                                label="RUC"
                                name="ruc"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="telefono"
                                label="Telefono"
                                name="telefono"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="direccion"
                                label="Dirección"
                                id="direccion"
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                name="correo"
                                label="Correo"
                                id="correo"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                fullWidth
                                name="trabajadores"
                                label="Trabajadores"
                                id="trabajadores"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="responsable"
                                label="Responsable"
                                id="responsable"
                            />
                            <TextField
                                type="hidden"
                                name="logo"
                                id="logo"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            Logo
                        </Grid>
                        <Grid item xs={12}>
                            <Dashboard uppy={uppyImage} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogEmpresa}>Cancelar</Button>
                    <Button type="submit" variant="contained">Crear</Button>
                </DialogActions>
                </Box>
            </Dialog>
            <Grid container spacing={2} sx={{ mb:  3}} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
                <Grid item xs={10}>
                    <Typography variant='h4'>
                        Clientes
                    </Typography>
                </Grid>
                <Grid item xs={2} display={"flex"} justifyContent={"flex-end"} alignItems={"center"}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialogEmpresa}>
                        Nuevo
                    </Button>
                    
                </Grid>
            </Grid>
            { loading && (<Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}

            <Paper sx={{ width: '100%', mb: 2 }}>
                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead
                            //numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            //onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            //rowCount={empresas.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                //const isItemSelected = isSelected(row.razon_social);
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
                                            //padding="none"
                                        >
                                            {row.razon_social}
                                        </TableCell>
                                        <TableCell align="left">{row.direccion}</TableCell>
                                        <TableCell align="left">{row.telefono}</TableCell>
                                        <TableCell align="left">{row.correo}</TableCell>
                                        <TableCell align="left">{row.responsable}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                  style={{
                                    height: 53 * emptyRows,
                                  }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={empresas.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Snackbar open={openToastResponse} autoHideDuration={6000} onClose={handleCloseToastResponse}>
                <Alert onClose={handleCloseToastResponse} severity={toastMessageSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}