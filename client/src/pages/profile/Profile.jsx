import { Link, useFetcher, useLoaderData, useNavigate } from "react-router"
import ProfilePicture from "../../components/profile/ProfilePicture.jsx"
import ProfileList from "../../components/profile/ProfileList.jsx"
import styles from "./profile.module.css"
import { getCredentials, logOut } from "../../utils/authFunctions.jsx"
import { useCallback, useRef } from "react"
import { useAudio } from "../../utils/audioContext.jsx"
import PostElement from "../../components/posts/PostElement.jsx"
import { useState } from "react"

function Profile() {
    const {playSfx} = useAudio()
    const data = useLoaderData()
    const [profile, setProfile] = useState(data)
    const user = getCredentials()
    const navigate = useNavigate()
    const fersDialogRef = useRef(null)
    const fingDialogRef = useRef(null)
    async function logOutApi(){
        logOut()
        await fetch("/api/auth/logout", {
            method : "POST"
        })
        navigate('/signup', {replace : true})
    }
    const isFollower = () =>  (profile.followers.some(follower => follower.userId === user.id))
    const fetcher = useFetcher()

    const deletePost = useCallback((id) => {
        setProfile(prev => ({...prev, post : prev.post.filter(post => post.id !== id)}))
    }, [])

    const editPost = useCallback((newPost) => {
        setProfile(prev => ({...prev, post : prev.post.map(post => {
            if(post.id === newPost.id){
                return newPost
            }
            else {
                return post
            }
        })}))
    }, [])

    return (
        <>
            <div className={styles.container}>
                <dialog className={styles.dialog} ref={fersDialogRef}>
                    <span onClick={() => {
                        fersDialogRef.current.close()
                        playSfx("click")
                    }}>X</span>
                    <ProfileList profiles={profile.followers} />
                </dialog>
                <dialog className={styles.dialog} ref={fingDialogRef}>
                    <span onClick={() => {
                        fingDialogRef.current.close()
                        playSfx("click")
                    }}>X</span>
                    <ProfileList profiles={profile.following} />
                </dialog>
                <div className={styles.pfp}><ProfilePicture size={150} publicId={profile.profilePic} /></div>
                {(profile.displayName && profile.displayName !== "") ?
                    <><p className={styles.displayName}>{profile.displayName}</p>
                        <p className={styles.username}>{profile.user.username}</p></> :
                    <p className={styles.displayName}>{profile.user.username}</p>}
                <p className={styles.bio}>{profile.bio}</p>
                <div className={styles.flex}>
                    <div className={styles.follows} onClick={() => {
                        fersDialogRef.current.showModal()
                        playSfx("click")
                    }}>
                        <p>Followers: </p>
                        <p style={{fontSize : "1.5rem"}}>{profile._count.followers}</p>
                    </div>
                    <div className={styles.follows} onClick={() => {
                        fingDialogRef.current.showModal()
                        playSfx("click")
                    }}>
                        <p>Following: </p>
                        <p style={{fontSize : "1.5rem"}}>{profile._count.following}</p>
                    </div>
                </div>
                {(user.id === profile.userId) ? <div className={styles.flex}>
                    <button className={styles.logout} onClick={() => {
                        logOutApi()
                        playSfx("click")
                    }} >Logout</button>
                    <button className={styles.edit}><Link onClick={() => playSfx("link")} to={"/profile/edit"}>Edit</Link></button>
                </div> : <>
                    {isFollower() ? 
                    <fetcher.Form method="DELETE">
                        <input name="id" value={profile.userId} style={{display : "none"}}/>
                        <button onClick={() => playSfx("click")} name="intent" value="unfollow" type="submit" className={styles.follow}>{fetcher.state !== "idle" ? "Unfollowing" : "Unfollow"}</button>
                    </fetcher.Form> : 
                    <fetcher.Form method="POST"> 
                        <input name="id" value={profile.userId} style={{display : "none"}}/>
                        <button onClick={() => playSfx("click")} name="intent" value="follow" type="submit" className={styles.follow}>{fetcher.state !== "idle" ? "Following" : "Follow"}</button>
                    </fetcher.Form>} </>
                }
            </div>
            {profile.post.map(post => <PostElement post={post} deletePost={deletePost} editPost={editPost}/>)}
        </>
    )
}

export default Profile