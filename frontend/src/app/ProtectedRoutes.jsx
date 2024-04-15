import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router";
const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    return token ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} />
    );
}
export default ProtectedRoute