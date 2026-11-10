import ProfileElement from "../profile/ProfileElement"
import styles from "./comment.module.css"
import { memo } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"

const Reply = memo(function Reply({reply}){
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

export default Reply