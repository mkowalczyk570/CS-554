import express from 'express'
const app = express()
import session from 'express-session'
import configRoutes from './routes/index.js';

app.use(express.json())
app.use(session({
    name:"AuthState",
    secret: "Very secret string. Only I know it",
    saveUninitialized: true,
    resave: false,
}))

configRoutes(app)


app.listen(3000, () => {
    console.log("We've now got a server!")
    console.log("Your routes will be running on http://localhost:3000")
})