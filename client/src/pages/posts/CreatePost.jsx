import { Form, useSubmit } from "react-router"
import styles from "./posts.module.css"
import { useRef, useState } from "react"
import { useAudio } from "../../utils/audioContext"

function CreatePost(){
    const imgRef = useRef(null)
    const contentRef = useRef(null)
    const categoryRef = useRef(null)
    const [img, setImg] = useState(null)
    const [categories, setCategories] = useState([])
    const {playSfx} = useAudio()
    function addCategory(e){
        if(e.key === "Enter" || e.key === ","){
            e.preventDefault()
            const category = categoryRef.current.value.trim()
            if(category !== "" && !categories.includes(category)){
                setCategories([...categories, category])
                categoryRef.current.value = ""
            }
        }
    }
    async function uploadImage(){
        const formdata = new FormData()
        formdata.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
        formdata.append("file", imgRef.current.files[0])
        const imgRes = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, {
            method : "POST",
            body : formdata
        })
        const data = await imgRes.json()
        setImg(data["public_id"])
    }
    function submit(e){
        e.preventDefault()
        const submitHook = useSubmit()
        submitHook({
            content : contentRef.current.value,
            attachment : img,
            category : categories
        }, {
            method : "post",
            encType : "application/json"
        })
    }
    return (
        <Form className={styles.form} onSubmit={submit} noValidate>
            <textarea ref={contentRef} placeholder="Content" name="content" id="content"/>
            <input onChange={uploadImage} ref={imgRef} type="file" style={{display : "none"}} name="attachment" id="attachment"/>
            <label for="attachment">Upload Attachment</label>
            <input ref={categoryRef} onKeyDown={addCategory} name="categories" id="categories" placeholder="Category"/>
            {categories.map((category, index) => <p key={index}>{category}<span onClick={() => setCategories(categories.filter((_, i) => i !== index))}>X</span></p>)}
            <button onClick={() => playSfx("click")} className={styles.create}>Create</button>
        </Form>
    )
}

export default CreatePost