import { Cloudinary } from "@cloudinary/url-gen"
import ProfileElement from "../profile/ProfileElement"
import styles from "./postElement.module.css"
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { getCredentials } from "../../utils/authFunctions.jsx"
import { useAudio } from "../../utils/audioContext.jsx";
import { useRef, useState, memo } from "react";
import { useNavigate } from "react-router";
import CommentIcon from "@mui/icons-material/Comment"
import ThumbDownIcon from "@mui/icons-material/ThumbDown"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"

const cld = new Cloudinary({
    cloud : {
        cloudName : import.meta.env.VITE_CLOUD_NAME
    }
})

const PostElement = memo(function PostElement({post, deletePost, editPost}){
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
        else if(!res.ok){
            setError(new Response("Internal error", {status : 500}))
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
        else if(!res.ok){
            setError(new Response("Internal error", {status : 500}))
        }
    }

    const [liked, setLike] = useState(post.likes.some(like => like.userId === user.id))
    const [disliked, setDislike] = useState(post.dislikes.some(dislike => dislike.userId === user.id))
    async function like(){
        playSfx("interaction")
        if(!liked){
            setLike(true)
            setDislike(false)
            const newPost = {...post}
            newPost.likes.push({userId : user.id})
            newPost.dislikes = newPost.dislikes.filter(dislike => dislike.userId !== user.id)
            editPost(newPost)
            const res = await fetch(`/api/post/like/${post.id}`, {
                method : "POST"
            })
            if(res.status === 401){
                navigate("/signup", {replace : true})
            }
            else if(!res.ok){
                setError(new Response("Internal error", {status : 500}))
            }
        } else {
            setLike(false)
            const newPost = {...post}
            newPost.likes = newPost.likes.filter(like => like.userId !== user.id)
            editPost(newPost)
            const res = await fetch(`/api/post/unlike/${post.id}`, {
                method : "DELETE"
            })
            if(res.status === 401){
                navigate("/signup", {replace : true})
            }
            else if(!res.ok){
                setError(new Response("Internal error", {status : 500}))
            }
        }
    }

    async function dislike(){
        playSfx("interaction")
        if(!disliked){
            setLike(false)
            setDislike(true)
            const newPost = {...post}
            newPost.dislikes.push({userId : user.id})
            newPost.likes = newPost.likes.filter(like => like.userId !== user.id)
            editPost(newPost)
            const res = await fetch(`/api/post/dislike/${post.id}`, {
                method : "POST"
            })
            if(res.status === 401){
                navigate("/signup", {replace : true})
            }
            else if(!res.ok){
                setError(new Response("Internal error", {status : 500}))
            }
        } else {
            setDislike(false)
            const newPost = {...post}
            newPost.dislikes = newPost.dislikes.filter(dislike => dislike.userId !== user.id)
            editPost(newPost)
            const res = await fetch(`/api/post/unlike/${post.id}`, {
                method : "DELETE"
            })
            if(res.status === 401){
                navigate("/signup", {replace : true})
            }
            else if(!res.ok){
                setError(new Response("Internal error", {status : 500}))
            }
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
            <div className={styles.endFlex}>
                <div className={styles.centerFlex}>
                    <div onClick={() => like()}>
                        <ThumbUpIcon sx={{
                            fontSize : 32,
                            transition : 'color 0.5s ease-out',
                            color : liked ? '#32CD32' : '#0070C0',
                            display : "block",
                            margin : "auto"
                        }} />
                        <p className={styles.num}>{post.likes.length}</p>
                    </div>
                    <div onClick={() => dislike()}>
                        <ThumbDownIcon sx={{
                            fontSize : 32,
                            transition : 'color 0.5s ease-out',
                            color : disliked ? '#D55E0F' : '#0070C0',
                            display : "block",
                            margin : "auto"
                        }} />
                        <p className={styles.num}>{post.dislikes.length}</p>
                    </div>
                </div>
            </div>
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
})

export default PostElement