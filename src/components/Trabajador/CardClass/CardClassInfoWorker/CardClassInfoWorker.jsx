import { Box, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";

const CardClassInfoWorker = ({ image, classWorker, disponible }) => {
    return (
        <>
            <CardMedia
                component="img"
                sx={{ width: "100%",height:"70%"}}
                image={image}
            />
            <CardContent
                sx={{height:"30%"}}
            >
                <div>
                <Typography 
                gutterBottom 
                variant="h5" 
                >
                    {classWorker.titulo}
                </Typography>
                
                <Typography 
                variant="body2" 
                color="text.secondary">
                    {classWorker.descripcion}
                </Typography>
                </div>
                

                {!disponible && (
                    <Typography 
                    variant="body2" 
                    color="text.secondary">
                        Disponible desde: {fecha_inicio.format("DD/MM/YYYY")}
                    </Typography>
                )}
            </CardContent>
        </>
    );
};

export default CardClassInfoWorker;
