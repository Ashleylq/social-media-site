import ProfileElement from "../profile/ProfileElement"
import styles from "./comment.module.css"
import { memo, useState } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import { getCredentials } from "../../utils/authFunctions"
import { useAudio } from "../../utils/audioContext"
import { useNavigate } from "react-router"

const Reply = memo(function Reply({reply, post, editPost}){
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

    if(error){
        throw error
    }
    
    return (
        <>
        <div className={styles.reply}>
            <ProfileElement profile={reply.profile} mini={true}/>
            <p>{reply.content}</p>
            <p className={styles.date}>{new Date(reply.commented_at).toLocaleString("en-US", {
                day : "numeric",
                month : "long",
                year : "numeric",
                hour : "numeric",
                minute : "numeric"
            })}</p>
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
})

export default Reply