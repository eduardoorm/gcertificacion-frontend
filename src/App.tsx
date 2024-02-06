import * as React from 'react';
import { StyledEngineProvider } from "@mui/material";
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { PersistGate } from 'redux-persist/integration/react';
import CssBaseline from '@mui/material/CssBaseline';
import Routes from './routes';
import 'moment/locale/es';

const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        <Routes />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        </StyledEngineProvider>
    );
};
  
export default App;