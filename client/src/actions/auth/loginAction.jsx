import { login } from "../../utils/authFunctions.jsx"
import { redirect } from "react-router"

export default async function loginAction({request}){
    const formData = await request.formData()
    const data = Object.fromEntries(formData);
    if(data.username == ""){
        return {path : "username", msg : "Fill this field before submitting"}
    }
    else if(data.password == ""){
        return ({path : "password", msg : "Fill this field before submitting"})
    }
    const res = await fetch('/api/auth/login', {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify(data)
    })
    const result = await res.json()
    if(res.status == 200){
        login(result.user)
        return redirect("/")
    }
    else if(res.status == 401){
        return ({path : "global", msg : result.message})
    }
}