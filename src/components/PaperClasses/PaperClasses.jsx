import React from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ConstructionIcon from "@mui/icons-material/Construction";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {  TIPO_CLASE } from "../../interfaces/entities";
import SectionClass from "../SectionClass/SectionClass";

const PaperClasses = ({clases, handleClick, handleEditClase, handleLoadImage, handleOpenDialogConfirmation}) => {
    return (
        <Paper sx={{ width: "100%", mt: 3, mb: 2, p: 2 }} elevation={3}>
            <Grid
                container
                spacing={2}
                direction={"row"}
                justifyContent={"flex-end"}
                alignItems={"center"}
            >
                <SectionClass
                    clases={clases}
                    tipo={TIPO_CLASE.INDUCCION}
                    titleTag="Inducción"
                    iconTag={<MenuBookIcon />}
                    handleClick={handleClick}
                    handleEditClase={handleEditClase}
                    handleLoadImage={handleLoadImage}
                    handleOpenDialogConfirmation={handleOpenDialogConfirmation}
                />
                <SectionClass
                    clases={clases}
                    tipo={TIPO_CLASE.CAPACITACION}
                    titleTag="Capacitación"
                    iconTag={<ConstructionIcon />}
                    handleClick={handleClick}
                    handleEditClase={handleEditClase}
                    handleLoadImage={handleLoadImage}
                    handleOpenDialogConfirmation={handleOpenDialogConfirmation}
                />
                <SectionClass
                    clases={clases}
                    tipo={TIPO_CLASE.DOCUMENTACION}
                    titleTag="Documentación"
                    iconTag={<PictureAsPdfIcon />}
                    handleClick={handleClick}
                    handleEditClase={handleEditClase}
                    handleLoadImage={handleLoadImage}
                    handleOpenDialogConfirmation={handleOpenDialogConfirmation}
                />
            </Grid>
        </Paper>
    );
};

export default PaperClasses;
