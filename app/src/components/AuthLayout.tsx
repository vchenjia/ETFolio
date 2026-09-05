// DashboardLayout.jsx
import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="Auth-container">
            <aside>Sidebar Navigation</aside>

            <main>
                {/* The index element (DashboardHome) injects itself exactly here */}
                <Outlet />
            </main>
        </div>
    );
}
