import Cookies from 'js-cookie';
import axios from 'axios';

const axiosWithAuth = () => {
    const token = Cookies.get('token');
    return axios.create({
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Post to /api/register/
export const register = async (registerData: any) => {
    try {
        const response = await axios.post('/api/register/', registerData);
        const { token, user_id, email, username } = response.data;
        Cookies.set('token', token);
        return { id: user_id, email, username };
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            const errorMessages = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`);
            return { status: 'error', errorMessages };
        }
        console.error("Registration error", error);
        throw error;
    }
};

// Post to /api/login/
export const login = async (loginData: { email: string; password: string; }) => {
    try {
        const response = await axios.post('/api/login/', loginData);
        const { token, user_id, email, username } = response.data;
        Cookies.set('token', token);
        return { id: user_id, email, username };
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            const errorMessages = Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`);
            return { status: 'error', errorMessages };
        }
        console.error("Login error", error);
        throw error;
    }
};

// Post to /api/logout/
export const logout = async () => {
    try {
        const response = await axiosWithAuth().post("/api/logout/");
        Cookies.remove('token');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// Get from /api/reauth/
export const reauthenticate = async () => {
    try {
        const response = await axiosWithAuth().get("/api/reauth/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
