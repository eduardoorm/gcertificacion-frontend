import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { AdminListItems, TrabajadorListItems, EmpresaListItems } from './listItems';
import { useLocalState } from '../../util/localStorage';
import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar, CircularProgress, Container, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useSignOut } from 'react-auth-kit'
import { TIPO_USUARIO, UserAuthenticated } from '../../interfaces/entities';
import { RootState, setUserAuthenticated, useAppDispatch, useAppSelector } from '../../store';
import { Logout } from '@mui/icons-material';
import { useIsAuthenticated } from 'react-auth-kit';
import brand from '../../assets/images/brand.jpg';

const initialStateUserAuthenticated: UserAuthenticated = {
    id_trabajador: 0,
    nombres: '',
    apellidos: '',
    usuario: '',
    tipo: TIPO_USUARIO.TRABAJADOR,
    token: '',
    tokenType: 'Bearer',
    recargar_lista_clientes: true,
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);


export default function MainLayout() {
    const [ openAppBar, setOpenAppBar ] = React.useState(true);
    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
    const userAuthenticated = useAppSelector((state:RootState) => state.usuarios.userAuthenticated);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const signOut = useSignOut()
    const dispatch = useAppDispatch();


    const logout = () => {
        handleClose();
        signOut();
        dispatch({type: 'USER_LOGOUT'});
        dispatch(setUserAuthenticated(initialStateUserAuthenticated));
        localStorage.removeItem('token');
        navigate('/login', {replace: false});
    }
    const toggleDrawer = () => {
        setOpenAppBar(!openAppBar);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="absolute" open={openAppBar}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(openAppBar && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Hola {userAuthenticated.nombres} {userAuthenticated.apellidos}
                    </Typography>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={openAppBar ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openAppBar ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>{userAuthenticated.nombres.charAt(0).toUpperCase()}</Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={logout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Cerrar sesi&oacute;n
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={openAppBar}>
                <Toolbar
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      px: [1],
                    }}
                >
                    <img src={brand} alt="Global Certificación" width={'75%'} />
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    {userAuthenticated.tipo === TIPO_USUARIO.ADMIN && 
                    <AdminListItems/>}
                    {userAuthenticated.tipo === TIPO_USUARIO.ADMIN && 
                    <Divider sx={{ my: 1 }} /> }
                    {userAuthenticated.tipo === TIPO_USUARIO.TRABAJADOR && 
                    <TrabajadorListItems title='' /> }
                    {userAuthenticated.tipo === TIPO_USUARIO.TRABAJADOR && 
                    <Divider sx={{ my: 1 }} />}
                    {userAuthenticated.tipo === TIPO_USUARIO.EMPRESA && 
                    <EmpresaListItems/>}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4, }}>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    );
}
