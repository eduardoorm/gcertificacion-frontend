import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './views/pages/Login';
import config from './config';
import { AuthProvider } from 'react-auth-kit';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <AuthProvider authType = {'cookie'}
                authName={'_auth'}
                cookieDomain={window.location.hostname}
                cookieSecure={window.location.protocol === "https:"}>
                <BrowserRouter basename={config.basename}>
                    <App />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);
