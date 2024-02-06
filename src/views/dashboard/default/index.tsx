import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {useIsAuthenticated} from 'react-auth-kit';

export default function DashboardDefault() {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();

    React.useEffect(() => {
        if(!isAuthenticated()){
            navigate('/login', {replace: false});
        }
    });

    return (
        <Box
            component="main" sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <main>
                <Box sx={{ 
                    bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900], 
                        pt: 8, 
                        pb: 6 }}
                    >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Global Certificaci&oacute;n
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            L&iacute;der en seguridad y salud en el trabajo
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                        </Stack>
                    </Container>
                </Box>
            </main>
        </Box>
    );
}