import { Link, Outlet } from "react-router";
import styles from "./posts.module.css"
import { useAudio } from "../../utils/audioContext";
import { useState } from "react";

function Posts(){
    const {playSfx} = useAudio()
    const [category, setCategory] = useState("")
    return (
        <>
        <div className={styles.searchbar}>
            <input onChange={(e) => setCategory(e.target.value)} name="category" id="category" placeholder="Search for a category" />
            <button onClick={() => playSfx("link")}><Link to={`/posts/category/${category}`}>Search</Link></button>
        </div>
        <nav className={styles.nav}>
            <Link onClick={() => playSfx("link")} to={"/posts"}>All Posts</Link>
            <Link onClick={() => playSfx("link")} to={"/posts/following"}>For You</Link>
            <Link onClick={() => playSfx("link")} to={"/posts/create"}>Create Post</Link>
        </nav>
        <Outlet/>
        </>
    )
}

export default Posts