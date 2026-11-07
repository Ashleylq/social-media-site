import { Cloudinary } from "@cloudinary/url-gen"
import ProfileElement from "../profile/ProfileElement"
import styles from "./postElement.module.css"
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { useEffect, useState } from "react";

const cld = new Cloudinary({
    cloud : {
        cloudName : import.meta.env.VITE_CLOUD_NAME
    }
})

export default function PostElement({post}){
    let attachment = null
    if(post.attachment){
        attachment = cld.image(post.attachment)
        .delivery(format("auto"))
        .delivery(quality("auto"))
    }
    /*useEffect(() => {
        if(post.attachment){
            setAttachment(cld.image(post.attachment)
            .delivery(format("auto"))
            .delivery(quality("auto")))
        }
    }, [post.attachment])*/
    return (
        <div className={styles.post}>
            <ProfileElement profile={post.profile}/>
            {attachment && <div className={styles.attachment}>
                {post.attachmentType === "video" && <video src={attachment.toURL()} width="100%" height="auto"/>}
                {post.attachmentType === "image" && <img src={attachment.toURL()} width="100%" height="auto"/>}
            </div>}
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