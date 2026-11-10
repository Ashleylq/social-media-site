import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import passport from "passport";
import commentsRoute from "./commentsRoute.js";

const postsRoute = Router()

postsRoute.use(passport.authenticate("jwt", {session : false}))

postsRoute.post('/', async (req, res) => {
    const { content, attachment, categories, attachmentType } = req.body
    await prisma.post.create({ 
        data : {
            content : content,
            attachment : attachment,
            attachmentType : attachmentType,
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
    try {
        await prisma.post.update({
        where : {
            id : id,
            profile : {
                userId : req.user.id
            }
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

postsRoute.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        await prisma.post.delete({
        where : {
            id : id,
            profile : {
                userId : req.user.id
            }
        }
        })
        res.status(204).end()
    } catch(err){
        res.status(403).end()
    }
})

const postData = {
    profile : {
        include : {
            user : true
        }
    },
    category : true,
    likes : {
        select : {
            userId : true
        }
    },
    dislikes : {
        select : {
            userId : true
        }
    },
    comments : {
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
    }
}

postsRoute.get('/', async (req, res) => {
    const page = parseInt(req.query.page) 
    const posts = await prisma.post.findMany({
        orderBy : {
            uploaded_at : 'desc'
        },
        skip : page,
        take : 10,
        include : postData
    })
    res.json({posts : posts})
})

postsRoute.get('/following', async (req, res) => {
    const page = parseInt(req.query.page) 
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
        take : 10,
        include : postData
    })
    res.json({posts : posts})
})

postsRoute.get('/search', async (req, res) => {
    const category = req.query.category
    const page = parseInt(req.query.page) 
    const posts = await prisma.post.findMany({
        where : {
            category : {
                some : {
                    name : {
                        contains : category,
                        mode : "insensitive"
                    }
                }
            }
        },
        orderBy : {
            uploaded_at : "desc"
        },
        skip : page,
        take : 10,
        include : postData
    })
    res.json({posts : posts})
})

postsRoute.post('/like/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    await prisma.post.update({
        where : {
            id : id
        },
        data : {
            likes : {
                connect : {
                    userId : req.user.id
                }
            },
            dislikes : {
                disconnect : {
                    userId : req.user.id
                }
            }
        }
    })
    res.status(204).end()
})

postsRoute.post('/dislike/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    await prisma.post.update({
        where : {
            id : id
        },
        data : {
            likes : {
                disconnect : {
                    userId : req.user.id
                }
            },
            dislikes : {
                connect : {
                    userId : req.user.id
                }
            }
        }
    })
    res.status(204).end()
})

postsRoute.delete('/unlike/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    await prisma.post.update({
        where : {
            id : id
        },
        data : {
            likes : {
                disconnect : {
                    userId : req.user.id
                }
            },
            dislikes : {
                disconnect : {
                    userId : req.user.id
                }
            }
        }
    })
    res.status(204).end()
})

postsRoute.use('/:postid/comment', commentsRoute)

export default postsRoute