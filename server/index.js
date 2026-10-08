import express from "express"
import passport from "passport"
import { configPassport } from "./lib/passport.js"
import authRouter from "./routes/authRoute.js"
import path from "path"

const app = express()
app.use(passport.initialize())
configPassport(passport)
app.use(express.json())
app.set('trust proxy', 1)

app.use("/api/auth", authRouter)

app.use(express.static(path.join(import.meta.dirname, "../client/dist")))

app.listen(3000, (err) => {
    if(err){throw(err)}
    console.log("listening")
})