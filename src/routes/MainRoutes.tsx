import React from "react";
import { lazy } from "react";
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import PrivateRoute from "./PrivateRoute";

const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/default')));

//Admin
const AdminDefault = Loadable(lazy(() => import('../views/admin/default')));
const AdminClientes = Loadable(lazy(() => import('../views/admin/clientes')));
const AdminCliente = Loadable(lazy(() => import('../views/admin/clientes/id')));
const AdminPeriodo = Loadable(lazy(() => import('../views/admin/periodos/id')));
const AdminClase = Loadable(lazy(() => import('../views/admin/clase/id')));
const AdminBancosPreguntas = Loadable(lazy(() => import('../views/admin/bancoPreguntas')));
const AdminBancoPreguntas = Loadable(lazy(() => import('../views/admin/bancoPreguntas/id')));
const AdminInformes = Loadable(lazy(() => import('../views/admin/informes')));
const AdminInformesClientes = Loadable(lazy(() => import('../views/admin/informes/clientes')));

//Clientes
const EmpresaDefault = Loadable(lazy(() => import('../views/empresa/default')));

//Trabajadores
const TrabajadorDefault = Loadable(lazy(() => import('../views/trabajador/default')));
const TrabajadorInduccion = Loadable(lazy(() => import('../views/trabajador/induccion')));
const TrabajadorCapacitacionDefault = Loadable(lazy(() => import('../views/trabajador/capacitacion')));
const TrabajadorInduccionDefault = Loadable(lazy(() => import('../views/trabajador/induccion/default')));

const TrabajadorCapacitacion = Loadable(lazy(() => import('../views/trabajador/capacitacion/id')));
const TrabajadorDocumentacion = Loadable(lazy(() => import('../views/trabajador/documentacion')));
const TrabajadorDocumentacionDefault = Loadable(lazy(() => import('../views/trabajador/documentacion/default')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
    {
        path: '/',
        element: <DashboardDefault /> 
    },
    {
        path: 'admin',
        children: [{
            path: 'default',
            element: <PrivateRoute><AdminDefault/></PrivateRoute>
        }, {
            path: 'clientes',
            element: <PrivateRoute><AdminClientes/></PrivateRoute>
        }, {
            path: 'clientes/:id',
            element: <PrivateRoute><AdminCliente/></PrivateRoute>
        }, {
            path: 'clientes/:clienteId/periodos/:id',
            element: <PrivateRoute><AdminPeriodo/></PrivateRoute>
        }, {
            path: 'clientes/:clienteId/periodos/:periodoId/clases/:id',
            element: <PrivateRoute><AdminClase/></PrivateRoute>
        }, {
            path: 'banco-preguntas',
            element: <PrivateRoute><AdminBancosPreguntas/></PrivateRoute>
        }, {
            path: 'banco-preguntas/:id',
            element: <PrivateRoute><AdminBancoPreguntas/></PrivateRoute>
        }, {
            path: 'informes',
            element: <PrivateRoute><AdminInformes/></PrivateRoute>
        }, {
            path: 'informes/clientes/:id',
            element: <PrivateRoute><AdminInformesClientes /></PrivateRoute>
        }]
    }, 
    {
        path: 'empresa',
        children: [{
            path: 'default/:id',
            element: <PrivateRoute><EmpresaDefault/></PrivateRoute>
        }]
    }, 
    {
        path: 'trabajador',
        children: [{
            path: 'default',
            element: <PrivateRoute><TrabajadorDefault/></PrivateRoute>
        }, {
            path: 'induccion',
            element: <PrivateRoute><TrabajadorInduccionDefault/></PrivateRoute>
        }
        , {
            path: 'induccion/:id',
            element: <PrivateRoute><TrabajadorInduccion/></PrivateRoute>
        },
        {
            path: 'capacitacion',
            element: <PrivateRoute><TrabajadorCapacitacionDefault/></PrivateRoute>
        }, {
            path: 'capacitacion/:id',
            element: <PrivateRoute><TrabajadorCapacitacion/></PrivateRoute>
        }, {
            path: 'documentacion',
            element: <PrivateRoute><TrabajadorDocumentacionDefault/></PrivateRoute>
        }
        , {
            path: 'documentacion/:id',
            element: <PrivateRoute><TrabajadorDocumentacion/></PrivateRoute>
        }
    ]
    }]
}

export default MainRoutes;