import { Box, CardContent, CardMedia, Typography } from "@mui/material";
import '../CardClassInfoWorker/CardClassInfoWorker.css'
import React from "react";

const CardClassInfoWorker = ({ image, classWorker, disponible }) => {
    return (
        <>
            <CardMedia
                className="cardClassInfoWorkerMedia"
                component="img"
                sx={{ width: "100%",height:"250px", objectPosition:"top"}}
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
