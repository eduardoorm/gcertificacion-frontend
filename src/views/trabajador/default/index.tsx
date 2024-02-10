import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate, useParams } from "react-router-dom";
import { Clase, TIPO_CLASE } from "../../../interfaces/entities";
import { RootState, getClasesByTrabajador, useAppDispatch, useAppSelector } from "../../../store";
import { useAPIData } from "../../../api/useAPIData";
import { useAuthUser } from 'react-auth-kit'
import HeaderTrabajadorView from "../header";
import moment from "moment";
import PaperClasses from "../../../components/PaperClasses/PaperClasses";
import { useSelector } from 'react-redux';

export default function ViewTrabajadorDefault(){
    //const { clases: clasesReducer } = useAppSelector((state:RootState) => state.clases);
    //const [inducciones, setInducciones] = React.useState<Clase[]>([]);
    //const [capacitaciones, setCapacitaciones] = React.useState<Clase[]>([]);
    //const [documentaciones, setDocumentaciones] = React.useState<Clase[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAuthUser();
    const clases = useAppSelector((state) => state.clases.clases.data);
    const { id, clienteId } = useParams();

    React.useEffect(() => {
        dispatch(getClasesByTrabajador(auth()?.id_trabajador || '0'));
    }, []);

    const handleClick = (event: React.MouseEvent<unknown>, clase: Clase) => {
        navigate(
            `/trabajador/${clase.tipo}/${clase.id}`,
            { replace: false }
        );
    };

    return (
        <Box component="main" sx={{width: '100%', }}>
            <HeaderTrabajadorView />

                {clases && clases.length > 0 && 
                (
                    <PaperClasses
                    clases={clases}  
                    actions={false}   
                    handleClick ={handleClick}                                        
                     />
                )}
        </Box>
    );
}