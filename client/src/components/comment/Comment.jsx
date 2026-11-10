import ProfileElement from "../profile/ProfileElement"
import styles from "./comment.module.css"
import { memo, useState } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ReplyIcon from"@mui/icons-material/Reply"
import ReplySection from "./ReplySection"
import { useAudio } from "../../utils/audioContext"

const Comment = memo(function Comment({comment, post, editPost}){
    const {playSfx} = useAudio()
    const [replyVisibility, setReplyVisibility] = useState(false)
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
                        color : replyVisibility ?  "#00aeef" : "#0070c0"
                    }}/>
                </div>
                <div>
                    <FavoriteIcon sx={{
                        fontSize : 20,
                        color : "#0070c0"
                    }}/>
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