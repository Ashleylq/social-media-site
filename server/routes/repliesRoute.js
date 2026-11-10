import { Router } from "express";
import { prisma } from "../lib/prisma.js"

const repliesRoute = Router({mergeParams : true})

repliesRoute.post('/', async (req, res) => {
    const commentid = parseInt(req.params.commentid)
    const {content} = req.body
    const reply = await prisma.reply.create({
        data : {
            content : content,
            profileId : req.user.profile.id,
            commentId : commentid
        },
        include : {
            profile : {
                include : {
                    user : true
                }
            },
            likes : {
                select : {
                    userId : true
                }
            }
        }
    })
    res.json({reply : reply})
})

repliesRoute.post('/like/:id', async (req, res) => {
    await prisma.reply.update({
        where : {
            id : parseInt(req.params.id)
        },
        data : {
            likes : {
                connect : {
                    userId : req.user.id
                }
            }
        }
    })
    res.status(204).end()
})

repliesRoute.delete("/unlike/:id", async (req, res) => {
    await prisma.reply.update({
        where : {
            id : parseInt(req.params.id)
        },
        data : {
            likes : {
                disconnect : {
                    userId : req.user.id
                }
            }
        }
    })
    res.status(204).end()
})

export default repliesRoute