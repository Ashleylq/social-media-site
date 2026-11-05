import { useFetcher, useLoaderData, useLocation } from "react-router"
import PostElement from "../../components/posts/PostElement.jsx"
import { useEffect, useRef, useState } from "react"

function ViewPosts(){
    const location = useLocation()
    const data = useLoaderData()
    const fetcher = useFetcher()
    const [posts, setPosts] = useState(data)
    const [page, setPage] = useState(10)
    const [hasMore, setHasMore] = useState(true)
    const sentinelRef = useRef(null)
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting  && fetcher.state === "idle" && hasMore){
                const path = location.pathname === "/posts" ? "/posts?index&" : `${location.pathname}?`
                fetcher.load(`${path}page=${page}`)
            }
        })
        if(sentinelRef.current){
            observer.observe(sentinelRef.current)
        }
        return () => observer.disconnect()
    }, [page])
    useEffect(() => {
        if (fetcher.state !== "idle" || !fetcher.data) return;
        setPosts((prev) => [...prev, ...fetcher.data])
        setHasMore(fetcher.data.length === 10)
        setPage((prev) => prev + 1)
    }, [fetcher.data])
    return (
        <>
        {posts.map(post => <PostElement post={post}/>)}
        <div ref={sentinelRef}></div>
        </>
    )
}

export default ViewPosts