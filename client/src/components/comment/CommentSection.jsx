import styles from "./comment.module.css"
import Comment from "./Comment.jsx"
import { useRef } from "react"
import { useAudio } from "../../utils/audioContext.jsx"

export default function CommentSection({editPost, post}){
    const {playSfx} = useAudio()
    const commentRef = useRef(null)
    async function createComment(){
        if(commentRef.current.value.trim() === ""){
            return;
        }
        playSfx("interaction")
        const res = await fetch(`/api/post/${post.id}/comment`, {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                content : commentRef.current.value
            })
        })
        commentRef.current.value = ""
        const result = await res.json()
        const newPost = {...post}
        newPost.comments.push(result.comment)
        editPost(newPost)
    }
    return (
        <>
            <div className={styles.createComment}>
                <input ref={commentRef} name="content" id="content" placeholder="Comment on this post" />
                <button onClick={createComment}>Create</button>
            </div>
            {post.comments.map(comment => <Comment comment={comment} post={post} editPost={editPost}/>)}
        </>
    )
}