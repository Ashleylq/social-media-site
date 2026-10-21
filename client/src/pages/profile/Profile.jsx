import { Link, useLoaderData, useNavigate, useSubmit } from "react-router"
import ProfilePicture from "../../components/profile/ProfilePicture.jsx"
import styles from "./profile.module.css"
import { getCredentials, logOut } from "../../utils/authFunctions.jsx"

function Profile() {
    const profile = useLoaderData()
    const user = getCredentials()
    const navigate = useNavigate()
    async function logOutApi(){
        logOut()
        await fetch("/api/auth/logout", {
            method : "POST"
        })
        navigate('/signup', {replace : true})
    }
    const isFollower = () =>  (profile.followers.some(follower => follower.userId === user.id))
    const submit = useSubmit()
    function follow(){
        submit({
            id : profile.userId,
            intent : isFollower() ? "unfollow" : "follow"
        }, {
            method : isFollower() ? "delete" : "post",
            encType : "application/json"
        })
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
                {(user.id === profile.userId) ? <div className={styles.flex}>
                    <button className={styles.logout} onClick={() => logOutApi()} >Logout</button>
                    <button className={styles.edit}><Link to={"/profile/edit"}>Edit</Link></button>
                </div> : <button onClick={follow} className={styles.follow}>{isFollower() ? "Unfollow" : "Follow"}</button>}
            </div>
            }
        </>
    )
}

export default Profile