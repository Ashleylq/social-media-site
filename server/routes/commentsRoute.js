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
            likes : {
                select : {
                    userId : true
                }
            },
            replies : {
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
            }
        }
    })
    res.json({comment : comment})
})

commentsRoute.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        await prisma.comment.delete({
            where : {
                id : id,
                profileId : req.user.profile.id
            }
        })
        res.status(204).end()
    } catch(err){
        res.status(403).end()
    }
})

commentsRoute.put('/:id', async (req, res) => {
    const {content} = req.body
    const id = parseInt(req.params.id)
    try {
        await prisma.comment.update({
            where : {
                id : id,
                profileId : req.user.profile.id
            },
            data : {
                content : content
            }
        })
        res.status(204).end()
    } catch(err){
        res.status(403).end()
    }
})

commentsRoute.post('/like/:id', async (req, res) => {
    await prisma.comment.update({
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

commentsRoute.delete('/unlike/:id', async (req, res) => {
    await prisma.comment.update({
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

commentsRoute.use('/:commentid/replies', repliesRoute)

export default commentsRoute