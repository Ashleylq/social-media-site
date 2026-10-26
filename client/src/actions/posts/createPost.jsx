import { redirect } from "react-router"

export default async function createPost({request}){
    const data = await request.json()
    const res = await fetch('/api/post', {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(data)
    })
    if(res.status == 204){
        return redirect('/posts')
    }
    else if(res.status == 401){
        return redirect('/signup')
    }
    else {
        throw new Response("Internal Error", {status : 500})
    }
}