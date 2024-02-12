import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { RootState, useAppSelector } from "../../store";
import "../header/header.css"

export default function HeaderTrabajadorView() {
    const userAuthenticated = useAppSelector((state:RootState) => state.usuarios.userAuthenticated);

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container  sx={{mb:3, display:"flex", flexWrap:"wrap", flexDirection:{xs:"column",md:"row"}, justifyContent:"space-around", alignItems:"center"}}>
                <Grid item xs={3} sm={2}  className="containerImgHeader" >
                {userAuthenticated.logo && 
                    <img 
                        className="imgHeader"
                        src={userAuthenticated.logo} 
                        alt={userAuthenticated.razon_social}
                       />}
                </Grid>
                <Grid item xs={8} sm={9} className="containerTextHeader" >
                    <p className="titleHeader">
                        {userAuthenticated.razon_social}
                    </p>
                    <p className="rucHeader">
                        RUC: {userAuthenticated.ruc}
                    </p>
                </Grid>
            </Grid>
        </Box>
    );
}