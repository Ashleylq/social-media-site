import ProfileElement from "../profile/ProfileElement"
import styles from "./comment.module.css"
import { useRef, useState } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ReplyIcon from"@mui/icons-material/Reply"
import ReplySection from "./ReplySection"
import { useAudio } from "../../utils/audioContext"
import { getCredentials } from "../../utils/authFunctions"
import { useNavigate } from "react-router"

function Comment({comment, post, editPost}){
    const user = getCredentials()
    const {playSfx} = useAudio()
    const [replyVisibility, setReplyVisibility] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [liked, setLiked] = useState(comment.likes.some(like => like.userId === user.id))
    async function like(){
        let res;
        const newPost = {...post}
        playSfx("interaction")
        if(!liked){
            newPost.comments.map(com => {
                if(com.id === comment.id){
                    com.likes.push({userId : user.id})
                }
                return com
            })
            res = await fetch(`/api/post/${post.id}/comment/like/${comment.id}`, {
                method : "POST"
            })
        }
        else {
            newPost.comments.map(com => {
                if(com.id === comment.id){
                    com.likes = com.likes.filter(like => like.userId !== user.id)
                }
                return com
            })
            res = await fetch(`/api/post/${post.id}/comment/unlike/${comment.id}`, {
                method : "DELETE"
            })
        }
        if(res.status === 401){
            navigate("/signup", {replace : true})
        }
        else if(!res.ok){
            setError(new Response("Internal error", {status : 500}))
        }
        setLiked(prev => !prev)
        editPost(newPost)
    }

    async function deleteCom(){
        playSfx("click")
        const newPost = {...post}
        newPost.comments = newPost.comments.filter(com => com.id !== comment.id)
        editPost(newPost)
        const res = await fetch(`/api/post/${post.id}/comment/${comment.id}`, {
            method : "DELETE"
        })
        if(res.status === 401){
            navigate("/signup", {replace : true})
        } else if(res.status === 403){
            setError(new Response("Forbidden", {status : 403}))
        } else if(!res.ok){
            setError(new Response("Internal error", {status : 500}))
        }
    }
 
    const [mode, setMode] = useState("view")
    const editRef = useRef(null)
    async function edit(){
        if(editRef.current.value.trim() === ""){
            return;
        }
        playSfx("click")
        const newPost = {...post}
        newPost.comments = newPost.comments.map(com => {
            if(com.id === comment.id){
                com.content = editRef.current.value
            }
            return com
        })
        editPost(newPost)
        setMode("view")
        const res = await fetch(`/api/post/${post.id}/comment/${comment.id}`, {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({content : editRef.current.value})
        })
        if(res.status === 401){
            navigate("/signup", {replace : true})
        } else if(res.status === 403){
            setError(new Response("Forbidden", {status : 403}))
        } else if(!res.ok){
            setError(new Response("Internal error", {status : 500}))
        }
    }

    if(error){
        throw error
    }
    
    return (
        <>
        <div className={styles.comment}>
            <ProfileElement profile={comment.profile} mini={true}/>
            {mode === "view" ? <p>{comment.content}</p> : <textarea ref={editRef} defaultValue={comment.content}/> }
            <p className={styles.date}>{new Date(comment.commented_at).toLocaleString("en-US", {
                day : "numeric",
                month : "long",
                year : "numeric",
                hour : "numeric",
                minute : "numeric"
            })}</p>
            {comment.profile.userId === user.id && <> {mode === "view" ?
            <div className={styles.flex}>
                <button onClick={() => {
                    playSfx("click")
                    setMode("edit")
                    }} className={styles.edit}>Edit</button>
                <button onClick={deleteCom} className={styles.delete}>Delete</button>
            </div> : <div className={styles.flex}>
                <button onClick={edit} className={styles.edit}>Edit</button>
                <button onClick={() => {
                    setMode("view")
                    playSfx("click")
                    }} className={styles.edit}>Back</button>
            </div>
            } </>}
            <div className={styles.endFlex}>
                <div onClick={() => {
                    playSfx("click")
                    setReplyVisibility(prev => !prev)
                }}>
                    <ReplyIcon sx={{
                        fontSize : 20,
                        color : replyVisibility ?  "#00aeef" : "#0070c0",
                        transition : "color 0.5s ease-out"
                    }}/>
                </div>
                <div onClick={like}>
                    <FavoriteIcon sx={{
                        fontSize : 20,
                        color : liked ? "#32cd32" : "#0070c0",
                        display : "block",
                        margin : "auto",
                        transition : "color 0.5s ease-out"
                    }}/>
                    <p className={styles.num}>{comment.likes.length}</p>
                </div>
            </div>
        </div>
        <div style={{display : replyVisibility ? "block" : "none"}} className={styles.replies}>
            <ReplySection comment={comment} post={post} editPost={editPost}/>
        </div>
        </>
    )
}

export default Comment