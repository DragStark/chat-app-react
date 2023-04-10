import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config.js';
import { onAuthStateChanged } from 'firebase/auth';
import { Spin } from 'antd';

export const AuthContext = React.createContext()
export default function AuthProvider({children}) {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            if(user){
                const { displayName, email, uid, photoURL} = user;
                setUser({ displayName, email, uid, photoURL});
                setIsLoading(false);
                navigate('/');
                return;
            }else{
                setIsLoading(false);
                navigate('/login');
            }
        })
        //clean function
        return () => {
            unsubscribed();
                
        }
    },[navigate])
    
    return (
        <AuthContext.Provider value={{ user }}>
            { isLoading ? <Spin/> : children}
        </AuthContext.Provider>
    )
}
    