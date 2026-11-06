import { useFetcher, useLoaderData } from "react-router"
import styles from "./profile.module.css"
import ProfileList from "../../components/profile/ProfileList.jsx"
import { useAudio } from "../../utils/audioContext.jsx"
import { useEffect, useState } from "react"

function SearchProfile(){
    const {playSfx} = useAudio()
    const data = useLoaderData()
    const [profiles, setProfiles] = useState(data)
    const fetcher = useFetcher()
    useEffect(() => {
        if(!fetcher.data || fetcher.state !== "idle"){
            return;
        }
        setProfiles(fetcher.data)
    }, [fetcher.data])
    return (
        <>
        <fetcher.Form method="get" className={styles.searchbar} noValidate>
            <input name="substring" id="displayNameSubstring" placeholder="Search for a profile" required/>
            <button onClick={() => playSfx("click")} type="submit">Search</button>
        </fetcher.Form>
        {profiles.length === 0 && <div className="center">Looks like the profile you are searching for does not even exist -_-</div>}
        {(profiles && profiles.length !== 0) && <ProfileList profiles={profiles}/>}
        </>
    )
}

export default SearchProfile