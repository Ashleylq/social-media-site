import { useState, useRef, useContext } from "react"
import styles from "./auth.module.css"
import UserContext from "../../UserContext"

function Signup(){
    const {logIn} = useContext(UserContext)
    const emailRef = useRef(null)
    const usernameRef = useRef(null)
    const displayRef = useRef(null)
    const [error, setError] = useState({path : null, msg : null})
    const [passwords, setPasswords] = useState({ password : "", confirm : "" })
    async function submit(e){
        e.preventDefault()
        if(passwords.password === ""){
            setError({path : "password", msg : "Fill this field before submitting"})
            return;
        }
        else if(usernameRef.current.value === ""){
            setError({path : "username", msg : "Fill this field before submitting"})
            return;
        }
        else if(passwords.password !== passwords.confirm){
            setError({path : "confirmPassword", msg : "Passwords must match"})
            return;
        }
        const res = await fetch('/api/auth/signup', {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                "email" : emailRef.current.value,
                "username" : usernameRef.current.value,
                "displayName" : displayRef.current.value,
                "password" : passwords.password,
                "confirmPassword" : passwords.confirm
            })
        })
        const result = await res.json()
        if(res.status == 400){
            setError({path : result.errors[0].path, msg : result.errors[0].msg})
        }
        else if(res.status == 200){
            logIn(result.user)
        }
    }
    return (
        <>
        <form className={styles.form} onSubmit={submit} noValidate>
            <div className={styles.table}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <div className={styles.input}>
                        <input type="text" id="username" name="username" ref={usernameRef} required/>
                        {(error.path === "username") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="displayName">Display Name:</label>
                    <div className={styles.input}>
                        <input type="text" id="displayName" name="displayName" ref={displayRef}/>
                    </div>
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <div className={styles.input}>
                        <input type="email" id="email" name="email" ref={emailRef}/>
                        {(error.path === "email") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <div className={styles.input}>
                        <input type="password" id="password" name="password" required onChange={e => {
                            setPasswords(p => ({...p, password : e.target.value}))
                        }}/>
                        {(error.path === "password") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <div className={styles.input}>
                        <input type="password" id="confirmPassword" name="confirmPassword" required onChange={e => {
                            setPasswords(p => ({...p, confirm : e.target.value}))
                        }}/>
                        {(error.path === "confirmPassword") && <p>{error.msg}</p>}
                    </div>
                </div>
            </div>
            <button type="submit">Sign Up</button>
        </form>
        </>
    )
}

export default Signup