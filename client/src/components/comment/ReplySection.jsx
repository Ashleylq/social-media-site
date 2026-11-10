import styles from "./comment.module.css"
import Reply from "./Reply.jsx"
import { useRef, useState } from "react"
import { useAudio } from "../../utils/audioContext.jsx"
import { useNavigate } from "react-router"

export default function ReplySection({editPost, post, comment}){
    const {playSfx} = useAudio()
    const replyRef = useRef(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    async function createReply(){
        if(replyRef.current.value.trim() === ""){
            return;
        }
        playSfx("interaction")
        const res = await fetch(`/api/post/${post.id}/comment/${comment.id}/replies`, {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                content : replyRef.current.value
            })
        })
        if(res.status === 401){
            navigate("/signup", {replace : true})
        }
        else if(!res.ok){
            setError(new Response("Internal error", {status : 500}))
        }
        replyRef.current.value = ""
        const result = await res.json()
        const newPost = {...post}
        newPost.comments = newPost.comments.map(mcomment => {
            if(mcomment.id === comment.id){
                mcomment.replies.push(result.reply)
            }
            return mcomment
        })
        editPost(newPost)
    }

    if(error){
        throw error 
    }

    return (
        <>
            <div className={styles.createReply}>
                <input ref={replyRef} name="content" id="content" placeholder="Reply to this comment" />
                <button onClick={createReply}>Create</button>
            </div>
            {comment.replies.map(reply => <Reply reply={reply} post={post} editPost={editPost}/>)}
        </>
    )
}