import ProfileElement from "../profile/ProfileElement"
import styles from "./comment.module.css"
import { memo } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ReplyIcon from"@mui/icons-material/Reply"

const Comment = memo(function Comment({comment}){
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
                <div>
                    <ReplyIcon sx={{
                        fontSize : 20,
                        color : "#00aeef"
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
        </>
    )
})

export default Comment