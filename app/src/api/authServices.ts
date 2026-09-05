import { api } from '../api/axios';
export async function registerUser(username: string, email: string, password: string) {
    const response = await api.post('/register', { username, email, password });
    return response.data;
}

export async function loginUser(username: string, password: string) {
    const response = await api.post('/login', { username, password });
    return response.data;
}

export async function logout() {
    const response = await api.post('/logout');
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get('/me');
    return response.data;
}