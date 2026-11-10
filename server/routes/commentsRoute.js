import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import repliesRoute from "./repliesRoute.js";

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
            },
            replies : {
                include : {
                    profile : {
                        include : {
                            user : true
                        }
                    }
                }
            }
        }
    })
    res.json({comment : comment})
})

commentsRoute.use('/:commentid/replies', repliesRoute)

export default commentsRoute