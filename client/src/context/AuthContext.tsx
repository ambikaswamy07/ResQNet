import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);

    const [accessToken, setAccessToken] = useState<string | null>(
        null
    );

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        const storedUser = localStorage.getItem("user");

        if (token) {
            setAccessToken(token);
        }

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("accessToken", token);

        localStorage.setItem("user", JSON.stringify(user));

        setAccessToken(token);

        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");

        localStorage.removeItem("user");

        setUser(null);

        setAccessToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
                isAuthenticated: !!accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);