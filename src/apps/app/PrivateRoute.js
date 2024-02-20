import React, {useState} from 'react';
import {Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isAuthenticated_ = useState(false);
    const isAuthenticated = true;

    return isAuthenticated ? <Outlet /> : <Navigate to="login" />;
};

export default PrivateRoute;