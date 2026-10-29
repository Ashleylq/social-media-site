import styles from "./auth.module.css"
import { useActionData, Form, Link } from "react-router"

function Login(){
    const error = useActionData()
    return (
        <>
        <Form noValidate className={styles.form} method="post">
            <div className={styles.table}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <div className={styles.input}>
                        <input type="text" id="username" name="username" required/>
                        {(error && error.path === "username") && <p>{error.msg}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <div className={styles.input}>
                        <input type="password" id="password" name="password" required/>
                        {(error && error.path === "password") && <p>{error.msg}</p>}
                    </div>
                </div>
            </div>
            <button type="submit">Login</button>
            {(error && error.path === "global") && <p className={styles.global}>{error.msg}</p>}
            <button className={styles.nav} type="button"><Link to={"/signup"}>Sign Up</Link></button>
        </Form>
        </>
    )
}

export default Login