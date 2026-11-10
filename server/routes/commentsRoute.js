import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const commentsRoute = Router({mergeParams : true})

commentsRoute.post('/', async (req, res) => {
    const {content} = req.body
    const postid = parseInt(req.params.postid)
    const comment = await prisma.comment.create({
        data : {
            content : content,
            postId : postid,
            profileId : req.user.profile.id
        },
        include : {
            profile : {
                include : {
                    user : true
                }
            }
        }
    })
    res.json({comment : comment})
})

export default commentsRoute