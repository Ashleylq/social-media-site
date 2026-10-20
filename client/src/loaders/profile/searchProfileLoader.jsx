import { redirect } from "react-router"

export default async function searchProfile({request}){
    const url = new URL(request.url)
    const query = url.searchParams.toString()
    const res = await fetch(`/api/profile?${query}`)
    if(res.status == 401){
        return redirect('/signup')
    }
    const result = await res.json()
    return result.profiles
}