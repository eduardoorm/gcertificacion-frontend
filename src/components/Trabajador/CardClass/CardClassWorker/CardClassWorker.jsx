import {Card,CardActionArea,CardContent,CardMedia,Grid,Typography} from "@mui/material";
import React from "react";
import Image from "../../../../assets/images/test.png";
import CardClassInfoWorker from "../CardClassInfoWorker/CardClassInfoWorker";
import { useNavigate } from "react-router-dom";

const CardClassWorker = ({ classWorker, disponible }) => {
    const navigate = useNavigate();
    const destinationPath = `/trabajador/${classWorker.tipo}/${classWorker.id}`;

    return (
        <Card sx={{ border: "0px solid"}}>
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
                    image={Image}
                    classWorker={classWorker}
                    disponible={disponible}
                />
            </CardActionArea>
        </Card>
    );
};

export default CardClassWorker;
