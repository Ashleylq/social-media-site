import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import UserContext from "../../UserContext.jsx"
import ProfilePicture from "../../components/ProfilePicture.jsx"
import styles from "./profile.module.css"

function Profile() {
    const { user, logOut } = useContext(UserContext)
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchProfile(){
            if(!user || Object.keys(user).length === 0){
                navigate('/signup', {replace : true})
            }
            const res = await fetch(`/api/profile/${user.id}`)
            if(res.status == 401){
                navigate('/signup', {replace : true})
            }
            const result = await res.json()
            setProfile(result.profile)
        }
        fetchProfile()
    }, [])
    async function logOutB(){
        logOut()
        await fetch("/api/auth/logout", {
            method : "POST"
        })
        navigate('/signup')
    }
    return (
        <>
            {profile && <div className={styles.container}>
                <div className={styles.pfp}><ProfilePicture size={150} publicId={profile.profilePic} /></div>
                {(profile.displayName && profile.displayName !== "") ?
                    <><p className={styles.displayName}>{profile.displayName}</p>
                        <p className={styles.username}>{profile.user.username}</p></> :
                    <p className={styles.username}>{profile.username}</p>}
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
                    <button className={styles.logout} onClick={() => logOutB()} >Logout</button>
                    <button className={styles.edit} onClick={() => navigate("/profile/edit")}>Edit</button>
                </div>
            </div>
            }
        </>
    )
}

export default Profile