import { useRef, useContext, useState } from "react"
import UserContext from "../../UserContext.jsx"
import styles from "./auth.module.css"

function Login(){
    const {logIn} = useContext(UserContext);
    const [error, setError] = useState({path : null, msg : null})
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    async function submit(e){
        e.preventDefault()
        if(usernameRef.current.value == ""){
            setError({path : "username", msg : "Fill this field before submitting"})
            return;
        }
        else if(passwordRef.current.value == ""){
            setError({path : "password", msg : "Fill this field before submitting"})
            return;
        }
        const res = await fetch('/api/auth/login', {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                "username" : usernameRef.current.value,
                "password" : passwordRef.current.value
            })
        })
        const result = await res.json()
        if(res.status == 200){
            logIn(result.user)
        }
        else if(res.status == 401){
            setError({path : "global", msg : result.message})
        }
    }
    return (
        <>
        <form noValidate className={styles.form} onSubmit={submit}>
            <div className={styles.table}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <div className={styles.input}>
                        <input type="text" id="username" name="username" ref={usernameRef} required/>
                        {(error.path === "username") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <div className={styles.input}>
                        <input type="password" id="password" name="password" ref={passwordRef} required/>
                        {(error.path === "password") && <p>{error.msg}</p>}
                    </div>
                </div>
            </div>
            <button type="submit">Login</button>
            {(error.path === "global") && <p className={styles.global}>{error.msg}</p>}
        </form>
        </>
    )
}

export default Login