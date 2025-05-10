import { API_ROUTES } from '../constants/apiRoutes';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentials {
    username: string;
}

interface AuthResponse {
    message?: string;
    token: string;
}

export const saveToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const removeToken = (): void => {
    localStorage.removeItem('token');
};

export const login = async (credentials: LoginCredentials): Promise<string> => {
    const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
    }

    return data.token;
};

export const register = async (credentials: RegisterCredentials): Promise<string> => {
    const response = await fetch(API_ROUTES.AUTH.REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Erreur d\'inscription');
    }

    return data.token;
};