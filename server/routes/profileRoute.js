import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import passport from "passport";

const profileRouter = Router()

profileRouter.use(passport.authenticate("jwt", {session : false}))

async function getProfile(userId, updData=false){
    const params = {
        where : {
            userId : userId
        },
        select : {
            displayName : true,
            profilePic : true,
            bio : true,
            userId : true,
            id : true,
            user : {
                select : {
                    username : true
                }
            },
            post : true,
            followers : {
                select : {
                    displayName : true,
                    profilePic : true,
                    userId : true,
                    user : true
                }
            },
            following : {
                select : {
                    displayName : true,
                    profilePic : true,
                    userId : true,
                    user : true
                }
            },
            _count : {
                select : {
                    followers : true,
                    following : true
                }
            }
        }
    }
    let profile = {}
    if(updData){
        params.data = updData
        profile = await prisma.profile.update(params)
    }
    else {
        profile = await prisma.profile.findUnique(params)
    }
    return profile
}

profileRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const profile = await getProfile(id, false)
    res.json({profile : profile})
})

profileRouter.get("/", async (req, res) => {
    const substring = req.query.substring
    const profiles = await prisma.profile.findMany({
        where : {
            displayName : {
                contains : substring,
                mode : "insensitive"
            }
        },
        select : {
            profilePic : true,
            displayName : true,
            user : {
                select : {
                    username : true
                }
            },
            userId : true
        }
    })
    res.json({profiles : profiles})
})

profileRouter.put("/", async (req, res) => {
    const {profilePic, displayName, bio} = req.body
    await getProfile(parseInt(req.user.id),
        {
            profilePic : profilePic,
            displayName : displayName,
            bio : bio
        })
    res.status(204).end()
})

profileRouter.post("/follow/:id", async (req, res) => {
    const id = req.params.id
    await getProfile(parseInt(id),{ 
        followers : {
            connect : {
                userId : req.user.id
            }
        }
    })
    res.status(204).end()
})

profileRouter.delete("/unfollow/:id", async (req, res) => {
    const id = req.params.id
    await getProfile(parseInt(id),{
        followers : {
            disconnect : {
                userId : req.user.id
            }
        }
    })
    res.status(204).end()
})

export default profileRouter