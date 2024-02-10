import BoxClass from "../BoxClass/BoxClass";
import Grid from "@mui/material/Grid";
import Tag from "../Tag/Tag";

const SectionClass = ({ clases,actions, tipo, titleTag = "", iconTag, handleClick, handleEditClase, handleLoadImage, handleOpenDialogConfirmation}) => 
{
    return (
        <>
            {clases &&
                clases.filter((clase) => clase.tipo === tipo).length > 0 && 
                (
                    <>
                    <Tag label={titleTag} icon={iconTag} />
                    <Grid
                    container
                    spacing={2}
                    sx={{
                        m: 2,
                        pb: 2,
                        backgroundColor: "#E7EBF0",
                        borderRadius: 1,
                    }}
                    direction={"row"}
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    >
                        {clases.filter((clase) => clase.tipo === tipo).map((clase) => 
                        {
                                return (
                                    <BoxClass
                                        key={clase.id}
                                        clase={clase}
                                        actions={actions}
                                        handleClick={handleClick}
                                        handleEditClase={handleEditClase}
                                        handleLoadImage={handleLoadImage}
                                        handleOpenDialogConfirmation={handleOpenDialogConfirmation}
                                    />
                                );
                            })}
                    </Grid>
                    </>
                )
            }
        </>
    );
};

export default SectionClass;
