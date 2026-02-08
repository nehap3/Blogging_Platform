import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const { data } = await axios.get("/api/auth/profile");
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post("/api/auth/login", { email, password });
        setUser(data);
        // Reload to update state or just set user. We rely on cookie so next requests work.
        // For manual user setting we just set it here.
    };

    const register = async (name, email, password) => {
        const { data } = await axios.post("/api/auth/register", { name, email, password });
        setUser(data);
    };

    const logout = async () => {
        await axios.post("/api/auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
