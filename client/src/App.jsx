import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import UserContext from "./UserContext.jsx"

function App(){
    const [user, setUser] = useState({});
    const logIn = (user) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    }
    const getCredentials = async () => {
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
        async function runAsync(){
            await getCredentials();
        }
        runAsync()
    }, [])
    return (
        <UserContext.Provider value={{user, logIn, getCredentials, logOut}}>
            <Signup/>
        </UserContext.Provider>
    )
}

export default App