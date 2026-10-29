import { getCredentials } from "../../utils/authFunctions.jsx"
import { redirect } from "react-router"

export default async function loadProfile({params}){
    let id = params.id
    const user = getCredentials()
    if(!user || Object.keys(user).length === 0){
        return redirect('/signup')
    }
    if(id === undefined){
        id = user.id
    }
    const res = await fetch(`/api/profile/${id}`)
    if(res.status == 401){
        return redirect('/signup')
    }
    if(!res.ok){
        throw new Response("Internal Error", {status : 500})
    }
    const result = await res.json()
    if(!result.profile){
        throw new Response("Resource not found", {status : 404})
    }
    return result.profile;
}