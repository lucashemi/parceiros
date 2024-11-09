import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Routes';
import GlobalStyles from './styles/global';
import { SnackbarContextProvider } from './context/SnackbarContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyles />
    <SnackbarContextProvider>
        <RouterProvider router={router} />
    </SnackbarContextProvider>
  </React.StrictMode>,
);