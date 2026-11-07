import { useRouteError } from "react-router"
import styles from "./errorBoundary.module.css"

export default function ErrorBoundary(){
    const error = useRouteError()
    const errorStatus = error.status
    let errorMsg = "Oops! Looks like there has been an error on our side"
    if(errorStatus === 404){
        errorMsg = "Oops! Looks like the resource you are looking for does not exist"
    }
    else if(errorStatus === 403){
        errorMsg = "Oops! Looks like you are not authorized to perform this action"
    }
    return (
        <div className={styles.errorBoundary}>
            Error {errorStatus}
            <p>{errorMsg}</p>
        </div>
    )
}