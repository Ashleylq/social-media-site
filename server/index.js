import express from "express"
import passport from "passport"
import { configPassport } from "./lib/passport.js"
import authRouter from "./routes/authRoute.js"

const app = express()
app.use(passport.initialize())
configPassport(passport)
app.use(express.json())

app.use("/api/auth", authRouter)

app.listen(3000, (err) => {
    if(err){throw(err)}
    console.log("listening")
})