import { useState } from "react";
import { logout } from "../api/authServices";
import { useNavigate } from "react-router";
import axios from "axios";

export function Dashboard() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const HandleLogOut = async () => {
        setError(null);
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message;
                setError(msg)
            } else {
                setError("Something went wrong")
            }
        }
    };

    return (
        <>
            <h1>Dashboard Page</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={HandleLogOut}>Exit</button>
        </>
    );
};