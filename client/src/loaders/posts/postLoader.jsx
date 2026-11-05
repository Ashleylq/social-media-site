import { redirect } from "react-router"

export default async function loadPosts({request, params}){
    const url = new URL(request.url)
    let page = url.searchParams.get("page") || 0
    let resUrl
    if(url.pathname === "/posts"){
        resUrl = `/api/post?page=${page}`
    }
    else if(url.pathname === "/posts/following"){
        resUrl = `/api/post/following?page=${page}`
    }
    else {
        resUrl = `/api/post/search?page=${page}&category=${params.category}`
    }
    const res = await fetch(resUrl)
    if(res.status == 401){
        return redirect('/signup')
    }
    else if(!res.ok){
        throw new Response("Internal Error", {status : 500})
    }
    const result = await res.json()
    alert(JSON.stringify(result))
    return result.posts
}