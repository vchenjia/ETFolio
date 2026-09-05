import { Routes, Route } from "react-router";
import './app.css';

import { Dashboard } from "./pages/DashboardPage";
import { Register } from "./pages/RegisterPage";
import { Login } from "./pages/LoginPage";
import { Home } from "./pages/Home";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            <Route index element={<Home />} />

            <Route element={<AuthLayout />}>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
            </Route>

            <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
    )
};
