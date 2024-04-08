import { Axios } from "axios";
import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios";

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [currentUser, SetCurrentUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    const login = async (inputs) => {
        const res = await makeRequest.post("login/", inputs, { withCredentials: true });
        SetCurrentUser(res.data);
        console.log("login")
    }

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser))
        localStorage.setItem('loginTime', Date.now());
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login }}>
            {children}
        </AuthContext.Provider>
    )
} 