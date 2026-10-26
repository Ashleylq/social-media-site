import { redirect } from "react-router";

export default async function follow({request}){
    const formdata = await request.formData()
    const data = Object.fromEntries(formdata)
    let res;
    switch(data["intent"]){
        case "unfollow":
            res = await fetch(`/api/profile/unfollow/${data["id"]}`, {method : "DELETE"})
            break;
        case "follow":
            res = await fetch(`/api/profile/follow/${data["id"]}`, {method : "POST"})
            break;
    }
    if(res.status === 401){
        return redirect('/signup')
    }
    else if(!res.ok){
        throw new Response("Internal Error", {status : 500})
    }
    return;
}