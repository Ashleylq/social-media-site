import { Link } from "react-router"
import ProfilePicture from "./ProfilePicture.jsx"
import styles from "./profileComponents.module.css"
import { useAudio } from "../../utils/audioContext.jsx"

export default function ProfileElement({profile, mini=false}){
    const {playSfx} = useAudio()
    return (
        <Link onClick={() => playSfx("link")} to={`/profile/${profile.userId}`}>
            <div className={mini ? styles.mini : styles.container}>
                <div className={styles.img}><ProfilePicture publicId={profile.profilePic} size={mini ? 40 : 50}/></div>
                <div className={styles.nameContainer}>
                    <p className={styles.display}>{profile.displayName}</p>
                    <p className={profile.displayName ? styles.user : styles.display}>{profile.user.username}</p>
                </div>
            </div>
        </Link>
    )
}