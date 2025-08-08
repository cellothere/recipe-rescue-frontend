import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useUser } from './UserContext'; // Import UserContext
import LoadingIcon from '../components/LoadingIcon';

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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync(TOKEN_KEY);
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    try {
                        const userResponse = await axios.get(`${API_URL}/auth/user`);
                        setAuthState({ token, authenticated: true });
                        setUser(userResponse.data);
                    } catch (e) {
                        console.error('Token invalid or expired:', e);
                        await SecureStore.deleteItemAsync(TOKEN_KEY);
                        setAuthState({ token: null, authenticated: false });
                    }
                } else {
                    setAuthState({ token: null, authenticated: false });
                }
            } catch (e) {
                console.error('Error loading token:', e);
            } finally {
                setLoading(false);
            }
        };
        
    
        loadToken();
    }, []);
    
    if (loading) {
        return < LoadingIcon />; // Show a spinner or placeholder while loading
    }
    


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
            console.log("successs")
            setAuthState({
                token: result.data.accessToken,
                authenticated: true,
            });
            setUser(result.data.user)
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.accessToken}`;
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.message };
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            delete axios.defaults.headers.common['Authorization'];
            setAuthState({ token: null, authenticated: false });
            setUser(null); // Clear user data
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