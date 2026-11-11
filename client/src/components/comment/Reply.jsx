import ProfileElement from "../profile/ProfileElement"
import styles from "./comment.module.css"
import { useRef, useState } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import { getCredentials } from "../../utils/authFunctions"
import { useAudio } from "../../utils/audioContext"
import { useNavigate } from "react-router"

const Reply = function Reply({reply, post, editPost}){
    const {playSfx} = useAudio()
    const navigate = useNavigate()
    const user = getCredentials()
    const [error, setError] = useState(null)

    const [liked, setLiked] = useState(reply.likes.some(like => like.userId === user.id))
    async function like(){
        const newPost = {...post}
        let res;
        playSfx("interaction")
        if(!liked){
            newPost.comments.map(com => {
                if(com.id === reply.commentId){
                    com.replies.map(rep => {
                        if(rep.id === reply.id){
                            rep.likes.push({userId : user.id})
                        }
                        return rep
                    })
                }
                return com
            })
            res = await fetch(`/api/post/${post.id}/comment/${reply.commentId}/replies/like/${reply.id}`, {
                method : "POST"
            })
        }
        else {
            newPost.comments.map(com => {
                if(com.id === reply.commentId){
                    com.replies.map(rep => {
                        if(rep.id === reply.id){
                            rep.likes = rep.likes.filter(like => like.userId !== user.id)
                        }
                        return rep
                    })
                }
                return com
            })
            res = await fetch(`/api/post/${post.id}/comment/${reply.commentId}/replies/unlike/${reply.id}`, {
                method : "DELETE"
            })
        }
        if(res.status === 401){
            navigate("/signup", {replaxe : true})
        }
        else if(!res.ok){
            setError(new Response("Internal error", {status : 500}))
        }
        setLiked(prev => !prev)
        editPost(newPost)
    }

    async function deleteRep(){
        playSfx("click")
        const newPost = {...post}
        newPost.comments = newPost.comments.map(com => {
            if(com.id === reply.commentId){
                com.replies = com.replies.filter(rep => rep.id !== reply.id)
            }
            return com
        })
        editPost(newPost)
        const res = await fetch(`/api/post/${post.id}/comment/${reply.commentId}/replies/${reply.id}`, {
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
    async function editRep(){
        if(editRef.current.value.trim() === ""){
            return
        }
        playSfx("click")
        const newPost = {...post}
        newPost.comments = newPost.comments.map(com => {
            if(com.id === reply.commentId){
                com.replies = com.replies.map(rep => {
                    if(rep.id === reply.id){
                        rep.content = editRef.current.value
                    }
                    return rep
                })
            }
            return com
        })
        editPost(newPost)
        setMode("view")
        const res = await fetch(`/api/post/${post.id}/comment/${reply.commentId}/replies/${reply.id}`, {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({content : editRef.current.value})
        })
        if(res.status === 401){
            navigate("/signup", {replace : true})
        } else if(res.status === 403){
            setError(new Response("Forbidden", {status : 403}))
        } else if(!res.ok) {
            setError(new Response("Internal error", {status : 500}))
        }
    }

    if(error){
        throw error
    }
    
    return (
        <>
        <div className={styles.reply}>
            <ProfileElement profile={reply.profile} mini={true}/>
            {mode === "view" ? <p>{reply.content}</p> : <textarea ref={editRef} defaultValue={reply.content}/> }
            <p className={styles.date}>{new Date(reply.commented_at).toLocaleString("en-US", {
                day : "numeric",
                month : "long",
                year : "numeric",
                hour : "numeric",
                minute : "numeric"
            })}</p>
            {reply.profile.userId === user.id && <> {mode === "view" ?
            <div className={styles.flex}>
                <button onClick={() => {
                    playSfx("click")
                    setMode("edit")
                }} className={styles.edit}>Edit</button>
                <button className={styles.delete} onClick={deleteRep}>Delete</button>
            </div> : <div className={styles.flex}>
                <button className={styles.edit} onClick={editRep}>Edit</button>
                <button className={styles.edit} onClick={() => {
                    playSfx("click")
                    setMode("view")
                }}>Back</button>
            </div>} </>}
            <div className={styles.endFlex}>
                <div onClick={like}>
                    <FavoriteIcon sx={{
                        fontSize : 20,
                        color : liked ? "#32cd32" : "#0070c0" ,
                        display : "block",
                        margin : "auto",
                        transition : "color 0.5s ease-out"
                    }}/>
                    <p className={styles.num}>{reply.likes.length}</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Reply