'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get('/api/auth/me')
            .then((res) => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        setUser(res.data);
        router.push('/properties');
    }, [router]);

    const logout = useCallback(async () => {
        await api.post('/api/auth/logout');
        setUser(null);
        router.push('/login');
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
