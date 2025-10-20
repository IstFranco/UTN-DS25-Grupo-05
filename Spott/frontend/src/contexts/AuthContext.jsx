import { createContext, useState, useContext, useEffect } from 'react';
import {
    getToken,
    setToken,
    clearToken,
    parseJWT,
    getUserData,
    isTokenExpired
    } from '../helpers/auth';

    const AuthContext = createContext();

    export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token && !isTokenExpired()) {
        const userData = getUserData();
        setUser(userData);
        } else if (token) {
        clearToken();
        }
        setLoading(false);
    }, []);

    const login = async (email, password, userType) => {
        try {
        const url = userType === "empresa"
            ? import.meta.env.VITE_TM_API+"/api/empresas/login"
            : import.meta.env.VITE_TM_API+"/api/usuarios/login";

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { 
            success: false, 
            error: data.message || "Credenciales inválidas" 
            };
        }

        if (!data.token) {
            console.error('Backend no devolvió token:', data);
            return {
            success: false,
            error: "Error: no se recibió token del servidor"
            };
        }

        setToken(data.token);
        const userData = parseJWT(data.token);
        setUser(userData);

        return { 
            success: true,
            userType: userData.userType
        };
        } catch (error) {
        console.error('Error en login:', error);
        return { 
            success: false, 
            error: "No se pudo conectar al servidor" 
        };
        }
    };

    const register = async (formData, userType) => {
        try {
        const url = userType === "empresa"
            ? import.meta.env.VITE_TM_API+"/api/empresas/registro"
            : import.meta.env.VITE_TM_API+"/api/usuarios/registro";

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
            return { 
            success: false, 
            error: data.message || "Error en registro",
            details: data
            };
        }

        if (!data.token) {
            return {
            success: false,
            error: "Error: no se recibió token del servidor"
            };
        }

        setToken(data.token);
        const userData = parseJWT(data.token);
        setUser(userData);

        return { 
            success: true,
            userType: userData.userType
        };
        } catch (error) {
        return { 
            success: false, 
            error: "No se pudo conectar al servidor" 
        };
        }
    };

    const logout = () => {
        clearToken();
        setUser(null);
    };

    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
        if (isTokenExpired()) {
            logout();
        }
        }, 60000);

        return () => clearInterval(interval);
    }, [user]);

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isUsuario: user?.userType === 'usuario',
        isEmpresa: user?.userType === 'empresa',
        userType: user?.userType || null,
        userId: user?.userId || null,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
    }