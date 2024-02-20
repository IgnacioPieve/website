import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './apps/home';
import PrivateRoute from './apps/app/PrivateRoute';
import Login from './apps/app/Login';
import Table from './apps/app/Table';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="" element={<Home/>}/>

                <Route path="app">
                    <Route path="" element={<Navigate to="table"/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route element={<PrivateRoute/>}>
                        <Route path="table" element={<Table/>}/>
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;