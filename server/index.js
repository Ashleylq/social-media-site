import express from "express"
import passport from "passport"
import { configPassport } from "./lib/passport.js"
import profileRouter from "./routes/profileRoute.js"
import authRouter from "./routes/authRoute.js"
import path from "path"
import cookieParser from "cookie-parser"

const app = express()
app.use(passport.initialize())
configPassport(passport)
app.use(cookieParser())
app.use(express.json())
app.set('trust proxy', 1)

app.use("/api/auth", authRouter)
app.use("/api/profile", profileRouter)

app.use(express.static(path.join(import.meta.dirname, "../client/dist")))
app.get("/{*splat}", (req, res) => {
  res.sendFile(
    path.join(import.meta.dirname, "../client/dist/index.html")
  );
});

app.listen(3000, (err) => {
    if(err){throw(err)}
    console.log("listening")
})