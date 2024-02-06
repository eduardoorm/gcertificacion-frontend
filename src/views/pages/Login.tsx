import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { gcertificacionApi } from '../../api/gcertificacionApi';
import { useSignIn } from 'react-auth-kit';
import { Alert } from '@mui/material';
import { AxiosError } from 'axios';
import { setUserAuthenticated, useAppDispatch } from '../../store';
import { TIPO_USUARIO, UserAuthenticated } from '../../interfaces/entities/Usuario';
import logo from '../../assets/images/logo.png';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://gcertificacion.pe/">
                Global Certificaci&oacute;n
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Login() {
    
    const navigate = useNavigate();
    //const [authenticated, setauthenticated] = React.useState(false);
    const [error, seterror] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const dispatch = useAppDispatch();
    const signIn = useSignIn();
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data_ = new FormData(event.currentTarget);
        const data = {
            usuario: data_.get('usuario')!.toString(),
            password: data_.get('password')!.toString(),
        }
        
        console.log("data " + data)
        try {

            const response = await gcertificacionApi.post('/auth/login', data);
            console.log("response " + response)
            const userAuthenticated: UserAuthenticated = {
                id_trabajador: response.data.data.id_trabajador,
                id_empresa_cliente: response.data.data.id_empresa_cliente,
                razon_social: response.data.data.razon_social,
                ruc: response.data.data.ruc,
                logo: response.data.data.logo,
                nombres: response.data.data.nombres,
                apellidos: response.data.data.apellidos,
                usuario: data.usuario,
                tipo: response.data.data.tipo,
                token: response.data.data.token,
                tokenType: response.data.data.tokenType,
                recargar_lista_clientes:true,
            }

            signIn({
                token: response.data.data.token,
                expiresIn: response.data.data.expiresIn,
                tokenType: response.data.data.tokenType,
                authState: userAuthenticated,
            });
            dispatch(setUserAuthenticated(userAuthenticated));
            
            localStorage.setItem('token', JSON.stringify({tokenType: userAuthenticated.tokenType, token: userAuthenticated.token}));

            if(response.data.data.tipo === TIPO_USUARIO.TRABAJADOR){
                navigate('/trabajador/default', {replace: false});
            }
            else if(response.data.data.tipo === TIPO_USUARIO.ADMIN){
                navigate('/', {replace: false});
            }
            else if(response.data.data.tipo === TIPO_USUARIO.EMPRESA){
                navigate('/empresa/default/' + response.data.data.id_empresa_cliente, {replace: false});
            }
            //navigate('/', {replace: false});


        } catch (err) {
            if (err && err instanceof AxiosError){
                seterror(true);
                setErrorMessage(err.response?.data.statusText);
            }
            else if (err && err instanceof Error) setErrorMessage(err.message);
      
            console.log("Error: ", err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Avatar sx={{ m: 1, bgcolor: 'rgba(0, 0, 0, 0)' }}>
                    <img src={logo} alt="Global Certificación" width={'90%'} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Global Certificaci&oacute;n
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        required
                        margin="normal"
                        fullWidth
                        id="usuario"
                        label="Usuario"
                        name="usuario"
                        autoFocus
                    />
                    <TextField
                        required
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Ingresar
                    </Button>
                </Box>
            </Box>
            {error && <Alert severity="error">{errorMessage}</Alert>}
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
  );
}