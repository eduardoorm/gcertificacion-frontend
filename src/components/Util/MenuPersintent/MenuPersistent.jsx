import { Divider, Drawer } from "@mui/material";
import React from "react";
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import List from '@mui/material/List';
import { AdminListItems, EmpresaListItems, TrabajadorListItems } from "../../../layout/MainLayout/listItems";
import styled from "@emotion/styled";
import { TIPO_USUARIO } from '../../../interfaces/entities';

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }));

const MenuPersistent = ({openAppBar,brand,toggleDrawer,userAuthenticated}) => {
    return (
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
            open={openAppBar}
        >
            {/*Ecabezado Menú*/}
            <DrawerHeader>
                <img src={brand} alt="Global Certificación" width={"75%"} />
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>

            <Divider />
            {/*Lista Items Menú en caso sea ADMIN, TRABAJADOR O EMPRESA*/}
            {openAppBar && (
                <List>
                    {userAuthenticated.tipo === TIPO_USUARIO.ADMIN && (
                        <AdminListItems />
                    )}
                    {userAuthenticated.tipo === TIPO_USUARIO.ADMIN && (
                        <Divider sx={{ my: 1 }} />
                    )}
                    {userAuthenticated.tipo === TIPO_USUARIO.TRABAJADOR && (
                        <TrabajadorListItems title="" />
                    )}
                    {userAuthenticated.tipo === TIPO_USUARIO.TRABAJADOR && (
                        <Divider sx={{ my: 1 }} />
                    )}
                    {userAuthenticated.tipo === TIPO_USUARIO.EMPRESA && (
                        <EmpresaListItems />
                    )}
                </List>
            )}
        </Drawer>
    );
};

export default MenuPersistent;
