import { useRouteError } from "react-router"
import styles from "./errorBoundary.module.css"

export default function ErrorBoundary(){
    const error = useRouteError()
    const errorStatus = error.status
    const errorMsg = (error.status === 404) ? "Oops! Looks like the resource you are looking for doesn't exist" : "Oops! Looks like there has been an error on our side"
    return (
        <div className={styles.errorBoundary}>
            Error {errorStatus}
            <p>{errorMsg}</p>
        </div>
    )
}