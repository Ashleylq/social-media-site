import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import UserContext from "../../UserContext.jsx"
import styles from "./profile.module.css"
import ProfilePicture from "../../components/ProfilePicture.jsx"

function EditProfile(){
    const {user} = useContext(UserContext)
    const imgRef = useRef(null)
    const bioRef = useRef(null)
    const displayRef = useRef(null)
    const navigate = useNavigate()
    const [profile, setProfile] = useState({
        profilePic : null, 
        displayName: "Lemonade",
        bio : "sup"
    })
    useEffect(() => {
        async function fetchProfile(){
            if(!user || Object.keys(user) === 0){
                navigate('/signup', {replace : true})
            }
            const res = await fetch(`/api/profile/${user.id}`)
            if(res.status === 401){
                navigate('/signup', {replace : true})
            }
            const result = await res.json()
            setProfile(result.profile)
        }
        fetchProfile()
    }, [])
    async function uploadImage(){
        const formdata = new FormData()
        formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
        formdata.append("file", imgRef.current.files[0])
        const imgRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
            method : "POST",
            body : formdata
        })
        const data = await imgRes.json()
        setProfile(p => ({...p, profilePic : data["public_id"]}))
    }
    async function submit(e){
        e.preventDefault()
        const res = await fetch('/api/profile', {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                profilePic : profile.profilePic,
                displayName : displayRef.current.value,
                bio : bioRef.current.value
            })
        })
        if(res.status == 204){
            navigate('/')
        }
        else if(res.status == 401){
            navigate('/signup', {replace : true})
        }
    }
    
    return (
        <>
        {profile && <form className={styles.container} noValidate onSubmit={submit}>
            <div className={styles.pfp}><ProfilePicture size={150} publicId={profile.profilePic}/></div>
            <input onChange={uploadImage} type="file" name="pfp" id="pfp" ref={imgRef} style={{display : "none"}}/>
            <label for="pfp">Choose a profile pic</label>
            <input value={profile.displayName} ref={displayRef} name="displayName" id="displayName"/>
            <textarea value={profile.bio} ref={bioRef} name="bio" id="bio"/>
            <button className={styles.edit} type="submit">Edit</button>
        </form>}
        </>
    )
}

export default EditProfile