import { type SubmitEvent, type ChangeEvent, useState } from "react";
import { loginUser } from "../api/authServices";
import { useNavigate } from "react-router";
import axios from "axios";

export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const changedField = e.target.name;
        const newValue = e.target.value;
        setFormData((currData) => {
            return {
                ...currData,
                [changedField]: newValue,
            }
        });
    };
    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await loginUser(formData.username, formData.password);
            navigate("/dashboard");
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
        <form onSubmit={handleSubmit}>
            <h1>Login Page</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="text" placeholder="Username" value={ formData.username } onChange={handleChange} name="username"/>
            <input type="password" placeholder="Password" value={ formData.password } onChange={handleChange} name="password"/>
            <button type="submit">Continue</button>
        </form>
    );

};