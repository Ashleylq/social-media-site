import express from "express"
import passport from "passport"
import { configPassport } from "./lib/passport.js"
import profileRouter from "./routes/profileRoute.js"
import authRouter from "./routes/authRoute.js"
import path from "path"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import "dotenv/config"
import postsRoute from "./routes/postsRoute.js"

const app = express()
app.set('trust proxy', 1)

app.use(passport.initialize())
configPassport(passport)
app.use(cookieParser())
app.use(express.json())

app.use((req,res,next) => {
  if(req.cookies){
    const token = req.cookies['token']
    try {
      const verifiedPayload = jwt.verify(token, process.env.JWT_SECRET)
      if((verifiedPayload.exp + 3600) < Math.floor(Date.now() / 1000)){
        const token = jwt.sign({
          id : req.user.id
        }, process.env.JWT_SECRET, {
          expiresIn : '7d'
        })
        res.cookie('token', token, {
          maxAge : 7 * 24 * 60 * 60 * 1000,
          secure : true,
          httpOnly : true,
          samesite : "lax"
        })
      }
    }
    catch(err){
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'TokenExpiredError', message: 'Token has expired' });
      }
    }
  }
  next()
})

app.use("/api/auth", authRouter)
app.use("/api/profile", profileRouter)
app.use("/api/post", postsRoute)

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