import ProfileElement from "../profile/ProfileElement"
import styles from "./comment.module.css"
import { memo, useState } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ReplyIcon from"@mui/icons-material/Reply"
import ReplySection from "./ReplySection"
import { useAudio } from "../../utils/audioContext"
import { getCredentials } from "../../utils/authFunctions"
import { useNavigate } from "react-router"

const Comment = memo(function Comment({comment, post, editPost}){
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
 
    if(error){
        throw error
    }
    
    return (
        <>
        <div className={styles.comment}>
            <ProfileElement profile={comment.profile} mini={true}/>
            <p>{comment.content}</p>
            <p className={styles.date}>{new Date(comment.commented_at).toLocaleString("en-US", {
                day : "numeric",
                month : "long",
                year : "numeric",
                hour : "numeric",
                minute : "numeric"
            })}</p>
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
})

export default Comment