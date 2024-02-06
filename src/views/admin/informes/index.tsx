import React from 'react';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { visuallyHidden } from "@mui/utils"; 
import { EmpresaCliente, Periodo } from '../../../interfaces/entities';
import { RootState, getEmpresas, useAppDispatch, useAppSelector } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { useAPIData } from '../../../api/useAPIData';
import { Alert, AlertColor, LinearProgress, Snackbar } from '@mui/material';
import { useAuthUser } from 'react-auth-kit';
import { APIStatus } from '../../../interfaces/response';

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
    a:any, b:any,
    //a: { [key in Key]: number | string },
    //b: { [key in Key]: number | string },
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
    }
];
  
interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof EmpresaCliente) => void;
    order: Order;
    orderBy: string;
}
  
function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } =
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

export default function AdminInformesView(){
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof EmpresaCliente>('razon_social');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openToastResponse, setOpenToastResponse] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastMessageSeverity, setToastMessageSeverity] = React.useState<AlertColor>('success');
    const [loading, setLoading] = React.useState(false);
    const { empresasCliente: empresasClienteReducer } = useAppSelector(state => state.empresas)
    const [empresas, setEmpresas] = React.useState<EmpresaCliente[]>([]);
    const empresasClienteStatus = useAppSelector((state: RootState) => state.empresas.empresasCliente.status);
    const userAuthenticated = useAuthUser();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        if(empresasClienteStatus === APIStatus.IDLE){
            dispatch(getEmpresas());
        }
    }, []);

    useAPIData(empresasClienteReducer, React.useMemo(() => ({
        onFulfilled: (data: EmpresaCliente[]) => {
            setLoading(false);
            setEmpresas(data.filter((empresa: EmpresaCliente) => empresa.periodos && empresa.periodos.filter((periodo: Periodo) => periodo.activo).length > 0));
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

    const handleCloseToastResponse = () => {
      setOpenToastResponse(false);
    }

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof EmpresaCliente,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        navigate(`/admin/informes/clientes/${id}`, {replace: false});
    };
  
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - empresas.length) : 0;
  
    const visibleRows = React.useMemo(() =>
        stableSort(empresas, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage, empresas],
    );

    return (
        <Box component="main" sx={{width: '100%',}}>
            <Grid container spacing={2} sx={{mb:3}}>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        Informes
                    </Typography>
                </Grid>
            </Grid>
            <Paper sx={{width: '100%',}}>
                { loading && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
                )}
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
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
                                            {row.razon_social}
                                        </TableCell>
                                        <TableCell align="left">{row.direccion}</TableCell>
                                        <TableCell align="left">{row.telefono}</TableCell>
                                        <TableCell align="left">{row.correo}</TableCell>
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
    )
}