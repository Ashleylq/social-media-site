import { Outlet, useNavigation } from "react-router";
import Loader from "./components/loader/Loader.jsx";
import "./index.css"

function App(){
    const navigation = useNavigation()
    return (
        <>
        <div className="bg" aria-hidden="true"></div>
        <div className="content">
        {(navigation.state === "loading") && <Loader/>}
        {(navigation.state !== "loading") && <Outlet/>}
        </div>
        </>
    )
}

export default App