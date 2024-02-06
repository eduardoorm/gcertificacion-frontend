import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { RootState, useAppSelector } from "../../store";

export default function HeaderTrabajadorView() {
    const userAuthenticated = useAppSelector((state:RootState) => state.usuarios.userAuthenticated);
    
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} sx={{mb:3}}>
                <Grid item xs={2}>
                {userAuthenticated.logo && 
                    <img 
                        src={userAuthenticated.logo} 
                        alt={userAuthenticated.razon_social}
                        style={{
                            marginRight: '1rem'
                        }} 
                        width={'144px'} />}
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h4">
                        {userAuthenticated.razon_social}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        RUC: {userAuthenticated.ruc}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}