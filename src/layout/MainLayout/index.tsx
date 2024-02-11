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
import { Logout } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar,Container, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useSignOut } from 'react-auth-kit'
import { AdminListItems, TrabajadorListItems, EmpresaListItems } from './listItems';
import { TIPO_USUARIO, UserAuthenticated } from '../../interfaces/entities';
import { RootState, setUserAuthenticated, useAppDispatch, useAppSelector } from '../../store';
import brand from '../../assets/images/brand.jpg';
import MenuCerrarSesion from '../../components/Util/MenuCerrarSesion/MenuCerrarSesion';
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
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));


const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));
  

  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));



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
            <AppBar position="fixed" open={openAppBar}>
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
                    <MenuCerrarSesion anchorEl={anchorEl} open={open} handleClose={handleClose} logout={logout}/>
                </Toolbar>
            </AppBar>

            {/*Es el menu completo de la izquierda*/}
            <Drawer 
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                          width: drawerWidth,
                          boxSizing: "border-box",
                        },
                      }}
            variant="persistent"
            anchor="left"
            open={openAppBar}>
                {/*Ecabezado Menú*/}          
                <DrawerHeader>
                    <img src={brand} alt="Global Certificación" width={'75%'} />
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                
                <Divider />
                 {/*Lista Items Menú en caso sea ADMIN, TRABAJADOR O EMPRESA*/} 
                 {openAppBar &&         
                <List>
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
                    
                    }
            </Drawer>

            {/*La caja que va a contener el cotenido que se muestra cada que seleccionamos una opción */}
            <Main open={open}
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
                <DrawerHeader />
                <Toolbar />
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4, }}>
                    <Outlet />
                </Container>
            </Main>
        </Box>
    );
}
