import express from 'express'
const app = express()
import router from './routes/routes.js'
import redis from 'redis'
const client = await redis.createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()

app.use(express.json())

app.use("/api/rockets", async (req, res, next) =>{  //Store all rockets in one big cache
    if(req.originalUrl === "/api/rockets"){
        let cacheHit = await client.exists("rocketCache")
        if (cacheHit !== 1){next()}
        else{
            const rocketData = await client.get("rocketCache")
            return res.status(200).json(JSON.parse(rocketData))
        }
    } else{next()}
})

app.use("/api/rockets/:id", async(req, res, next) =>{  //Make a hash for specific id's. 
    if(req.originalUrl !== "/api/rockets/history"){
        if(!req.params.id) throw "Error: No id provided"
        
        const id = req.params.id
        let cacheHit = await client.hExists("rockets", id)
        if(!cacheHit){next()}
        else{
            const rocketData = await client.hGet("rockets", id)
            await client.lPush("history", rocketData)
            return res.status(200).json(JSON.parse(rocketData))
        }
    } else{next()}
})

app.use("/api/launches", async (req, res, next) =>{ //copy paste since logic is the same, just no history tracking.
    if(req.originalUrl === "/api/launches"){
        let cacheHit = await client.exists("launchCache")
        if (cacheHit !== 1){next()}
        else{
            const launchData = await client.get("launchCache")
            return res.status(200).json(JSON.parse(launchData))
        }
    } else{next()}
})

app.use("/api/launches/:id", async(req, res, next) =>{
        if(!req.params.id) throw "Error: No id provided"
        
        const id = req.params.id
        let cacheHit = await client.hExists("launches", id)
        if(!cacheHit){next()}
        else{
            const launchData = await client.hGet("launches", id)
            return res.status(200).json(JSON.parse(launchData))
        }
})

app.use("/api/capsules", async (req, res, next) =>{
    if(req.originalUrl === "/api/capsules"){
        let cacheHit = await client.exists("capsuleCache")
        if (cacheHit !== 1){next()}
        else{
            const capsuleData = await client.get("capsuleCache")
            return res.status(200).json(JSON.parse(capsuleData))
        }
    } else{next()}
})

app.use("/api/capsules/:id", async(req, res, next) =>{
        if(!req.params.id) throw "Error: No id provided"
        
        const id = req.params.id
        let cacheHit = await client.hExists("capsules", id)
        if(!cacheHit){next()}
        else{
            const capsuleData = await client.get(id)
            return res.status(200).json(JSON.parse(capsuleData))
        }
})

app.use(router)

app.use("*", (req,res)=>{
    res.status(404).json({error: 'Route not found'})
})

app.listen(3000, () => {
    console.log("We've now got a server!")
    console.log("Your routes will be running on http://localhost:3000")
})