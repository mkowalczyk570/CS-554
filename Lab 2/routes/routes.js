import express, { raw } from 'express'
const router = express.Router()
import axios from 'axios'
import redis from 'redis'

const client = await redis.createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()

const apiUrl = "https://api.spacexdata.com/v4/"

router
    .route("/api/rockets/history")
    .get(async (req, res) =>{
        try{
            const rocketHistory = await client.lRange("history", 0, 19)
            if(!rocketHistory || rocketHistory.length === 0){throw "No rocket history found"}
            res.status(200).json(rocketHistory)
        }
        catch(e){
            res.status(500).json({error: e})
            return;
        }
})

router
    .route("/api/rockets")
    .get(async (req, res) =>{
        try{
            const reqUrl = apiUrl + "rockets"
            const rawData = await axios.get(reqUrl)
            const rocketData = JSON.stringify(rawData.data)
            await client.set("rocketCache", rocketData)
            res.status(200).json(JSON.parse(rocketData))
        }catch(e){
            res.status(500).json({error: e})
            return
        }
})


router 
    .route("/api/rockets/:id")
    .get(async (req, res) => {
        const id = req.params.id.toString()
        const reqUrl = apiUrl + "rockets/" + id
        try{
            if(!id){throw "No id provided"}
            const rawData = await axios.get(reqUrl) //put in here in case of failed axios call
            if(!rawData) throw "No rocket of provided ID exists."
        }catch(e){
            res.status(400).json({error: e})
            return;
        }
        try{
            const rawData = await axios.get(reqUrl)
            const rocketData = JSON.stringify(rawData.data)
            await client.lPush("history", rocketData)
            await client.hSet("rockets", id, rocketData)
            res.status(200).json(JSON.parse(rocketData))
        }catch(e){
            res.status(500).json({error: e})
            return;
        }
})
router
    .route("/api/launches")
    .get(async (req, res) =>{
        try{
            const reqUrl = apiUrl + "launches"
            const rawData = await axios.get(reqUrl)
            const launchData = JSON.stringify(rawData.data)
            await client.set("launchCache", launchData)
            res.status(200).json(JSON.parse(launchData))
        }catch(e){
            res.status(500).json({error: e})
            return;
        }
})


router 
    .route("/api/launches/:id")
    .get(async (req, res) => {
        const id = req.params.id.toString()
        const reqUrl = apiUrl + "launches/" + id

        try{
            if(!id){throw "No id provided"}
            const rawData = await axios.get(reqUrl) //put in here in case axios call fails
            if(!rawData) throw "No launch of provided ID exists."
        }catch(e){
            res.status(400).json({error: e})
            return;
        }
        try{
            const rawData = await axios.get(reqUrl)
            const launchData = JSON.stringify(rawData.data)
            await client.hSet("launches", id, launchData)
            res.status(200).json(JSON.parse(launchData))
        }catch(e){
            res.status(500).json({error: e})
            return;
        }
})
router
    .route("/api/capsules")
    .get(async (req, res) =>{
        try{
            const reqUrl = apiUrl + "capsules"
            const rawData = await axios.get(reqUrl)
            const capsuleData = JSON.stringify(rawData.data)
            await client.set("capsuleCache", capsuleData)
            res.status(200).json(JSON.parse(capsuleData))
        }catch(e){
            res.status(500).json({error: e})
            return;
        }
})


router 
    .route("/api/capsules/:id")
    .get(async (req, res) => {
        const id = req.params.id.toString()
        const reqUrl = apiUrl + "capsules/" + id
        try{
            if(!id){throw "No id provided"}
            const rawData = await axios.get(reqUrl)
            if(!rawData) throw "No capsule of provided ID exists."
        }catch(e){
            res.status(400).json({error: e})
            return;
        }
        try{
            const rawData = await axios.get(reqUrl)
            const capsuleData = JSON.stringify(rawData.data)
            await client.hSet("capsules", id, capsuleData)
            res.status(200).json(JSON.parse(capsuleData))
            return;
        }catch(e){
            res.status(500).json({error: e})
            return;
        }
})
    
export default router