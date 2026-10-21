import { redirect } from "react-router"

export default async function editProfile({request}){
        const data = await request.json()
        const res = await fetch('/api/profile', {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(data)
        })
        if(res.status == 204){
            return redirect('/')
        }
        else if(res.status == 401){
            return redirect('/signup')
        }
        else {
            throw new Response("Internal Error", {status : 500})
        }
    }