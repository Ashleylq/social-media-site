import { Link } from "react-router"
import ProfilePicture from "./ProfilePicture.jsx"
import styles from "./profileComponents.module.css"

export default function ProfileElement({profile}){
    return (
            <Link to={`/profile/${profile.userId}`}>
            <div className={styles.container}>
                <div className={styles.img}><ProfilePicture publicId={profile.profilePic} size={50}/></div>
                <div className={styles.nameContainer}>
                    <p className={styles.display}>{profile.displayName}</p>
                    <p className={profile.displayName ? styles.user : styles.display}>{profile.user.username}</p>
                </div>
            </div>
        </Link>
    )
}