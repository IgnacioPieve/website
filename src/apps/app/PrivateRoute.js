import React, {useState} from 'react';
import {Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie'

const PrivateRoute = () => {
    const [cookies] = useCookies(['user'])
    const isAuthenticated = !!cookies.token;

    return isAuthenticated ? <Outlet /> : <Navigate to="login" />;
};

export default PrivateRoute;