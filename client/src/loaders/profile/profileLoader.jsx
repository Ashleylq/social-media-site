import { getCredentials } from "../../utils/authFunctions.jsx"
import { redirect } from "react-router"

export default async function loadProfile({params}){
    let id = params.id
    const user = getCredentials()
    if(id === undefined){
        id = user.id
    }
    if(!user || Object.keys(user).length === 0){
        return redirect('/signup')
    }
    const res = await fetch(`/api/profile/${id}`)
    if(res.status == 401){
        return redirect('/signup')
    }
    const result = await res.json()
    return result.profile;
}