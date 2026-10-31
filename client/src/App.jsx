import { Outlet, useNavigation } from "react-router";
import Loader from "./components/loader/Loader.jsx";
import "./index.css"
import Navbar from "./components/navbar/Navbar.jsx";
import { AudioProvider } from "./utils/audioContext.jsx";

function App(){
    const navigation = useNavigation()
    return (
        <>
        <AudioProvider>
            <div className="bg" aria-hidden="true"></div>
            <div className="content">
                <div className="navbar-container"><Navbar/></div>
                <main>
                {(navigation.state === "loading") && <Loader/>}
                {(navigation.state !== "loading") && <Outlet/>}
                </main>
            </div>
        </AudioProvider>
        </>
    )
}

export default App