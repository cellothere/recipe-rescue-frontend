import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const { onLogin } = useAuth();
    const navigation = useNavigation();

    const login = async () => {
        const result = await onLogin!(username, password);
        if (result && result.error) {
            alert(result.msg);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="username"
                value={username}
                onChangeText={(text: string) => setusername(text)}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text: string) => setPassword(text)}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={login}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text
                style={styles.registerText}
                onPress={() => navigation.navigate('Register')}
            >
                Don't have an account? Click here to register
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#36c190',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerText: {
        color: '#36c190',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginTop: 15,
    },
});

export default Login;
