import {Card,CardActionArea,CardContent,CardMedia,Grid,Typography} from "@mui/material";
import React from "react";
import CardClassInfoWorker from "../CardClassInfoWorker/CardClassInfoWorker";
import { useNavigate } from "react-router-dom";
import '../CardClassWorker/CardClassWorker.css'
const CardClassWorker = ({ classWorker, disponible, fechaInicio }) => {
    const navigate = useNavigate();
    let destinationPath;
    if(classWorker.section){
        destinationPath = `/trabajador/${classWorker.path}`;
    }else{
        destinationPath = `/trabajador/${classWorker.tipo}/${classWorker.id}`;
    }

    return (
        <Card sx={{ border: "0px solid"}} className="cardClassWorker">
            <CardActionArea
                sx={{
                    
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent:"start",
                    flexWrap: "wrap",
                }}
         
                onClick={() => navigate(destinationPath, { replace: false })}
                disabled={!disponible}
            >
                <CardClassInfoWorker
                    image={classWorker.imagen}
                    classWorker={classWorker}
                    disponible={disponible}
                    fechaInicio={fechaInicio}
                />
            </CardActionArea>
        </Card>
    );
};

export default CardClassWorker;
