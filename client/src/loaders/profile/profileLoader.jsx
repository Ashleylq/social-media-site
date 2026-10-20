import { getCredentials } from "../../utils/authFunctions.jsx"
import { redirect } from "react-router"

export default async function loadProfile(){
    const user = getCredentials()
    if(!user || Object.keys(user).length === 0){
        return redirect('/signup')
    }
    const res = await fetch(`/api/profile/${user.id}`)
    if(res.status == 401){
        return redirect('/signup')
    }
    const result = await res.json()
    return result.profile;
}