import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useUser } from './UserContext'; // Import UserContext

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister ?: (username: string, password: string) => Promise<any>;
    onLogin?: (username: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = process.env.EXPO_PUBLIC_API_URL;
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
    const { setUser } = useUser(); // Access the setUser function from UserContext
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({ token: null, authenticated: null });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true,
                });
                // Fetch user details with the token
                const userResponse = await axios.get(`${API_URL}/auth/user`);
                setUser(userResponse.data); // Update the user in UserContext
            }
        };
        
        loadToken();
    }, []);


    const register = async (username: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/users`, { username, password });
            // Automatically log in after successful registration
            await login(username, password);
            const userResponse = await axios.get(`${API_URL}/users/username/${username}`);
            setUser(userResponse.data); // Update the user in UserContext
            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/auth/login`, { username, password });
            setAuthState({
                token: result.data.accessToken,
                authenticated: true,
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.accessToken}`;
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);

            // Fetch and set the user details
            const userResponse = await axios.get(`${API_URL}/users/username/${username}`);
            setUser(userResponse.data); // Update the user in UserContext
            
            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.message };
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`);
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            axios.defaults.headers.common['Authorization'] = '';
            setAuthState({
                token: null,
                authenticated: false,
            });
            setUser(null); // Clear user data in UserContext
        } catch (e) {
            console.error('Logout failed:', e);
        }
    };

    return (
        <AuthContext.Provider value={{ onRegister: register, onLogin: login, onLogout: logout, authState }}>
            {children}
        </AuthContext.Provider>
    );
};