import { login } from "../../utils/authFunctions"
import { redirect } from "react-router"

export default async function signup({request}){
        const formdata = await request.formData()
        const data = Object.fromEntries(formdata)
        if(data.password === ""){
            return ({path : "password", msg : "Fill this field before submitting"})
        }
        else if(data.username === ""){
            return ({path : "username", msg : "Fill this field before submitting"})
        }
        else if(data.password !== data.confirmPassword){
            return ({path : "confirmPassword", msg : "Passwords must match"})
        }
        const res = await fetch('/api/auth/signup', {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(data)
        })
        const result = await res.json()
        if(res.status == 400){
            return ({path : result.errors[0].path, msg : result.errors[0].msg})
        }
        else if(res.status == 200){
            login(result.user)
            return redirect('/')
        }
        else {
            throw new Response("Internal Error", {status : 500})
        }
    }