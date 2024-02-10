import React from "react";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ConstructionIcon from "@mui/icons-material/Construction";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {  TIPO_CLASE } from "../../interfaces/entities";
import SectionClass from "../SectionClass/SectionClass";

const PaperClasses = ({clases, actions, ...restProps}) => {
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
                    actions={actions}
                    tipo={TIPO_CLASE.INDUCCION}
                    titleTag="Inducción"
                    iconTag={<MenuBookIcon />}
                    handleClick={restProps.handleClick}
                    handleEditClase={restProps.handleEditClase}
                    handleLoadImage={restProps.handleLoadImage}
                    handleOpenDialogConfirmation={restProps.handleOpenDialogConfirmation}
                />
                <SectionClass
                    clases={clases}
                    actions={actions}
                    tipo={TIPO_CLASE.CAPACITACION}
                    titleTag="Capacitación"
                    iconTag={<ConstructionIcon />}
                    handleClick={restProps.handleClick}
                    handleEditClase={restProps.handleEditClase}
                    handleLoadImage={restProps.handleLoadImage}
                    handleOpenDialogConfirmation={restProps.handleOpenDialogConfirmation}
                />
                <SectionClass
                    clases={clases}
                    actions={actions}
                    tipo={TIPO_CLASE.DOCUMENTACION}
                    titleTag="Documentación"
                    iconTag={<PictureAsPdfIcon />}
                    handleClick={restProps.handleClick}
                    handleEditClase={restProps.handleEditClase}
                    handleLoadImage={restProps.handleLoadImage}
                    handleOpenDialogConfirmation={restProps.handleOpenDialogConfirmation}
                />
            </Grid>
        </Paper>
    );
};

export default PaperClasses;
