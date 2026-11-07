import { Cloudinary } from "@cloudinary/url-gen"
import ProfileElement from "../profile/ProfileElement"
import styles from "./postElement.module.css"
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { getCredentials } from "../../utils/authFunctions.jsx"
import { useAudio } from "../../utils/audioContext.jsx";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

const cld = new Cloudinary({
    cloud : {
        cloudName : import.meta.env.VITE_CLOUD_NAME
    }
})

export default function PostElement({post, deletePost, editPost}){
    const {playSfx} = useAudio()
    const user = getCredentials()
    const navigate = useNavigate()
    let attachment = null
    if(post.attachment){
        attachment = cld.image(post.attachment)
        .delivery(format("auto"))
        .delivery(quality("auto"))
    }
    
    const [error, setError] = useState(null)
    async function delPost(){
        playSfx("click")
        deletePost(post.id)
        const res = await fetch(`/api/post/${post.id}`, {
            method : "DELETE"
        })
        if(res.status === 401){
            navigate("/signup", {replace : true})
        }
        else if(res.status === 403){
            setError(new Response("Forbidden", {status : 403}))
        }
    }
    
    const [edErr, setEdErr] = useState(null)
    const [mode, setMode] = useState("view")
    const editRef = useRef(null)
    async function edPost(){
        playSfx("click")
        if(editRef.current.value.trim() === "" && !post.attachment){
            setEdErr("Content should not be empty")
            return;
        }
        const newPost = {...post, content : editRef.current.value}
        editPost(newPost)
        setMode("view")
        setEdErr(null)
        const res = await fetch(`/api/post/${post.id}`, {
            method : "PUT",
            headers : {'Content-Type' : "application/json"},
            body : JSON.stringify({
                content : editRef.current.value
            })
        })
        if(res.status === 401){
            navigate("/signup", {replace : true})
        }
        else if(res.status === 403) {
            setError(new Response("Forbidden", {status : 403}))
        }
    }

    if(error){
        throw error
    }

    return (
        <div className={styles.post}>
            <ProfileElement profile={post.profile}/>
            {attachment && <div className={styles.attachment}>
                {post.attachmentType === "video" && <video src={attachment.toURL()} width="100%" height="auto"/>}
                {post.attachmentType === "image" && <img src={attachment.toURL()} width="100%" height="auto"/>}
            </div>}
            {mode === "view" ?
            <>
            <p>{post.content}</p>
            {post.profile.user.id === user.id && 
            <div className={styles.flex}>
                <button onClick={() => {
                    playSfx("click")
                    setMode("edit")
                }} className={styles.edit}>Edit</button>
                <button onClick={() => delPost()} className={styles.delete}>Delete</button>
            </div>}
            </> : <>
                <textarea ref={editRef} defaultValue={post.content}/>
                {edErr && <p className={styles.error}>{edErr}</p>}
                <div className={styles.flex}>
                    <button onClick={() => edPost()} className={styles.edit}>Edit</button>
                    <button onClick={() => {
                        playSfx("click")
                        setMode("view")
                    }} className={styles.edit}>Back</button>
                </div>
            </>}
            <p className={styles.date}>{new Date(post.uploaded_at).toLocaleString("en-US", {
                    day : "numeric",
                    month : "long",
                    year : "numeric",
                    hour : "numeric",
                    minute : "numeric"
                })}</p>
            {post.category.map((cat, index) => (
                <span key={index}>{cat.name}</span>
            ))}
        </div>
    )
}