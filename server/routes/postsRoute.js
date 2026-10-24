import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import passport from "passport";

const postsRoute = Router()

postsRoute.use(passport.authenticate("jwt", {session : false}))

postsRoute.post('/', async (req, res) => {
    const { content, attachment, categories } = req.body
    await prisma.post.create({ 
        data : {
            content : content,
            attachment : attachment,
            profileId : req.user.profile.id,
            category : {
                connectOrCreate : categories.map(name => ({
                    where : {
                        name : name
                    },
                    create : {
                        name : name
                    }
                }))
            }
        }
    })
    res.status(204).end()
})

postsRoute.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { content } = req.body
    await prisma.post.update({
        where : {
            id : id
        },
        data : {
            content : content
        }
    })
    res.status(204).end()
})

postsRoute.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    await prisma.post.delete({where : {id : id}})
    res.status(204).end()
})

postsRoute.get('/', async (req, res) => {
    const page = parseInt(req.query.page) * 10
    const posts = await prisma.post.findMany({
        orderBy : {
            uploaded_at : 'desc'
        },
        skip : page,
        take : 10
    })
    res.json({posts : posts})
})

postsRoute.get('/following', async (req, res) => {
    const page = parseInt(req.query.page) * 10
    const posts = await prisma.post.findMany({
        where : {
            profile : {
                followers :{
                    some : {
                        id : req.user.profile.id
                    }
                }
            }
        },
        orderBy : {
            uploaded_at : "desc"
        },
        skip : page,
        take : 10
    })
    res.json({posts : posts})
})

postsRoute.get('/search', async (req, res) => {
    const category = req.query.category
    const page = parseInt(req.query.page) * 10
    const posts = await prisma.post.findMany({
        where : {
            category : {
                some : {
                    name : category
                }
            }
        },
        orderBy : {
            uploaded_at : "desc"
        },
        skip : page,
        take : 10
    })
    res.json({posts : posts})
})

export default postsRoute