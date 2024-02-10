import { Box, IconButton } from "@mui/material";
import React from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const BoxClassActions = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                pr: 1,
                pt: 1,
                flexDirection: "column",
            }}
        >
            <IconButton onClick={(event) => handleEditClase(event, clase)}>
                <EditIcon />
            </IconButton>
            <IconButton onClick={(event) => handleLoadImage(event, clase)}>
                <AddPhotoAlternateIcon />
            </IconButton>
            <IconButton
                onClick={(event) => handleOpenDialogConfirmation(event, clase)}>
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

export default BoxClassActions;
