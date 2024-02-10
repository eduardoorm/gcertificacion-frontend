import React from "react";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";
import { Clase, TIPO_CLASE } from "../../../interfaces/entities";
import { getClasesByTrabajador, useAppDispatch, useAppSelector } from "../../../store";
import { useAuthUser } from 'react-auth-kit'
import HeaderTrabajadorView from "../header";
import PaperClasses from "../../../components/PaperClasses/PaperClasses";

export default function ViewTrabajadorDefault(){

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const auth = useAuthUser();
    const clases = useAppSelector((state) => state.clases.clases.data);

    React.useEffect(() => {
        dispatch(getClasesByTrabajador(auth()?.id_trabajador || '0'));
    }, []);

    const handleClick = (event: React.MouseEvent<unknown>, clase: Clase) => {
        if(clase.tipo==TIPO_CLASE.DOCUMENTACION){
            navigate(
                `/trabajador/documentacion`,
                { replace: false }
            );
        }else if(clase.tipo==TIPO_CLASE.INDUCCION){
            navigate(
                `/trabajador/induccion`,
                { replace: false }
            );
        }else if(clase.tipo==TIPO_CLASE.CAPACITACION){
            navigate(
                `/trabajador/${clase.tipo}/${clase.id}`,
                { replace: false }
            );
        }
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