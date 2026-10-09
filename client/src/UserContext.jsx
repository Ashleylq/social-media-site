import { createContext } from "react";

const UserContext = createContext({
    user : {},
    logIn : () => {},
    getCredentials : () => {},
    logOut : () => {}
})

export default UserContext