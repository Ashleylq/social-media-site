import { useLoaderData, useNavigate } from "react-router"
import ProfilePicture from "../../components/profile/ProfilePicture.jsx"
import styles from "./profile.module.css"
import { logOut } from "../../utils/authFunctions.jsx"

function Profile() {
    const profile = useLoaderData()
    const navigate = useNavigate()
    async function logOutApi(){
        logOut()
        await fetch("/api/auth/logout", {
            method : "POST"
        })
        navigate('/signup', {replace : true})
    }
    return (
        <>
            {profile && <div className={styles.container}>
                <div className={styles.pfp}><ProfilePicture size={150} publicId={profile.profilePic} /></div>
                {(profile.displayName && profile.displayName !== "") ?
                    <><p className={styles.displayName}>{profile.displayName}</p>
                        <p className={styles.username}>{profile.user.username}</p></> :
                    <p className={styles.displayName}>{profile.user.username}</p>}
                <p className={styles.bio}>{profile.bio}</p>
                <div className={styles.flex}>
                    <div className={styles.follows}>
                        <p>Followers: </p>
                        <p style={{fontSize : "1.5rem"}}>{profile._count.followers}</p>
                    </div>
                    <div className={styles.follows}>
                        <p>Following: </p>
                        <p style={{fontSize : "1.5rem"}}>{profile._count.following}</p>
                    </div>
                </div>
                <div className={styles.flex}>
                    <button className={styles.logout} onClick={() => logOutApi()} >Logout</button>
                    <button className={styles.edit} onClick={() => navigate("/profile/edit")}>Edit</button>
                </div>
            </div>
            }
        </>
    )
}

export default Profile