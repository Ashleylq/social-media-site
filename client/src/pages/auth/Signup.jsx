import { useAudio } from "../../utils/audioContext"
import styles from "./auth.module.css"
import { useActionData, Form, Link } from "react-router"

function Signup(){
    const error = useActionData()
    const {playSfx} = useAudio()
    return (
        <>
        <Form className={styles.form} method="post" noValidate>
            <div className={styles.table}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <div className={styles.input}>
                        <input type="text" id="username" name="username" required/>
                        {(error && error.path === "username") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="displayName">Display Name:</label>
                    <div className={styles.input}>
                        <input type="text" id="displayName" name="displayName"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <div className={styles.input}>
                        <input type="email" id="email" name="email"/>
                        {(error && error.path === "email") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <div className={styles.input}>
                        <input type="password" id="password" name="password" required/>
                        {(error && error.path === "password") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <div className={styles.input}>
                        <input type="password" id="confirmPassword" name="confirmPassword" required/>
                        {(error && error.path === "confirmPassword") && <p>{error.msg}</p>}
                    </div>
                </div>
            </div>
            <button onClick={() => playSfx("click")} type="submit">Sign Up</button>
            <button onClick={() => playSfx("link")} type="button" className={styles.nav}><Link to={"/login"}>Login</Link></button>
        </Form>
        </>
    )
}

export default Signup