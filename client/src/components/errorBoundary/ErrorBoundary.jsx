import { useRouteError } from "react-router"

export default function ErrorBoundary(){
    const error = useRouteError()
    const errorStatus = error.status
    const errorMsg = (error.status === 404) ? "Oops! Looks like the resource you are looking for doesn't exist" : "Oops! Looks like there has been an error on our side"
    return (
        <>
        <p style={{
            fontFamily : "Cherry Bomb One",
            fontSize : "2rem",
            marginLeft : "auto",
            marginRight : "auto",
            marginTop : "35vh",
            textAlign : "center"
        }}>ERROR: {errorStatus} <br/> {errorMsg}</p>
        </>
    )
}