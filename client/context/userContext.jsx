import axios from "axios";
import { createContext, useState, useEffect } from "react";

const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
            axios.get("users/profile").then(({data})=>{
                console.log(data);
                setUser(data);
                
                if(data.error){ 
                    console.log("Something missing");
                    setUser(null);
                    setIsLoading(false);
                }
            }).catch(err=>{
                console.log("Something missing", err);
                    setUser(null);
                    setIsLoading(false);
            })
    }, []);
    console.log("Context: ",isLoading);
    return (
        <UserContext.Provider value={{user, setUser, isLoading}}>
            {children}
        </UserContext.Provider>
    )
} 

export default UserContext;