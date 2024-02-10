import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import BoxClassActions from "../BoxClassActions/BoxClassActions";

const BoxClass = ({clase, actions, handleClick, handleEditClase, handleLoadImage, handleOpenDialogConfirmation}) => {
    return (
        <Grid item xs={6} key={clase.id}>
            <Card sx={{ display: "flex" }}>
                <CardActionArea onClick={(event) => handleClick(event, clase)}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <CardMedia
                            component="img"
                            height="194"
                            sx={{ objectFit: "cover", maxWidth: "256px" }}
                            image={clase.imagen}
                        />
                        <CardContent>
                            <Typography component="div" variant="h5">
                                {clase.titulo}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                component="div"
                            >
                                {clase.descripcion}
                            </Typography>
                        </CardContent>
                    </Box>
                </CardActionArea>

                {actions && (
                    <BoxClassActions 
                    handleEditClase={handleEditClase}
                    handleLoadImage={handleLoadImage}
                    handleOpenDialogConfirmation={handleOpenDialogConfirmation}/>
                )}
                
            </Card>
        </Grid>
    );
};

export default BoxClass;
