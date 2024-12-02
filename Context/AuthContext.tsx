import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister ?: (username: string, password: string) => Promise<any>;
    onLogin?: (username: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = 'http://192.168.1.66:5001/api';
const AuthContext = createContext<AuthProps>({
    authState: { token: null, authenticated: false }, // Provide a default state
    onRegister: async () => {}, // No-op functions for defaults
    onLogin: async () => {},
    onLogout: async () => {},
});


export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({ token: null, authenticated: null });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log('stored', token);

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true,
                });
            }
        };
        loadToken();
    }, []);

    const register = async (username: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/users`, { username, password });
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const login = async (username: string, password: string) => {
        try {

            const result = await axios.post(`${API_URL}/auth/login`, { username, password }); // Update endpoint here

            setAuthState({
                token: result.data.accessToken, // Ensure the key matches the backend's response
                authenticated: true,
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.accessToken}`;
            
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
            
            return result;

        } catch (e) {
            
            return { error: true, msg: (e as any).response.data.message }; // Use `message` to match your backend
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`); // Call the backend logout endpoint
            await SecureStore.deleteItemAsync(TOKEN_KEY);

            axios.defaults.headers.common['Authorization'] = '';

            setAuthState({
                token: null,
                authenticated: false,
            });
        } catch (e) {
            console.error('Logout failed:', e); // Log any errors during logout
        }
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
    };    

    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // Correct rendering
};
