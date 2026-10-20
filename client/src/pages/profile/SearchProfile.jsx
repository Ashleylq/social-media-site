import { Form, useLoaderData } from "react-router"
import styles from "./profile.module.css"
import ProfileList from "../../components/profile/ProfileList.jsx"

function SearchProfile(){
    const profiles = useLoaderData()
    return (
        <>
        <Form method="get" className={styles.searchbar} noValidate><input name="substring" id="displayNameSubstring" placeholder="Search for a profile" required/><button type="submit">Search</button></Form>
        {(profiles && profiles.length !== 0) && <ProfileList profiles={profiles}/>}
        </>
    )
}

export default SearchProfile