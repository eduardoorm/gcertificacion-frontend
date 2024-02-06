import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ConstructionIcon from '@mui/icons-material/Construction';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

interface PropsMenu {
    title: string
}

export function AdminListItems () {
    const navigate = useNavigate();
    const handleClick = (path: string) => {
        navigate(path, {replace: false})
    };

    return (
        <React.Fragment>
            <ListSubheader component="div" inset>
                Administraci&oacute;n
            </ListSubheader>
            <ListItemButton onClick={() => handleClick('/')}>
                <ListItemIcon>
                    <HomeIcon sx={{color: 'secondary.main'}} />
                </ListItemIcon>
                <ListItemText primary="Inicio" />
            </ListItemButton>
            <ListItemButton onClick={() => handleClick('/admin/clientes')}>
                <ListItemIcon>
                    <PeopleIcon sx={{color: 'secondary.main'}} />
                </ListItemIcon>
                <ListItemText primary="Clientes" />
            </ListItemButton>
            <ListItemButton onClick={() => handleClick('/admin/banco-preguntas')}>
                <ListItemIcon>
                    <QuizIcon sx={{color: 'secondary.main'}} />
                </ListItemIcon>
                <ListItemText primary="Banco de preguntas" />
            </ListItemButton>
            <ListItemButton onClick={() => handleClick('/admin/informes')}>
                <ListItemIcon>
                    <QuizIcon sx={{color: 'secondary.main'}} />
                </ListItemIcon>
                <ListItemText primary="Informes" />
            </ListItemButton>
        </React.Fragment>
    );
}

export function TrabajadorListItems (props: PropsMenu) {
    const { title } = props;
    const navigate = useNavigate();
    const handleClick = (path: string) => {
        navigate(path, {replace: false})
    };
    
    return (
    
    <React.Fragment>
        <ListSubheader component="div" inset>
            {title}
        </ListSubheader>
        <ListItemButton onClick={() => handleClick('/trabajador/default')}>
            <ListItemIcon>
                <HomeIcon sx={{color: 'secondary.main'}} />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
        </ListItemButton>
        <ListItemButton onClick={() => handleClick('/trabajador/induccion')}>
            <ListItemIcon>
                <MenuBookIcon sx={{color: 'secondary.main'}} />
            </ListItemIcon>
            <ListItemText primary="Inducción" />
        </ListItemButton>
        <ListItemButton onClick={() => handleClick('trabajador/capacitacion')}>
            <ListItemIcon>
                <ConstructionIcon sx={{color: 'secondary.main'}} />
            </ListItemIcon>
            <ListItemText primary="Capacitación" />
        </ListItemButton>
        <ListItemButton alignItems='flex-start' onClick={() => handleClick('trabajador/documentacion')}>
            <ListItemIcon>
                <PictureAsPdfIcon sx={{color: 'secondary.main'}} />
            </ListItemIcon>
            <ListItemText disableTypography>
                <Typography sx={{ display: 'inline' }} component="span" variant="body1" color="text.primary">
                    Sistema de gestión<br/>SST
                </Typography>
            </ListItemText>
        </ListItemButton>
    </React.Fragment>
);
}

export function EmpresaListItems () {
    const navigate = useNavigate();
    const handleClick = (path: string) => {
        navigate(path, {replace: false})
    };

    return (
        <React.Fragment>
            <ListSubheader component="div" inset>
                Empresa
            </ListSubheader>
            <ListItemButton>
                <ListItemIcon>
                    <AssignmentIcon sx={{color: 'secondary.main'}} />
                </ListItemIcon>
                <ListItemText primary="Inicio" />
            </ListItemButton>
        </React.Fragment>
    );
}