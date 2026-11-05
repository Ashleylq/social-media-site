import ProfileElement from "../profile/ProfileElement"
import styles from "./postElement.module.css"

export default function PostElement({post}){
    return (
        <div className={styles.post}>
            <ProfileElement profile={post.profile}/>
            <p>{post.content}</p>
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