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
            }
        }
    })
    res.json({reply : reply})
})

export default repliesRoute