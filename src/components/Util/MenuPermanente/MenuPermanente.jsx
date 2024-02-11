
import React from "react";
import { Divider, Toolbar } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import { AdminListItems, EmpresaListItems, TrabajadorListItems } from "../../../layout/MainLayout/listItems";
import styled from "@emotion/styled";
import { TIPO_USUARIO } from '../../../interfaces/entities';
import MuiDrawer from '@mui/material/Drawer';

const MenuPermanente = ({openAppBar,brand,toggleDrawer,userAuthenticated})=> {

const drawerWidth= 240;
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

  return (
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
  )
}

export default MenuPermanente