import { useFetcher, useLoaderData } from "react-router"
import styles from "./profile.module.css"
import ProfileList from "../../components/profile/ProfileList.jsx"
import { useAudio } from "../../utils/audioContext.jsx"

function SearchProfile(){
    const {playSfx} = useAudio()
    const profiles = useLoaderData()
    const fetcher = useFetcher()
    return (
        <>
        <fetcher.Form method="get" className={styles.searchbar} noValidate>
            <input name="substring" id="displayNameSubstring" placeholder="Search for a profile" required/>
            <button onClick={() => playSfx("click")} type="submit">Search</button>
        </fetcher.Form>
        {(profiles && profiles.length !== 0) && <ProfileList profiles={profiles}/>}
        </>
    )
}

export default SearchProfile