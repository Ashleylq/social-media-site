import { Router } from "express"
import { body, matchedData, validationResult } from "express-validator"
import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import passport from "passport"

const authRouter = Router()

authRouter.post('/signup',
    [
        body("email")
        .trim()
        .optional({values : "falsy"})
        .customSanitizer(value => value ? value : undefined)
        .isEmail().withMessage("Invalid Email Address"),
        body("username")
        .trim()
        .custom(async value => {
            const user = await prisma.user.findUnique({ where : {username : value}})
            if(user){
                throw new Error("Username already exists")
            }
            else {
                return true
            }
        }),
        body("displayName")
        .trim()
        .optional({values : "falsy"})
        .customSanitizer(value => value ? value : undefined),
        body("password").trim(),
        body("confirmPassword")
        .trim()
        .custom(async (value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Passwords should match")
            }
            else {
                return true
            }
        })
    ],
    async(req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json(errors)
        }
        const {email, password, username, displayName} = matchedData(req, {includeOptionals:true})
        const hashed = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({data : {
            email : email,
            password : hashed,
            username : username,
            displayName : displayName
        }})
        const token = jwt.sign({
            id : user.id
        }, process.env.JWT_SECRET, {
            expiresIn : '7d'
        })
        res.cookie('token', token, {
            maxAge : 7 * 24 * 60 * 60 * 1000,
            httpOnly : true,
            secure : true,
            sameSite : 'lax'
        })
        res.json({
            user : user
        })
})

authRouter.post('/login', async (req, res) => {
    passport.authenticate("local", {session : false}, (err, user, info) => {
        if(err){
            res.status(500).json(err)
        }
        else if(!user){
            res.status(401).json(info)
        }
        else {
            const token = jwt.sign({
                id : user.id
            }, process.env.JWT_SECRET, {
                expiresIn : '7d'
            })
            res.cookie('token', token, {
                maxAge : 7 * 24 * 60 * 60 * 1000,
                secure : true,
                httpOnly : true,
                sameSite : 'lax'
            })
            res.json({
                user : user
            })
        }
    })(req, res)
})

authRouter.post('/logout', async (req, res) => {
    passport.authenticate('local', {session : false}, (err, user, info) => {
        if(err){
            return res.status(500).json(err);
        }
        else if(!user){
            return res.status(401).json(info);
        }
        else {
            res.clearCookie("token")
            res.send("Successfully logged out")
        }
    })(req, res)
})

export default authRouter