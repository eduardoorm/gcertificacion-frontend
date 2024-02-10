import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const BoxClass = ({clase, handleClick, handleEditClase, handleLoadImage, handleOpenDialogConfirmation}) => {
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        pr: 1,
                        pt: 1,
                        flexDirection: "column",
                    }}
                >
                    <IconButton
                        onClick={(event) => handleEditClase(event, clase)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={(event) => handleLoadImage(event, clase)}
                    >
                        <AddPhotoAlternateIcon />
                    </IconButton>
                    <IconButton
                        onClick={(event) =>
                            handleOpenDialogConfirmation(event, clase)
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Card>
        </Grid>
    );
};

export default BoxClass;
