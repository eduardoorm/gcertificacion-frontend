import * as React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Routes from './routes';
import 'moment/locale/es';
import { StyledEngineProvider,CssBaseline } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <CssBaseline />
                        <Routes />
                    </PersistGate>
                </Provider>
            </LocalizationProvider>
        </StyledEngineProvider>
    );
};
  
export default App;