import { useLoaderData } from "react-router"
import PostList from "../../components/posts/PostList"

function GlobalPosts(){
    const posts = useLoaderData()
    return (
        <PostList posts={posts}/>
    )
}

export default GlobalPosts