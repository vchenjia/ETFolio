import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { getCurrentUser } from "../api/authServices";

export default function ProtectedRoute() {
    const [isLoading, setisLoading] = useState<boolean>(true);
    const [isAuthenticated, setisAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        async function checkAuth() {
            try {
                await getCurrentUser();
                setisAuthenticated(true);
            } catch (err) {
                setisAuthenticated(false);
            } finally {
                setisLoading(false);
            }
        }
        checkAuth();
    }, []);
    
    if (isLoading) {
        return (<div> Loading... </div>)
    }
    if (!isAuthenticated) { 
        return <Navigate to="/login"/>;
    }
    return (
        <div className="Auth-container">
            <aside>Sidebar Navigation</aside>
            <main>
                <Outlet />
            </main>
        </div>
    );
}


