import PostElement from "./PostElement";

export default function PostList({posts}){
    return (
        <>
        {posts.map(post => <PostElement post={post}/>)}
        </>
    )
}