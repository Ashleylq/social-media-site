import { useState, useRef } from "react"
import { useLoaderData, useSubmit, Form } from "react-router"
import styles from "./profile.module.css"
import ProfilePicture from "../../components/profile/ProfilePicture.jsx"
import { useAudio } from "../../utils/audioContext.jsx"

function EditProfile(){
    const {playSfx} = useAudio()
    const profile = useLoaderData()
    const imgRef = useRef(null)
    const [error, setError] = useState(null)
    const [img, setImg] = useState(profile ? profile.profilePic : null)
    async function uploadImage(){
        const formdata = new FormData()
        const allowedType = ["image/png", "image/jpeg", "image/webp"]
        if(!allowedType.includes(imgRef.current.files[0].type)){
            setError("Files should be in jpeg, png or webp format")
            return;
        }
        else {
            setError(null)
        }
        formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
        formdata.append("file", imgRef.current.files[0])
        const imgRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
            method : "POST",
            body : formdata
        })
        const data = await imgRes.json()
        setImg(data["public_id"])
    }
    const submitHook = useSubmit()
    function submit(e){
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const formValues = Object.fromEntries(formData.entries());
        submitHook({
            profilePic : img,
            displayName : formValues.displayName,
            bio : formValues.bio
        }, {
            method : "put",
            encType : "application/json"
        })
    }
    
    return (
        <>
        {profile && <Form className={styles.container} noValidate onSubmit={submit}>
            <div className={styles.pfp}><ProfilePicture size={150} publicId={img}/></div>
            <input onChange={uploadImage} type="file" name="pfp" id="pfp" ref={imgRef} style={{display : "none"}}/>
            {error && <p className={styles.error}>{error}</p>}
            <label for="pfp">Choose a profile pic</label>
            <input placeholder="Display Name" defaultValue={profile.displayName} name="displayName" id="displayName"/>
            <textarea placeholder="Bio" defaultValue={profile.bio} name="bio" id="bio"/>
            <button onClick={() => playSfx("click")} className={styles.edit} type="submit">Edit</button>
        </Form>}
        </>
    )
}

export default EditProfile