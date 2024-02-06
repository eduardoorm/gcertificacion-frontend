
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Login from '../views/pages/Login';
import MainRoutes from './MainRoutes';

export default function ThemeRoutes() {
    return useRoutes([{
        path: '/login',
        element: <Login />
        },
        MainRoutes
    ]);
}