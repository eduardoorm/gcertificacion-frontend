import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Logout } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar,Container, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useSignOut } from 'react-auth-kit'
import { TIPO_USUARIO, UserAuthenticated } from '../../interfaces/entities';
import { RootState, setUserAuthenticated, useAppDispatch, useAppSelector } from '../../store';
import brand from '../../assets/images/brand.jpg';
import MenuCerrarSesion from '../../components/Util/MenuCerrarSesion/MenuCerrarSesion';
import MenuPersistent from '../../components/Util/MenuPersintent/MenuPersistent';
import MenuPermanente from '../../components/Util/MenuPermanente/MenuPermanente';
import { useMediaQuery, useTheme } from '@mui/material';


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
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
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
    height:800,
    border:"1px solid",
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
    const [ openAppBarMobile, setOpenAppBarMobile ] = React.useState(false);

    const [ anchorEl, setAnchorEl ] = React.useState<null | HTMLElement>(null);
    const userAuthenticated = useAppSelector((state:RootState) => state.usuarios.userAuthenticated);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const signOut = useSignOut()
    const dispatch = useAppDispatch();

    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 1030px)');    
    const [auth, setAuth] = React.useState(true);

    const toggleDrawerMobile = () => {
        setOpenAppBarMobile(!openAppBarMobile);
    };

        const toggleDrawer = () => {
        setOpenAppBar(!openAppBar);
    };

    React.useEffect(() => {
        if (isMobile) {
          setOpenAppBar(false);
        } else {
          setOpenAppBar(true);
        }
      }, [isMobile]);
      

    const logout = () => {
        handleClose();
        signOut();
        dispatch({type: 'USER_LOGOUT'});
        dispatch(setUserAuthenticated(initialStateUserAuthenticated));
        localStorage.removeItem('token');
        navigate('/login', {replace: false});
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAuth(event.target.checked);
      };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
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

                    <div>
                    <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>{userAuthenticated.nombres.charAt(0).toUpperCase()}</Avatar>
                    </IconButton>

                    <MenuCerrarSesion anchorEl={anchorEl} open={open} handleClose={handleClose} logout={logout}/>
               
                </div>
               
                </Toolbar>
            </AppBar>


            {/*Es el menu completo de la izquierda*/}

            {isMobile ? (
                <>
             <MenuPersistent openAppBar={openAppBarMobile} brand={brand} toggleDrawer={toggleDrawerMobile} userAuthenticated={userAuthenticated} />
             <Main
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
            
             <Container maxWidth="xl" sx={{ mt: 7, mb: 4, }}>
                 <Outlet />
             </Container>
         </Main>
         </>
          
            ) : (
                <>
             <MenuPermanente openAppBar={openAppBar} brand={brand} toggleDrawer={toggleDrawer} userAuthenticated={userAuthenticated} />
             <Box 
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
            
             <Container maxWidth="xl" sx={{ mt:13, mb: 4, }}>
                 <Outlet />
             </Container>
         </Box>
         </>
            )}
        </Box>
    );
}
