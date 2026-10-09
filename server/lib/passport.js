import { Strategy as localStrat } from "passport-local";
import { Strategy as jwtStrat } from "passport-jwt";
import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma.js";
import "dotenv/config"

const cookieExtractor = req => {
    let jwt = null
    if(req && req.cookies){
        jwt = req.cookies['token']
    }
    return jwt
}

function configPassport(passport){
    passport.use("local", new localStrat(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({where : {username : username}})
            if(!user){
                return done(null, false, {message: "Incorrect username"})
            }
            const match = await bcrypt.compare(password, user.password)
            if(!match){
                return done(null, false, {message: "Incorrect password"})
            }
            return done(null, user)
        }
        catch(err) {
            return done(err)
        }
    }))
    passport.use("jwt", new jwtStrat({
        jwtFromRequest : cookieExtractor,
        secretOrKey : process.env.JWT_SECRET
    }, async (payload, done) => {
        if(Date.now() > payload.expiration){
            return done('Unauthorized', false)
        }
        try {
            const user = await prisma.user.findUnique({where : {id : payload.id}})
            if(!user){
                return done(null, false)
            }
            return done(null, user)
        }
        catch(err){
            return done(err)
        }
    }))
}

export { configPassport }