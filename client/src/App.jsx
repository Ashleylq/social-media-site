import Login from "./pages/auth/Login.jsx"
import Signup from "./pages/auth/Signup.jsx"
import UserContext from "./UserContext.jsx"
import { useEffect, useState } from "react";

function App(){
    const [user, setUser] = useState({});
    const logIn = (user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    }
    const getCredentials = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user){
            return;
        }
        setUser(user);
    }
    const logOut = () => {
        setUser({});
        localStorage.clear();
    }
    useEffect(() => {
        getCredentials();
    }, [])
    return (
        <UserContext.Provider value={{user, logIn, getCredentials, logOut}}>
            <Login/>
        </UserContext.Provider>
    )
}

export default App